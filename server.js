const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Proper file path
const filePath = path.join(__dirname, "messages.txt");

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  console.log("📥 Data received:", req.body);

  const data = `
Name: ${name}
Email: ${email}
Message: ${message}
-------------------------
`;

  fs.appendFile(filePath, data, (err) => {
    if (err) {
      console.error("❌ File error:", err);
      return res.status(500).json({ success: false, message: "File error" });
    }

    console.log("✅ Saved to messages.txt");

    res.json({
      success: true,
      message: "Message saved successfully!",
    });
  });
});

app.listen(5000, () => {
  console.log("🔥 Server running on http://localhost:5000");
});