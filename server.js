import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import vision from "@google-cloud/vision";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/"
});

const client = new vision.ImageAnnotatorClient({
  keyFilename: "google-key.json"
});

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/send-code", async (req, res) => {

  const { email } = req.body;

  const code = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Código AuditFlow",
    text: `Tu código es: ${code}`
  });

  res.json({ code });
});

app.post("/analyze", upload.single("file"), async (req, res) => {

  try {

    const [result] = await client.textDetection(
      req.file.path
    );

    const text =
      result.fullTextAnnotation.text || "";

    const numbers =
      text.match(/\d+/g) || [];

    const total = numbers.reduce(
      (acc, n) => acc + parseInt(n),
      0
    );

    res.json({
      text,
      numbers,
      total
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error procesando imagen"
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `Servidor corriendo en puerto ${process.env.PORT}`
  );
});
