const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

// 🔹 Ruta principal
app.get("/", (req, res) => {
  res.send("AuditFlow Backend activo 🚀");
});

// 🔹 Health check (Render test)
app.get("/health", (req, res) => {
  res.send("OK");
});

// 🔹 Webhook NOWPayments
app.post("/webhook", (req, res) => {
  const data = req.body;

  console.log("📩 Webhook recibido:", data);

  if (data.payment_status === "finished") {
    console.log("✅ Pago confirmado:", data.order_id);
    // Aquí luego activarás el plan del usuario
  } else {
    console.log("⏳ Estado del pago:", data.payment_status);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
