// backend/routes/imageRoutes.js
import express from "express";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import Product from "../models/Product.js";
import { loadModel, getImageEmbedding, cosineSimilarity } from "../utils/similarity.js";

const router = express.Router();

// ===============================
// 🔍 GET /api/search?img=<uploaded-path>
// ===============================
router.get("/search", async (req, res) => {
  try {
    const imagePath = req.query.img;
    if (!imagePath) {
      return res.status(400).json({ error: "No image provided in query parameter ?img=" });
    }

    // Validate uploaded image path
    const absolutePath = path.resolve(`.${imagePath}`);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: "Uploaded image not found on server" });
    }

    console.log(`🔎 Performing similarity search for: ${imagePath}`);

    // Load model and compute embedding
    await loadModel();
    const queryEmbedding = await getImageEmbedding(absolutePath);

    // Fetch products from MongoDB
    const products = await Product.find({ embedding: { $exists: true, $ne: [] } });
    if (!products.length) {
      return res.status(404).json({ message: "No product embeddings found in the database." });
    }

    const results = [];

    for (const product of products) {
      // Normalize embedding
      const norm = Math.sqrt(product.embedding.reduce((sum, v) => sum + v * v, 0));
      const normalizedEmbedding = norm
        ? product.embedding.map((v) => v / norm)
        : product.embedding;

      const similarity = cosineSimilarity(queryEmbedding, normalizedEmbedding);

      // Resolve image URL
      const imageExists = fs.existsSync(`./db/${product.image}`);
      const imageURL = imageExists
        ? `${req.protocol}://${req.get("host")}/db/${product.image}`
        : `${req.protocol}://${req.get("host")}/db/products/default.jpg`;

      results.push({
        id: product._id,
        name: product.name,
        category: product.category,
        image: imageURL,
        similarity: Number(similarity.toFixed(4)),
      });
    }

    // Sort results by similarity
    results.sort((a, b) => b.similarity - a.similarity);

    console.log(`✅ Found ${results.length} matches.`);
    res.json(results);
  } catch (err) {
    console.error("❌ Error in /api/search:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===============================
// 🔁 POST /api/refresh
// Regenerates embeddings (called from frontend)
// ===============================
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || "secret123";

router.post("/refresh", async (req, res) => {
  try {
    const token = req.headers["x-refresh-token"];
    if (token !== REFRESH_TOKEN) {
      return res.status(403).json({ error: "Unauthorized refresh attempt." });
    }

    const scriptPath = path.resolve("./utils/generateEmbeddings.js");
    console.log("♻️  Received refresh request — running embedding generator...");

    const child = spawn("node", [scriptPath]);
    let output = "";

    child.stdout.on("data", (data) => (output += data.toString()));
    child.stderr.on("data", (data) => (output += data.toString()));

    child.on("close", (code) => {
      console.log(`✅ Embedding refresh process exited with code ${code}`);
      res.json({
        success: true,
        message: "Embeddings regenerated successfully!",
        log: output,
      });
    });
  } catch (err) {
    console.error("❌ Error in /api/refresh:", err);
    res.status(500).json({ error: "Failed to refresh embeddings." });
  }
});

export default router;