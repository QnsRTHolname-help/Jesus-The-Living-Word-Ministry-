import mongoose from "mongoose";

const RetreatSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models.Retreat || mongoose.model("Retreat", RetreatSchema);
