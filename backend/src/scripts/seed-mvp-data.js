import "dotenv/config";

import { connectToDatabase, disconnectDatabase } from "../config/database.js";
import { Trail } from "../models/trail.model.js";
import { Campsite } from "../models/campsite.model.js";

const trailSeed = [
  {
    name: "Cedar Loop",
    location: { region: "North", latitude: 47.64, longitude: -121.3 },
    difficulty: "easy",
    distanceKm: 6.5,
    elevationGainM: 220,
    description: "Forest loop with river viewpoints and gentle grade.",
    ratingSummary: { averageRating: 4.4, reviewCount: 18 },
    archiveStatus: "active",
  },
  {
    name: "Granite Pass",
    location: { region: "West", latitude: 47.51, longitude: -121.9 },
    difficulty: "hard",
    distanceKm: 14.2,
    elevationGainM: 980,
    description: "High alpine route with exposed ridgelines and panoramic views.",
    ratingSummary: { averageRating: 4.7, reviewCount: 33 },
    archiveStatus: "active",
  },
  {
    name: "Meadow Ridge",
    location: { region: "Central", latitude: 46.89, longitude: -120.82 },
    difficulty: "moderate",
    distanceKm: 9.1,
    elevationGainM: 430,
    description: "Rolling ridge trail through meadows and pine stands.",
    ratingSummary: { averageRating: 4.3, reviewCount: 22 },
    archiveStatus: "active",
  },
];

const campsiteSeed = [
  {
    name: "Pine Hollow",
    location: { region: "North", latitude: 47.6, longitude: -121.25 },
    amenities: ["water", "parking", "toilets"],
    accessNotes: "Last mile is gravel; low-clearance cars are usually fine in summer.",
    description: "Shaded riverside campground with easy access to family-friendly trails.",
    ratingSummary: { averageRating: 4.5, reviewCount: 29 },
    archiveStatus: "active",
    relatedTrails: ["Cedar Loop"],
  },
  {
    name: "Sunset Meadow Camp",
    location: { region: "West", latitude: 47.55, longitude: -121.95 },
    amenities: ["water", "fire-rings"],
    accessNotes: "Steep approach road, avoid after heavy rain.",
    description: "Open meadow sites with evening mountain views.",
    ratingSummary: { averageRating: 4.2, reviewCount: 14 },
    archiveStatus: "active",
    relatedTrails: ["Granite Pass"],
  },
  {
    name: "Aspen Flats",
    location: { region: "Central", latitude: 46.85, longitude: -120.78 },
    amenities: ["parking", "picnic"],
    accessNotes: "Gate closes at 10 PM.",
    description: "Quiet dispersed-style area near rolling foothill routes.",
    ratingSummary: { averageRating: 4.1, reviewCount: 11 },
    archiveStatus: "active",
    relatedTrails: ["Meadow Ridge"],
  },
];

async function upsertTrails() {
  const byName = new Map();

  for (const trail of trailSeed) {
    const doc = await Trail.findOneAndUpdate(
      { name: trail.name, "location.region": trail.location.region },
      { $set: trail },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    byName.set(trail.name, doc);
  }

  return byName;
}

async function upsertCampsites(trailByName) {
  const campsiteByName = new Map();

  for (const campsite of campsiteSeed) {
    const relatedTrailIds = campsite.relatedTrails
      .map((trailName) => trailByName.get(trailName)?._id)
      .filter(Boolean);

    const doc = await Campsite.findOneAndUpdate(
      { name: campsite.name, "location.region": campsite.location.region },
      {
        $set: {
          name: campsite.name,
          location: campsite.location,
          amenities: campsite.amenities,
          accessNotes: campsite.accessNotes,
          description: campsite.description,
          ratingSummary: campsite.ratingSummary,
          archiveStatus: campsite.archiveStatus,
          relatedTrailIds,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    campsiteByName.set(campsite.name, doc);
  }

  return campsiteByName;
}

async function wireTrailToCampsiteLinks(trailByName, campsiteByName) {
  for (const campsite of campsiteSeed) {
    const campsiteDoc = campsiteByName.get(campsite.name);
    if (!campsiteDoc) {
      continue;
    }

    for (const trailName of campsite.relatedTrails) {
      const trailDoc = trailByName.get(trailName);
      if (!trailDoc) {
        continue;
      }

      await Trail.updateOne(
        { _id: trailDoc._id },
        { $addToSet: { nearbyCampsiteIds: campsiteDoc._id } },
      );
    }
  }
}

async function seed() {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error("MONGODB_URI is not set. Create backend/.env first.");
  }

  await connectToDatabase(connectionString);

  const trailByName = await upsertTrails();
  const campsiteByName = await upsertCampsites(trailByName);
  await wireTrailToCampsiteLinks(trailByName, campsiteByName);

  console.log(`Seeded ${trailByName.size} trails and ${campsiteByName.size} campsites.`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
