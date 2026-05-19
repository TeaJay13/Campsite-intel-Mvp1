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
  {
    name: "Granite Creek Basecamp",
    location: { region: "West", latitude: 47.49, longitude: -121.88 },
    amenities: ["parking", "toilets", "fire-rings"],
    accessNotes: "Paved road to entrance; overflow lot fills by noon on weekends.",
    description: "Large forest campground near creek crossings and scenic overlooks.",
    ratingSummary: { averageRating: 4.4, reviewCount: 38 },
    archiveStatus: "active",
    relatedTrails: ["Granite Pass"],
  },
  {
    name: "Blue Spruce Point",
    location: { region: "North", latitude: 47.68, longitude: -121.22 },
    amenities: ["water", "picnic", "parking"],
    accessNotes: "Single-lane bridge before camp; trailers over 24 ft not recommended.",
    description: "Compact riverside sites with old-growth spruce and cool evening shade.",
    ratingSummary: { averageRating: 4.3, reviewCount: 26 },
    archiveStatus: "active",
    relatedTrails: ["Cedar Loop"],
  },
  {
    name: "Ridge Lantern Camp",
    location: { region: "Central", latitude: 46.9, longitude: -120.75 },
    amenities: ["toilets", "fire-rings"],
    accessNotes: "Narrow switchbacks for final 2 miles; avoid at night first visit.",
    description: "Ridgetop campsites with sunrise views over layered foothills.",
    ratingSummary: { averageRating: 4.1, reviewCount: 19 },
    archiveStatus: "active",
    relatedTrails: ["Meadow Ridge"],
  },
  {
    name: "Willow Basin",
    location: { region: "North", latitude: 47.63, longitude: -121.29 },
    amenities: ["water", "parking", "toilets", "showers"],
    accessNotes: "Check-in kiosk closes at 9 PM; self-service after hours.",
    description: "Family-friendly basin campground with wide, level gravel pads.",
    ratingSummary: { averageRating: 4.6, reviewCount: 44 },
    archiveStatus: "active",
    relatedTrails: ["Cedar Loop"],
  },
  {
    name: "Summit Wind Camp",
    location: { region: "West", latitude: 47.56, longitude: -121.97 },
    amenities: ["parking", "fire-rings"],
    accessNotes: "High-wind zone; use provided anchors for larger tents.",
    description: "Open alpine meadow sites with broad sunset skyline views.",
    ratingSummary: { averageRating: 4.0, reviewCount: 17 },
    archiveStatus: "active",
    relatedTrails: ["Granite Pass"],
  },
  {
    name: "Cedar Bend",
    location: { region: "North", latitude: 47.61, longitude: -121.27 },
    amenities: ["water", "picnic", "toilets"],
    accessNotes: "Camp loop closes during winter storms.",
    description: "Quiet wooded loop close to river access and easy trailheads.",
    ratingSummary: { averageRating: 4.2, reviewCount: 21 },
    archiveStatus: "active",
    relatedTrails: ["Cedar Loop"],
  },
  {
    name: "High Pass Outpost",
    location: { region: "West", latitude: 47.53, longitude: -121.91 },
    amenities: ["parking", "bear-lockers", "toilets"],
    accessNotes: "Last section is rocky; AWD helpful after rain.",
    description: "Backcountry-style outpost staging area for longer summit routes.",
    ratingSummary: { averageRating: 4.5, reviewCount: 31 },
    archiveStatus: "active",
    relatedTrails: ["Granite Pass"],
  },
  {
    name: "Meadow Stone Camp",
    location: { region: "Central", latitude: 46.87, longitude: -120.8 },
    amenities: ["water", "parking", "picnic"],
    accessNotes: "Main gate opens at 6 AM daily.",
    description: "Low-traffic meadow sites with wide night skies and gentle terrain.",
    ratingSummary: { averageRating: 4.3, reviewCount: 24 },
    archiveStatus: "active",
    relatedTrails: ["Meadow Ridge"],
  },
  {
    name: "Twin Pines Camp",
    location: { region: "North", latitude: 47.66, longitude: -121.24 },
    amenities: ["water", "toilets", "fire-rings"],
    accessNotes: "Limited cell service past marker 12.",
    description: "Heavily wooded campground with short walks to creek pools.",
    ratingSummary: { averageRating: 4.4, reviewCount: 33 },
    archiveStatus: "active",
    relatedTrails: ["Cedar Loop"],
  },
  {
    name: "Raven Ridge Camp",
    location: { region: "West", latitude: 47.52, longitude: -121.93 },
    amenities: ["parking", "toilets"],
    accessNotes: "No potable water; bring your own or filter nearby stream.",
    description: "Elevated ridge sites with frequent wildlife sightings at dawn.",
    ratingSummary: { averageRating: 4.1, reviewCount: 16 },
    archiveStatus: "active",
    relatedTrails: ["Granite Pass"],
  },
  {
    name: "Foothill Lantern Grounds",
    location: { region: "Central", latitude: 46.84, longitude: -120.77 },
    amenities: ["water", "parking", "showers"],
    accessNotes: "Staffed office open Fri-Sun only.",
    description: "Well-serviced campground popular with weekend hikers and families.",
    ratingSummary: { averageRating: 4.5, reviewCount: 41 },
    archiveStatus: "active",
    relatedTrails: ["Meadow Ridge"],
  },
  {
    name: "Moss Creek Terrace",
    location: { region: "North", latitude: 47.59, longitude: -121.31 },
    amenities: ["water", "picnic", "toilets", "fire-rings"],
    accessNotes: "Terrace road can flood briefly during spring thaw.",
    description: "Tiered campsites above creek bends with mossy cedar groves.",
    ratingSummary: { averageRating: 4.2, reviewCount: 23 },
    archiveStatus: "active",
    relatedTrails: ["Cedar Loop"],
  },
  {
    name: "Granite View Flats",
    location: { region: "West", latitude: 47.5, longitude: -121.86 },
    amenities: ["parking", "bear-lockers", "fire-rings"],
    accessNotes: "Reservation recommended during summer weekends.",
    description: "Spacious gravel flats with close access to steep alpine climbs.",
    ratingSummary: { averageRating: 4.6, reviewCount: 36 },
    archiveStatus: "active",
    relatedTrails: ["Granite Pass"],
  },
  {
    name: "Aspen Creek Junction",
    location: { region: "Central", latitude: 46.86, longitude: -120.76 },
    amenities: ["water", "toilets", "picnic"],
    accessNotes: "Junction sign is easy to miss; follow brown recreation signs.",
    description: "Creekside sites at a trail junction with mellow grade options.",
    ratingSummary: { averageRating: 4.3, reviewCount: 20 },
    archiveStatus: "active",
    relatedTrails: ["Meadow Ridge"],
  },
  {
    name: "North Fork Camp",
    location: { region: "North", latitude: 47.7, longitude: -121.2 },
    amenities: ["water", "parking", "toilets"],
    accessNotes: "North fork bridge has 10-ton vehicle limit.",
    description: "Riverside camp loop with broad gravel bars for evening walks.",
    ratingSummary: { averageRating: 4.4, reviewCount: 28 },
    archiveStatus: "active",
    relatedTrails: ["Cedar Loop"],
  },
  {
    name: "Cloudline Base",
    location: { region: "West", latitude: 47.57, longitude: -121.99 },
    amenities: ["parking", "toilets", "fire-rings"],
    accessNotes: "Fog common before 9 AM; drive with caution.",
    description: "Wind-exposed but scenic base area for high-elevation day hikes.",
    ratingSummary: { averageRating: 4.0, reviewCount: 15 },
    archiveStatus: "active",
    relatedTrails: ["Granite Pass"],
  },
  {
    name: "Prairie Gate Camp",
    location: { region: "Central", latitude: 46.83, longitude: -120.79 },
    amenities: ["water", "parking", "showers", "toilets"],
    accessNotes: "Front gate code rotates weekly; check reservation email.",
    description: "Open prairie-edge campground with strong facilities and easy access.",
    ratingSummary: { averageRating: 4.5, reviewCount: 39 },
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
