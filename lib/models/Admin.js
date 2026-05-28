import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "Admin" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["owner", "admin"], default: "admin" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
