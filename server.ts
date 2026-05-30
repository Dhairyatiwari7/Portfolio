import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer, loadEnv } from "vite";
import { resumeData } from "./src/resumeData.js";

// Load environment variables based on current execution mode (defaults to development)
// This extracts variables starting with VITE_ and exposes them to the Node backend process.
const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
Object.assign(process.env, env);

// Initialize express app
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory array for persistent lead tracking across the demo
interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  message: string;
  timestamp: string;
  autoResponse?: string;
}

const leads: Lead[] = [
  {
    id: "lead-default-1",
    name: "John Bradley",
    company: "Google Recruiting",
    email: "j.bradley@google.com",
    message: "Hey Dhairya, love your MERN work on SafarBuddy and the Tomato disease model! Let's arrange a interview call.",
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    autoResponse: "Hey John! Thank you for reviewing DevLaunch and SafarBuddy. I would love to connect and talk more about how my background in distributed systems fits the role. Let me know your available times!"
  }
];

// Lazy-initialize Gemini API to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  // Grab the key safely from process.env now that loadEnv has matched and injected it
  const apiKey = process.env.VITE_GEMINI_API_KEY || "";
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY environment variable is not set up correctly.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Recruiter Chat Agent
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid messages payload." });
      return;
    }

    const client = getGeminiClient();

    // System instruction acts as the strict persona context of Dhairya Tiwari
    const systemPrompt = `
      You are "Dhairya's Professional AI Envoy" - a digital, interactive version of Dhairya Tiwari (Full-Stack Developer and ML Engineer, studying B.Tech CSE at VIT Chennai, Expected 2027, CGPA 9.3).
      Your core mission is to represent Dhairya professionally to recruiters, tech leads, or builders who visit his website.
      
      Here are the strict rules you must adhere to:
      1. Speak as a confident, highly capable, professional, and friendly engineer. 
      2. Support your answers EXACTLY using the Resume Data provided below. NEVER invent facts, scores, dates, or projects.
      3. If asked about a tech stack NOT mentioned, state that while you haven't deployed it yet, you pick up frameworks quickly (as demonstrated by your FastAPI and open router projects) and can adapt.
      4. Avoid typing in blocks. Keep answers conversational, structurally neat, with selective bullet points.
      5. The visitor to the portfolio may ask to schedule an interview or download your resume. Tell them to use the interactive contact form on the side or bottom to submit their query, which instantly notifies you and unlocks the direct PDF resume.

      Dhairya's Official Resume Facts:
      - EDUCATION: VIT Chennai, B.Tech CSE (Expected 2027, CGPA 9.3). Puranchandra Vidyaniketan (Class XII (2023): 95.8%), Birla School Pilani (Class X (2021): 90.2%).
      - INTERNSHIPS:
        - BrandedBuddies (Full-Stack Intern, May - June 2025). Built 'SafarBuddy' travel portal using React, Node, MongoDB. High performance improvements via lazy loading.
        - DevLaunch Pvt Ltd (Web Developer Intern, May - July 2025). Built full-stack production platform 'pujapathseva.com' with OTP-auth, role management schemas, and gateway integrations.
      - CORE PROJECTS:
        - Prescripto Healthcare: MERN platform, JWT, RBAC, conflict-aware live calendar queues.
        - AI Website Builder: Dynamic layout schemas generator using OpenRouter API, TypeScript, Prisma ORM, PostgreSQL, Stripe tier limits.
        - Tomato Disease Predictor: GoogLeNet (Inception v1) CNN model on PyTorch + FastAPI, 10-class PlantVillage diagnostic helper.
      - STACK & SKILLS: Python, C++, Java, Node.js, React.js, Tailwind CSS, PostgreSQL, MongoDB, PyTorch, PySpark/Panda pipelines, Git/GitHub actions.
      - KEY ACHIEVEMENTS: Solved 730+ problems on LeetCode with contest rating 1750+. Winner of EmpowerTech Hackathon (1st Place). Rank 8 of 250+ at HacknDroid.
    `;

    // Map the incoming array of messages specifically to contents expected by the SDK
    const contentPayload = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Perform generation using correct systemInstruction assignment block
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contentPayload,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const aiText = response.text || "I apologize, but I could not formulate a response. Can you ask that again?";
    res.json({ message: aiText });
  } catch (err: any) {
    console.error("Chat API Error:", err);
    res.status(500).json({
      error: "AI Envoy offline",
      message: err.message || "Something went wrong"
    });
  }
});

// 2. API: Submit Recruiter Query & Generate Automated Custom Response
app.post("/api/contact", async (req, res) => {
  try {
    const { name, company, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: "Missing required contact name, email, or content." });
      return;
    }

    let defaultGreeting = `Hi ${name}, thank you for reaching out! I appreciate your interest in my background. I have received your message regarding '${message.substring(0, 30)}...' and will follow up with you personally via ${email} soon. Feel free to download my resume below!`;

    try {
      const client = getGeminiClient();
      const prompt = `
        You are Dhairya Tiwari, a full-stack developer and ML engineer.
        A recruiter or stakeholder has contacted you through your website contact form.
        Generate a dynamic, professional, friendly automated personalized email response.
        Address them by name if provided, reference their company, and comment briefly with excitement and deep passion regarding their message.
        Keep it concise (around 3 to 4 elegant sentences). Tell them you would love to hop on a call or discuss this.
        
        Recruiter Details:
        Name: ${name}
        Company: ${company || "a forward-thinking team"}
        Email: ${email}
        Message: ${message}
      `;

      // Structure safely within the expected structural array parameters
      const aiResponse = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { temperature: 0.8 }
      });

      if (aiResponse.text) {
        defaultGreeting = aiResponse.text.trim();
      }
    } catch (aiErr) {
      console.warn("Could not generate personalized automated greeting, falling back to clean template.", aiErr);
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      company: company || "Independent",
      email,
      message,
      timestamp: new Date().toISOString(),
      autoResponse: defaultGreeting
    };

    leads.push(newLead);

    res.json({
      success: true,
      message: "Lead submitted successfully!",
      lead: newLead,
      autoReply: defaultGreeting
    });
  } catch (err: any) {
    console.error("Contact API Server Error:", err);
    res.status(500).json({ error: "Could not register contact query." });
  }
});

// 3. API: Fetch Outgoing/Incoming Lead Dashboard (Recruiter CRM Sandbox)
app.get("/api/messages", (req, res) => {
  res.json({ leads });
});

app.post("/api/messages/delete", (req, res) => {
  const { id } = req.body;
  const index = leads.findIndex(lead => lead.id === id);
  if (index > -1) {
    leads.splice(index, 1);
    res.json({ success: true, message: "Lead removed from sandbox dashboard." });
  } else {
    res.status(404).json({ error: "Lead not found." });
  }
});

// 4. API: Standalone Raw Markdown Resume Export to ensure clean instant downloads for recruiters
app.get("/api/download-resume", (req, res) => {
  const resumeMarkdown = `
# DHAIRYA TIWARI
**Full-Stack Developer & ML Engineer**
+91-9721631005 | dhairyatiwari186@gmail.com
GitHub: https://github.com | LinkedIn: https://linkedin.com

## PROFESSIONAL SUMMARY
Full-Stack Developer and ML Engineer with hands-on production internship experience in scalable MERN stack ecosystems, RESTful APIs, JWT authentication, and deep learning deployment. Skilled in cloud infrastructure, database optimization, distributed backend architectures, and predictive ML systems. Experienced in developing production-grade applications with a strong focus on performance optimization, scalable system design, and end-to-end software delivery.

## EDUCATION
* **Vellore Institute of Technology, Chennai** - B.Tech CSE (Expected 2027) | **CGPA: 9.3**
  * Relevant Coursework: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Machine Learning, OOP
* **Puranchandra Vidyaniketan (CBSE)** - Class XII (2023) | **95.8%**
* **Birla School Pilani (CBSE)** - Class X (2021) | **90.2%**

## INTERNSHIPS
* **BrandedBuddies** — Software Development Intern (Full-Stack) [May 2025 - June 2025]
  * Built and deployed SafarBuddy (thesafarbuddy.com) using React.js, Node.js, and MongoDB handling bookings.
  * Designed REST APIs with JWT auth, session workflows, and optimized MongoDB aggregation schemas.
  * Improved frontend performance via lazy loading, memoization, and responsive cross-device views.
* **DevLaunch Pvt Ltd** — Web Developer Intern [May 2025 - July 2025]
  * Developed pujapathseva.com full-stack integration with OTP-auth, roles, and online payment workflows.
  * Designed normalized MySQL schemas and optimized server queries under index rules.

## PROJECTS
* **Prescripto Healthcare Management System**
  * Full-stack MERN suite for multi-role registration, conflict-aware scheduling, and JWT dashboarding.
* **AI Website Builder**
  * Dynamic layout site builder utilizing OpenRouter prompts, Prisma ORM, PostgreSQL, and Stripe tiers.
* **Tomato Disease Predictor**
  * Fine-tuned GoogLeNet PyTorch CNN classifier with 10 classes; deployed via FastAPI microservice backend.

## TECHNICAL SKILLS
* **Languages**: Python, C, C++, Java, JavaScript, TypeScript, SQL
* **Frontend**: React.js, HTML5, CSS3, Responsive UI Design, Tailwind CSS
* **Backend**: Node.js, Express.js, FastAPI, REST APIs, JWT, RBAC
* **Databases**: MongoDB, MySQL, PostgreSQL, Prisma ORM
* **ML / AI**: NumPy, Pandas, Scikit-learn, PyTorch, CNN, Transfer Learning
* **Deployment & Tools**: Vercel, Render, CI/CD, Git, Postman, Github Actions

## ACHIEVEMENTS & CERTIFICATIONS
* **730+ LeetCode Solved** (Contest Rating 1750+), consistently ranked in global top ranges.
* **1st Place Winner** — EmpowerTech Hackathon.
* **MERN cert (Udemy)** & **Citi ICG Technology SWE Sim** (Loan UML patterns & credit risk research).
  `;

  res.setHeader("Content-disposition", "attachment; filename=Dhairya_Tiwari_Resume.md");
  res.setHeader("Content-type", "text/markdown");
  res.send(resumeMarkdown);
});

// Setup Vite development middleware OR Production static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dhairya's Elite Interactive Full-Stack Server running on port ${PORT}`);
  });
}

startServer();