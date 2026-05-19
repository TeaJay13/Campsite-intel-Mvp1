import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { favoriteTrail, fetchTrailById, unfavoriteTrail } from "../api/trails-api.js";
import { useAuth } from "../contexts/auth-context.jsx";

function TrailDetailPage({ trailId }) {
  const { user, accessToken, refreshUser } = useAuth();

  const trailQuery = useQuery({
    queryKey: ["trail", trailId],
    queryFn: () => fetchTrailById(trailId),
    enabled: Boolean(trailId),
  });

  const isSaved = user?.savedTrailIds?.includes(trailId);

  const saveMutation = useMutation({
    mutationFn: () => (isSaved ? unfavoriteTrail(trailId, accessToken) : favoriteTrail(trailId, accessToken)),
    onSuccess: refreshUser,
  });

  if (!trailId) {
    return <div className="state-box state-error">Trail id is missing.</div>;
  }

  if (trailQuery.isLoading) {
    return <div className="state-box">Loading trail details...</div>;
  }

  if (trailQuery.isError) {
    return <div className="state-box state-error">{trailQuery.error.message || "Unable to load trail."}</div>;
  }

  const trail = trailQuery.data;

  return (
    <section className="detail-stack">
      <h1 className="page-title">{trail.name}</h1>
      <p className="page-subtitle">{trail.location?.region || "Unknown region"}</p>

      <div className="detail-meta">
        <span className="meta-pill">Difficulty: {trail.difficulty}</span>
        <span className="meta-pill">Distance: {trail.distanceKm} km</span>
        <span className="meta-pill">Elevation: {trail.elevationGainM} m</span>
      </div>

      {user ? (
        <button
          className="btn-primary"
          disabled={saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
        >
          {saveMutation.isPending ? "Saving..." : isSaved ? "Unsave Trail" : "Save Trail"}
        </button>
      ) : (
        <p className="state-box">Log in to save this trail.</p>
      )}

      <article className="card">
        <h3>About this trail</h3>
        <p>{trail.description}</p>
      </article>
    </section>
  );
}

export default TrailDetailPage;
