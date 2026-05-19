import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { favoriteCampsite, fetchCampsiteById, unfavoriteCampsite } from "../api/campsites-api.js";
import { useAuth } from "../contexts/auth-context.jsx";

function CampsiteDetailPage({ campsiteId }) {
  const { user, accessToken, refreshUser } = useAuth();

  const campsiteQuery = useQuery({
    queryKey: ["campsite", campsiteId],
    queryFn: () => fetchCampsiteById(campsiteId),
    enabled: Boolean(campsiteId),
  });

  const isSaved = user?.savedCampsiteIds?.includes(campsiteId);

  const saveMutation = useMutation({
    mutationFn: () => (isSaved ? unfavoriteCampsite(campsiteId, accessToken) : favoriteCampsite(campsiteId, accessToken)),
    onSuccess: refreshUser,
  });

  if (!campsiteId) {
    return <div className="state-box state-error">Campsite id is missing.</div>;
  }

  if (campsiteQuery.isLoading) {
    return <div className="state-box">Loading campsite details...</div>;
  }

  if (campsiteQuery.isError) {
    return (
      <div className="state-box state-error">{campsiteQuery.error.message || "Unable to load campsite."}</div>
    );
  }

  const campsite = campsiteQuery.data;

  return (
    <section className="detail-stack">
      <h1 className="page-title">{campsite.name}</h1>
      <p className="page-subtitle">{campsite.location?.region || "Unknown region"}</p>

      <div className="detail-meta">
        {(campsite.amenities || []).slice(0, 4).map((amenity) => (
          <span className="meta-pill" key={amenity}>
            {amenity}
          </span>
        ))}
      </div>

      {user ? (
        <button
          className="btn-primary"
          disabled={saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
        >
          {saveMutation.isPending ? "Saving..." : isSaved ? "Unsave Campsite" : "Save Campsite"}
        </button>
      ) : (
        <p className="state-box">Log in to save this campsite.</p>
      )}

      <article className="card">
        <h3>About this campsite</h3>
        <p>{campsite.description}</p>
        {campsite.accessNotes && <p>Access: {campsite.accessNotes}</p>}
      </article>
    </section>
  );
}

export default CampsiteDetailPage;
