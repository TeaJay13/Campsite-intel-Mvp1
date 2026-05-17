import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    region: { type: String, required: true, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false },
);

const trailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    location: { type: locationSchema, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "moderate", "hard"],
      required: true,
    },
    distanceKm: { type: Number, required: true, min: 0 },
    elevationGainM: { type: Number, required: true, min: 0 },
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
    nearbyCampsiteIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campsite" }],
  },
  { timestamps: true },
);

trailSchema.index({ name: 1, "location.region": 1 });
trailSchema.index({ difficulty: 1, "location.region": 1, archiveStatus: 1 });

export const Trail = mongoose.model("Trail", trailSchema);
