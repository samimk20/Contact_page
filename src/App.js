import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("contactForm");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem("contactForm", JSON.stringify(formData));
  }, [formData]);

  // 🔥 HANDLE CHANGE (auto remove extra spaces)
  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "name") {
      value = value.replace(/\s+/g, " "); // remove multiple spaces
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  // 🔥 VALIDATION
  const validate = () => {
    let err = {};

    // Name validation (PRO)
    const name = formData.name.trim();
    const nameRegex = /^[A-Za-z]+( [A-Za-z]+)*$/;

    if (!name || !nameRegex.test(name) || name.replace(/\s/g, "").length < 3) {
      err.name = "Enter valid name (only letters, no extra spaces)";
    }

    // Email validation
    const emailRegex =
      /^[a-zA-Z][a-zA-Z0-9._%+-]{2,}@(gmail|yahoo|outlook)\.com$/;

    if (!emailRegex.test(formData.email)) {
      err.email = "Enter valid email (gmail/yahoo/outlook)";
    }

    // Message validation
    if (formData.message.trim().length < 5) {
      err.message = "Message must be at least 5 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // 🔥 SUBMIT
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    const res = await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    console.log(data); // 🔥 DEBUG

    if (data.success) {
      alert("✅ Message saved successfully!");

      localStorage.removeItem("contactForm");
      setFormData({ name: "", email: "", message: "" });

    } else {
      alert("❌ " + (data.message || "Not saved"));
    }

  } catch (err) {
    alert("❌ Server error");
  }
};

  return (
    <div className="bg">

      {/* 🌊 Waves */}
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>

      <div className="contact-container">
        <h1>Let's Connect</h1>
        <p>Send your message 👇</p>

        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="input-group">
            <input
              name="name"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
            />
            <label>Name</label>
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <input
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
            />
            <label>Email</label>
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* MESSAGE */}
          <div className="input-group">
            <textarea
              name="message"
              placeholder=" "
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <label>Message</label>
            {errors.message && <span className="error">{errors.message}</span>}
          </div>

          <button type="submit">Send Message 🚀</button>
        </form>
      </div>
    </div>
  );
}

export default App;