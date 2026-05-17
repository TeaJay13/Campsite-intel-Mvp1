import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchTrails } from "../api/trails-api.js";
import DiscoveryEmptyState from "../components/discovery-empty-state.jsx";
import DiscoveryFilterBar from "../components/discovery-filter-bar.jsx";

const filterFields = [
  { name: "search", label: "Search trails", placeholder: "Search by name or region" },
  {
    name: "difficulty",
    label: "Difficulty",
    type: "select",
    options: [
      { value: "easy", label: "Easy" },
      { value: "moderate", label: "Moderate" },
      { value: "hard", label: "Hard" },
    ],
  },
  { name: "region", label: "Region", placeholder: "Region" },
];

function TrailsPage() {
  const [filters, setFilters] = useState({ search: "", difficulty: "", region: "" });
  const [activeFilters, setActiveFilters] = useState(filters);

  const queryKey = useMemo(() => ["trails", activeFilters], [activeFilters]);

  const trailsQuery = useQuery({
    queryKey,
    queryFn: () => fetchTrails(activeFilters),
  });

  return (
    <section>
      <h1 className="page-title">Discover Trails</h1>
      <p className="page-subtitle">Find routes by name, region, or difficulty.</p>
      <DiscoveryFilterBar
        fields={filterFields}
        values={filters}
        onChange={(key, value) => setFilters((previous) => ({ ...previous, [key]: value }))}
        onSubmit={() => setActiveFilters(filters)}
      />

      {trailsQuery.isLoading && <div className="state-box">Loading trails...</div>}
      {trailsQuery.isError && (
        <div className="state-box state-error">{trailsQuery.error.message || "Failed to load trails."}</div>
      )}
      {trailsQuery.isSuccess && trailsQuery.data.items.length === 0 && (
        <DiscoveryEmptyState
          title="No trails found"
          message="Try broadening your filters or using a different search term."
        />
      )}

      {trailsQuery.isSuccess && trailsQuery.data.items.length > 0 && (
        <div className="list-grid">
          {trailsQuery.data.items.map((trail) => (
            <article className="card" key={trail._id}>
              <h3>{trail.name}</h3>
              <p>{trail.location?.region || "Unknown region"}</p>
              <p>
                {trail.distanceKm} km · {trail.elevationGainM} m gain
              </p>
              <p>Difficulty: {trail.difficulty}</p>
              <a className="card-link" data-nav="spa" href={`/trails/${trail._id}`}>
                View details
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default TrailsPage;
