const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("AuditFlow Backend activo 🚀");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.post("/webhook", (req, res) => {
  const data = req.body;

  console.log("Webhook:", data);

  if (data.payment_status === "finished") {
    console.log("Pago confirmado:", data.order_id);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
