import mongoose from "mongoose";

const ContactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    requestType: {
      type: String,
      enum: ["general", "prayer", "retreat", "volunteer", "partnership", "care"],
      default: "general"
    },
    subject: { type: String, trim: true, default: "" },
    message: { type: String, required: true },
    sourcePage: { type: String, trim: true, default: "/contact" },
    isRead: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new"
    },
    priority: {
      type: String,
      enum: ["normal", "high"],
      default: "normal"
    },
    replies: {
      type: [
        {
          body: String,
          sentTo: String,
          sentBy: String,
          sentAt: Date,
          deliveryStatus: { type: String, default: "recorded" }
        }
      ],
      default: []
    },
    notificationStatus: {
      adminEmail: { type: String, default: "not_configured" },
      autoReply: { type: String, default: "not_configured" },
      whatsapp: { type: String, default: "not_configured" }
    },
    meta: {
      ip: String,
      userAgent: String,
      spamScore: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.models.ContactSubmission || mongoose.model("ContactSubmission", ContactSubmissionSchema);
