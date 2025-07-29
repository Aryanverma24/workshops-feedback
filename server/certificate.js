import express from "express";
import { createCanvas, loadImage } from "canvas";
import { v4 as uuidv4 } from "uuid";
import { config as dotenv } from "dotenv";
import cloudinary from "cloudinary";
import axios from "axios";

dotenv();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const router = express.Router();

router.post("/generate-certificate", async (req, res) => {
  const { name, workshopName, provider, date } = req.body;

  if (!name || !workshopName || !provider || !date) {
    return res.status(400).json({ error: "Missing certificate data" });
  }

  try {
    // 1. Fetch base certificate image from Cloudinary
    
    const baseUrl = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/v1753565022/ef0capoijgn6ppqfffoo.png`;
    console.log("Base URL:", baseUrl);
    
    // OR if stored in unsigned preset, use signed URL
    const response = await axios.get(baseUrl, { responseType: "arraybuffer" , timeout: 30000});
    const baseImage = await loadImage(Buffer.from(response.data, "binary"));

    // 2. Draw on Canvas
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0);

    ctx.fillStyle = "#000";
    ctx.textAlign = "center";

    ctx.font = "40px Arial bold";
    ctx.fillText(name, baseImage.width / 2, 650);

    ctx.font = "30px Arial bold";
    ctx.fillText(workshopName, baseImage.width/1.67, 730);
    ctx.fillText(`By ${provider}`, baseImage.width / 1.78, 790);


    // 3. Upload final image to Cloudinary
    const finalBuffer = canvas.toBuffer("image/png");

    const fileName = `certificate-${uuidv4()}`;

    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "certificates",
          public_id: fileName,
          format: "png",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(finalBuffer);
    });

    res.status(200).json({ url: uploaded.secure_url });
} catch (error) {
  console.error("Certificate generation error:", error);
  res.status(500).json({ error: "Failed to generate certificate", details: error.message });
}

});

export default router;
