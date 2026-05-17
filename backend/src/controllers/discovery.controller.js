import { z } from "zod";

import { ValidationError } from "../lib/errors.js";
import { getCampsiteById, listCampsites } from "../services/campsite.service.js";
import { getTrailById, listTrails } from "../services/trail.service.js";

const listTrailsQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  region: z.string().trim().min(1).optional(),
  difficulty: z.enum(["easy", "moderate", "hard"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

const listCampsitesQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  region: z.string().trim().min(1).optional(),
  amenity: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

const idParamsSchema = z.object({
  id: z.string().trim().min(1),
});

function parseOrThrow(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Request validation failed.", result.error.issues);
  }
  return result.data;
}

export async function getTrails(request, response, next) {
  try {
    const query = parseOrThrow(listTrailsQuerySchema, request.query);
    const data = await listTrails(query);
    response.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function getTrailDetails(request, response, next) {
  try {
    const params = parseOrThrow(idParamsSchema, request.params);
    const trail = await getTrailById(params.id);
    response.status(200).json(trail);
  } catch (error) {
    next(error);
  }
}

export async function getCampsites(request, response, next) {
  try {
    const query = parseOrThrow(listCampsitesQuerySchema, request.query);
    const data = await listCampsites(query);
    response.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

export async function getCampsiteDetails(request, response, next) {
  try {
    const params = parseOrThrow(idParamsSchema, request.params);
    const campsite = await getCampsiteById(params.id);
    response.status(200).json(campsite);
  } catch (error) {
    next(error);
  }
}
