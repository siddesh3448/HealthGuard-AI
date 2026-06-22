import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { 
  getChatResponse, 
  analyzeFoodImage, 
  analyzeFoodText, 
  analyzeMedicineImage, 
  analyzeMedicineText 
} from "./src/lib/geminiClient";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON with a safe body limit
  app.use(express.json({ limit: "15mb" }));

  // Basic API endpoints (Stubs for Step 1)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Chat placeholder endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, languageCode, context } = req.body;
      if (!message) {
        return res.status(400).json({ success: false, error: "Message is required." });
      }
      
      const response = await getChatResponse(message, history || [], languageCode || "en", context);
      return res.json(response);
    } catch (err: any) {
      console.error("Error in /api/chat endpoint stub:", err);
      return res.status(500).json({ success: false, error: "Internal server error." });
    }
  });

  // Analyze Food endpoint
  app.post("/api/analyze-food", async (req, res) => {
    try {
      const { image, ingredients, context } = req.body;
      
      let result;
      if (image) {
        result = await analyzeFoodImage(image, context);
      } else if (ingredients) {
        result = await analyzeFoodText(ingredients, context);
      } else {
        return res.status(400).json({ success: false, error: "Either image or ingredients is required." });
      }

      return res.json(result);
    } catch (err: any) {
      console.error("Error in /api/analyze-food:", err);
      return res.status(500).json({ success: false, error: err?.message || "Internal server error." });
    }
  });

  // Analyze Medicine endpoint
  app.post("/api/analyze-medicine", async (req, res) => {
    try {
      const { image, activeIngredients, context } = req.body;
      
      let result;
      if (image) {
        result = await analyzeMedicineImage(image, context);
      } else if (activeIngredients) {
        result = await analyzeMedicineText(activeIngredients, context);
      } else {
        return res.status(400).json({ success: false, error: "Either image or activeIngredients is required." });
      }

      return res.json(result);
    } catch (err: any) {
      console.error("Error in /api/analyze-medicine:", err);
      return res.status(500).json({ success: false, error: err?.message || "Internal server error." });
    }
  });

  // Vite development middleware setup or production static server configuration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode with static file serve...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full stack server:", err);
});
