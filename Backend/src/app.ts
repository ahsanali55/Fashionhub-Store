import express from "express";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("FashionHub Api is running");
});
app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "FashionHub API Running Successfully",
  });
});
export default app;