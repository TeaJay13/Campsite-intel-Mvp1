import { NotFoundError } from "../lib/errors.js";
import mongoose from "mongoose";
import { DEV_CAMPSITES } from "../lib/dev-discovery-data.js";
import { Campsite } from "../models/campsite.model.js";

function buildSearchFilter({ search, region, amenity }) {
  const filter = { archiveStatus: "active" };

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ name: regex }, { description: regex }, { "location.region": regex }];
  }

  if (region) {
    filter["location.region"] = new RegExp(`^${region}$`, "i");
  }

  if (amenity) {
    filter.amenities = { $elemMatch: { $regex: new RegExp(`^${amenity}$`, "i") } };
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

function matchesCampsiteFilters(campsite, { search, region, amenity }) {
  if (campsite.archiveStatus !== "active") {
    return false;
  }

  if (region && campsite.location.region.toLowerCase() !== region.toLowerCase()) {
    return false;
  }

  if (
    amenity &&
    !campsite.amenities.some((value) => value.toLowerCase() === amenity.toLowerCase())
  ) {
    return false;
  }

  if (!search) {
    return true;
  }

  const normalized = search.toLowerCase();
  return (
    campsite.name.toLowerCase().includes(normalized) ||
    campsite.description.toLowerCase().includes(normalized) ||
    campsite.location.region.toLowerCase().includes(normalized)
  );
}

export async function listCampsites({ search, region, amenity, page = 1, pageSize = 20 }) {
  const numericPage = Math.max(1, Number(page) || 1);
  const numericPageSize = Math.min(100, Math.max(1, Number(pageSize) || 20));

  if (useDevDataFallback()) {
    const filteredItems = DEV_CAMPSITES.filter((campsite) =>
      matchesCampsiteFilters(campsite, { search, region, amenity }),
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      items: paginate(filteredItems, numericPage, numericPageSize),
      meta: toPageMeta(numericPage, numericPageSize, filteredItems.length),
    };
  }

  const filter = buildSearchFilter({ search, region, amenity });

  const [items, totalItems] = await Promise.all([
    Campsite.find(filter)
      .sort({ createdAt: -1 })
      .skip((numericPage - 1) * numericPageSize)
      .limit(numericPageSize)
      .lean(),
    Campsite.countDocuments(filter),
  ]);

  return {
    items,
    meta: toPageMeta(numericPage, numericPageSize, totalItems),
  };
}

export async function getCampsiteById(campsiteId) {
  if (useDevDataFallback()) {
    const campsite = DEV_CAMPSITES.find(
      (item) => item._id === campsiteId && item.archiveStatus === "active",
    );

    if (!campsite) {
      throw new NotFoundError("Campsite not found.");
    }

    return campsite;
  }

  const campsite = await Campsite.findOne({ _id: campsiteId, archiveStatus: "active" }).lean();

  if (!campsite) {
    throw new NotFoundError("Campsite not found.");
  }

  return campsite;
}
