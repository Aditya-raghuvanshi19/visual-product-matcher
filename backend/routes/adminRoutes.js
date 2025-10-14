// backend/routes/adminRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { loadModel, getImageEmbedding } from "../utils/similarity.js";
import { Product } from "../db.js";

const router = express.Router();

// Simple admin guard (optional) — will check X-ADMIN-KEY header against env ADMIN_KEY
function adminGuard(req, res, next) {
  const adminKey = process.env.ADMIN_KEY || "";
  if (!adminKey) return next(); // no key set => open (dev mode). Set ADMIN_KEY to protect.
  if (req.headers["x-admin-key"] === adminKey) return next();
  return res.status(403).json({ error: "Unauthorized" });
}

// Multer storage for product images (db/products)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "db/products");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_").toLowerCase();
    cb(null, safeName);
  },
});

const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } }); // 8MB limit

router.post("/upload-product", adminGuard, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const { name, category } = req.body;
    const imageRelPath = `products/${req.file.filename}`;
    const fullPath = path.join(process.cwd(), "db/products", req.file.filename);

    // Compute embedding
    await loadModel();
    const embedding = await getImageEmbedding(fullPath);

    // Normalize embedding
    const mag = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0)) || 1;
    const normalized = embedding.map((v) => v / mag);

    // If Product model is available (Mongo connected), upsert
    let savedProduct = null;
    try {
      const productDoc = {
        name: name || path.basename(req.file.filename, path.extname(req.file.filename)),
        category: category || "Unknown",
        image: imageRelPath,
        embedding: normalized,
      };

      // upsert based on image path
      savedProduct = await Product.findOneAndUpdate(
        { image: imageRelPath },
        { $set: productDoc },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (mongoErr) {
      console.warn("⚠️ Mongo upsert failed (maybe not connected):", mongoErr?.message || mongoErr);
    }

    // Also return path so frontend can use the same flow as before
    return res.json({
      success: true,
      product: savedProduct ? savedProduct.toObject() : { name, category, image: imageRelPath, embedding: normalized },
      imagePath: `/db/${imageRelPath}`,
    });
  } catch (err) {
    console.error("❌ Admin upload failed:", err);
    res.status(500).json({ error: "Failed to upload product" });
  }
});

export default router;
