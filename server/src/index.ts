import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import { RESUME_CONTEXT } from "./resumePrompt.js";

dotenv.config();

function sendJSON(res: express.Response, status: number, data: unknown) {
  return res.status(status).type("application/json").json(data);
}

const app = express();
const PORT = Number(process.env.PORT) || 3001;

function normalizeOrigin(url: string): string {
  let value = url.trim().replace(/\/$/, "");
  if (value && !/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }
  return value;
}

function buildAllowedOrigins(): Set<string> {
  const fromEnv = [
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS?.split(",") ?? []),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]
    .filter((o): o is string => Boolean(o?.trim()))
    .map(normalizeOrigin);

  return new Set(fromEnv);
}

const allowedOrigins = buildAllowedOrigins();

/** Allow Render static sites (*.onrender.com) in production when FRONTEND_URL is missing. */
function isAllowedOrigin(origin: string): boolean {
  const normalized = normalizeOrigin(origin);
  if (allowedOrigins.has(normalized)) {
    return true;
  }
  if (/^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(normalized)) {
    return true;
  }
  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      console.warn(
        `CORS blocked origin: ${origin}. Set FRONTEND_URL on the API service. Allowed: ${[...allowedOrigins].join(", ")}`,
      );
      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("*", cors());
app.use(express.json());

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
    message:
      "Hey Dhairya, love your MERN work on SafarBuddy and the Tomato disease model! Let's arrange a interview call.",
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    autoResponse:
      "Hey John! Thank you for reviewing DevLaunch and SafarBuddy. I would love to connect and talk more about how my background in distributed systems fits the role. Let me know your available times!",
  },
];

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
] as const;

let aiClient: GoogleGenAI | null = null;
let cachedApiKey: string | null = null;

function readGeminiApiKey(): string {
  const raw =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    "";
  return raw.trim().replace(/^["']|["']$/g, "");
}

function isLikelyValidGeminiKey(key: string): boolean {
  return key.startsWith("AIza");
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = readGeminiApiKey();

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "GEMINI_API_KEY not configured. Set GEMINI_API_KEY on the Render API service.",
    );
  }

  if (!isLikelyValidGeminiKey(apiKey)) {
    throw new Error(
      "Invalid GEMINI_API_KEY format. Create a key at https://aistudio.google.com/apikey — it should start with AIzaSy. AQ.* tokens from AI Studio apps often do not work on the server.",
    );
  }

  if (!aiClient || cachedApiKey !== apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
    cachedApiKey = apiKey;
  }

  return aiClient;
}

function geminiErrorMessage(err: unknown): string {
  const status = (err as { status?: number })?.status;
  const message = String((err as Error)?.message ?? err ?? "");

  if (
    status === 401 ||
    status === 403 ||
    /api.?key|invalid.*key|permission/i.test(message)
  ) {
    return "Gemini API key is missing or invalid on the server. In Render → API service → Environment, set GEMINI_API_KEY from https://aistudio.google.com/apikey (starts with AIzaSy).";
  }
  if (status === 503 || /high demand|overloaded/i.test(message)) {
    return "Gemini is temporarily overloaded. Please try again in a moment.";
  }
  if (/not found|MODEL/i.test(message)) {
    return "Gemini model unavailable. The server will retry with another model on the next deploy.";
  }
  return "The AI assistant could not respond right now. Please try again or use the contact form.";
}

async function generateWithRetry(
  client: GoogleGenAI,
  contentPayload: { role: string; parts: { text: string }[] }[],
  systemPrompt: string,
) {
  let lastError: unknown;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await client.models.generateContent({
          model,
          contents: contentPayload,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });
      } catch (err: unknown) {
        lastError = err;
        const status = (err as { status?: number })?.status;
        const message = String((err as Error)?.message ?? "");

        if (
          status === 404 ||
          /not found|not supported|invalid model/i.test(message)
        ) {
          console.warn(`Gemini model ${model} unavailable, trying next model.`);
          break;
        }

        if (status === 503 && attempt < 2) {
          await new Promise((resolve) =>
            setTimeout(resolve, 2000 * (attempt + 1)),
          );
          continue;
        }

        throw err;
      }
    }
  }

  throw lastError;
}

const CHAT_SYSTEM_PROMPT = `You are "Dhairya's Professional AI Envoy" — a digital representative of Dhairya Tiwari.
Answer professionally, concisely, and only using the resume data below.
If asked something outside this profile, say you can only discuss Dhairya's professional background.

${RESUME_CONTEXT}`;

app.get("/health", (_req, res) => {
  const key = readGeminiApiKey();
  sendJSON(res, 200, {
    ok: true,
    geminiConfigured: Boolean(key && key !== "MY_GEMINI_API_KEY"),
    geminiKeyFormatOk: isLikelyValidGeminiKey(key),
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return sendJSON(res, 400, { error: "Invalid messages payload." });
    }

    const contentPayload = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }),
    );

    try {
      const client = getGeminiClient();
      const response = await generateWithRetry(
        client,
        contentPayload,
        CHAT_SYSTEM_PROMPT,
      );

      const aiText =
        response?.text ||
        "I apologize, but I could not generate a response at the moment.";

      return sendJSON(res, 200, { success: true, message: aiText });
    } catch (aiErr: unknown) {
      console.error("Gemini API Error:", aiErr);
      return sendJSON(res, 200, {
        success: true,
        message: geminiErrorMessage(aiErr),
        fallback: true,
      });
    }
  } catch (err) {
    console.error("Chat API Error:", err);
    return sendJSON(res, 200, {
      success: true,
      message:
        "Something went wrong while processing your request. Please try again later.",
      fallback: true,
    });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, company, email, message } = req.body;

    if (!name || !email || !message) {
      return sendJSON(res, 400, {
        error: "Missing required contact name, email, or content.",
      });
    }

    let defaultGreeting = `Hi ${name}, thank you for reaching out! I appreciate your interest in my background. I have received your message and will follow up with you personally at ${email} soon. Feel free to download my resume below!`;

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

      const aiResponse = await generateWithRetry(
        client,
        [{ role: "user", parts: [{ text: prompt }] }],
        "You are Dhairya Tiwari, a full-stack developer. Write a brief, warm professional email reply to a recruiter.",
      );

      if (aiResponse?.text) {
        defaultGreeting = aiResponse.text.trim();
      }
    } catch (aiErr) {
      console.warn(
        "Could not generate AI response, using default template:",
        aiErr,
      );
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      company: company || "Independent",
      email,
      message,
      timestamp: new Date().toISOString(),
      autoResponse: defaultGreeting,
    };

    leads.push(newLead);
    console.log(`New lead received: ${name} from ${company || "Independent"}`);

    return sendJSON(res, 200, {
      success: true,
      message: "Lead submitted successfully!",
      lead: newLead,
      autoReply: defaultGreeting,
    });
  } catch (err: unknown) {
    console.error("Contact API Server Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return sendJSON(res, 500, {
      error: "Could not register contact query.",
      details: message,
    });
  }
});

app.get("/api/messages", (_req, res) => {
  return sendJSON(res, 200, { leads });
});

app.post("/api/messages/delete", (req, res) => {
  try {
    const { id } = req.body;
    const index = leads.findIndex((lead) => lead.id === id);
    if (index > -1) {
      leads.splice(index, 1);
      return sendJSON(res, 200, {
        success: true,
        message: "Lead removed from sandbox dashboard.",
      });
    }
    return sendJSON(res, 404, { error: "Lead not found." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return sendJSON(res, 500, { error: "Delete failed", details: message });
  }
});

app.get("/api/download-resume", (_req, res) => {
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

  res
    .type("text/markdown")
    .setHeader("Content-disposition", "attachment; filename=Dhairya_Tiwari_Resume.md")
    .send(resumeMarkdown);
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    return sendJSON(res, 500, {
      error: "Internal server error",
      message: err.message || "Something went wrong",
    });
  },
);

app.listen(PORT, "0.0.0.0", () => {
  const key = readGeminiApiKey();
  console.log(`Portfolio API running on port ${PORT}`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(", ") || "(none)"}`);
  if (!key) {
    console.warn("[Gemini] GEMINI_API_KEY is not set — AI chat will not work.");
  } else if (!isLikelyValidGeminiKey(key)) {
    console.warn(
      "[Gemini] Key does not start with AIzaSy. Use https://aistudio.google.com/apikey — AQ.* app tokens usually fail on the server.",
    );
  } else {
    console.log("[Gemini] API key loaded.");
  }
});
