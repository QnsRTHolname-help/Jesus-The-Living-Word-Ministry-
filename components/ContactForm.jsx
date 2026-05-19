"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <form className="grid gap-4 w-full" onSubmit={handleSubmit}>
      <input 
        className="input-field" 
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name" 
        required 
      />
      <input 
        className="input-field" 
        type="email" 
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email" 
        required 
      />
      <input 
        className="input-field" 
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="Subject" 
      />
      <textarea 
        className="input-field min-h-36 resize-y" 
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message" 
        required 
      />
      <button 
        type="submit" 
        disabled={status === "submitting"}
        className="btn-primary justify-self-start disabled:opacity-50"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
      
      {status === "success" && (
        <p className="text-green-400 text-sm mt-2">Your message has been sent successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm mt-2">Failed to send message. Please try again.</p>
      )}
    </form>
  );
}
