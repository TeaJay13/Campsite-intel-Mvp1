import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    region: { type: String, required: true, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false },
);

const campsiteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    location: { type: locationSchema, required: true },
    amenities: [{ type: String, trim: true }],
    accessNotes: { type: String, maxlength: 2000, default: "" },
    description: { type: String, required: true, maxlength: 5000 },
    ratingSummary: {
      averageRating: { type: Number, min: 0, max: 5, default: 0 },
      reviewCount: { type: Number, min: 0, default: 0 },
    },
    archiveStatus: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
      index: true,
    },
    relatedTrailIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trail" }],
  },
  { timestamps: true },
);

campsiteSchema.index({ name: 1, "location.region": 1 });
campsiteSchema.index({ "location.region": 1, archiveStatus: 1 });

export const Campsite = mongoose.model("Campsite", campsiteSchema);
