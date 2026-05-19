import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchSavedTrails } from "../api/auth-api.js";
import { unfavoriteTrail } from "../api/trails-api.js";
import { useAuth } from "../contexts/auth-context.jsx";

function AccountPage() {
  const { user, accessToken, refreshUser } = useAuth();
  const queryClient = useQueryClient();

  const savedTrailsQuery = useQuery({
    queryKey: ["saved-trails"],
    queryFn: () => fetchSavedTrails(accessToken),
    enabled: Boolean(accessToken),
  });

  const unsaveMutation = useMutation({
    mutationFn: (trailId) => unfavoriteTrail(trailId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-trails"] });
      refreshUser();
    },
  });

  if (!user) {
    return <div className="state-box state-error">You must be logged in to view your account.</div>;
  }

  return (
    <section className="detail-stack">
      <h1 className="page-title">My Account</h1>
      <p className="page-subtitle">{user.email}</p>

      <h2 style={{ marginBottom: "0.5rem" }}>Saved Trails</h2>

      {savedTrailsQuery.isLoading && <div className="state-box">Loading saved trails...</div>}
      {savedTrailsQuery.isError && (
        <div className="state-box state-error">
          {savedTrailsQuery.error.message || "Failed to load saved trails."}
        </div>
      )}

      {savedTrailsQuery.isSuccess && savedTrailsQuery.data.length === 0 && (
        <div className="state-box">You have no saved trails yet.</div>
      )}

      {savedTrailsQuery.isSuccess && savedTrailsQuery.data.length > 0 && (
        <div className="list-grid">
          {savedTrailsQuery.data.map((trail) => (
            <article className="card" key={trail._id}>
              <h3>{trail.name}</h3>
              <p>{trail.location?.region || "Unknown region"}</p>
              <p>
                {trail.distanceKm} km · {trail.elevationGainM} m gain
              </p>
              <p>Difficulty: {trail.difficulty}</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <a className="card-link" data-nav="spa" href={`/trails/${trail._id}`}>
                  View details
                </a>
                <button
                  className="btn btn-primary"
                  disabled={unsaveMutation.isPending}
                  onClick={() => unsaveMutation.mutate(trail._id)}
                  style={{ fontSize: "0.85rem", padding: "0.3rem 0.75rem" }}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AccountPage;
