import { NotFoundError } from "../lib/errors.js";
import mongoose from "mongoose";
import { DEV_TRAILS } from "../lib/dev-discovery-data.js";
import { Trail } from "../models/trail.model.js";

function buildSearchFilter({ search, region, difficulty }) {
  const filter = { archiveStatus: "active" };

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ name: regex }, { description: regex }, { "location.region": regex }];
  }

  if (region) {
    filter["location.region"] = new RegExp(`^${region}$`, "i");
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  return filter;
}

function toPageMeta(page, pageSize, totalItems) {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
  };
}

function useDevDataFallback() {
  return mongoose.connection.readyState !== 1;
}

function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function matchesTrailFilters(trail, { search, region, difficulty }) {
  if (trail.archiveStatus !== "active") {
    return false;
  }

  if (difficulty && trail.difficulty !== difficulty) {
    return false;
  }

  if (region && trail.location.region.toLowerCase() !== region.toLowerCase()) {
    return false;
  }

  if (!search) {
    return true;
  }

  const normalized = search.toLowerCase();
  return (
    trail.name.toLowerCase().includes(normalized) ||
    trail.description.toLowerCase().includes(normalized) ||
    trail.location.region.toLowerCase().includes(normalized)
  );
}

export async function listTrails({ search, region, difficulty, page = 1, pageSize = 20 }) {
  const numericPage = Math.max(1, Number(page) || 1);
  const numericPageSize = Math.min(100, Math.max(1, Number(pageSize) || 20));

  if (useDevDataFallback()) {
    const filteredItems = DEV_TRAILS.filter((trail) =>
      matchesTrailFilters(trail, { search, region, difficulty }),
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      items: paginate(filteredItems, numericPage, numericPageSize),
      meta: toPageMeta(numericPage, numericPageSize, filteredItems.length),
    };
  }

  const filter = buildSearchFilter({ search, region, difficulty });

  const [items, totalItems] = await Promise.all([
    Trail.find(filter)
      .sort({ createdAt: -1 })
      .skip((numericPage - 1) * numericPageSize)
      .limit(numericPageSize)
      .lean(),
    Trail.countDocuments(filter),
  ]);

  return {
    items,
    meta: toPageMeta(numericPage, numericPageSize, totalItems),
  };
}

export async function getTrailById(trailId) {
  if (useDevDataFallback()) {
    const trail = DEV_TRAILS.find((item) => item._id === trailId && item.archiveStatus === "active");

    if (!trail) {
      throw new NotFoundError("Trail not found.");
    }

    return trail;
  }

  const trail = await Trail.findOne({ _id: trailId, archiveStatus: "active" }).lean();

  if (!trail) {
    throw new NotFoundError("Trail not found.");
  }

  return trail;
}
