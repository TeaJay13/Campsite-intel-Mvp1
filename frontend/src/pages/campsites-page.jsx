import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchCampsites } from "../api/campsites-api.js";
import DiscoveryEmptyState from "../components/discovery-empty-state.jsx";
import DiscoveryFilterBar from "../components/discovery-filter-bar.jsx";

const filterFields = [
  { name: "search", label: "Search campsites", placeholder: "Search by name or region" },
  { name: "region", label: "Region", placeholder: "Region" },
  { name: "amenity", label: "Amenity", placeholder: "Amenity (water, parking...)" },
];

function CampsitesPage() {
  const [filters, setFilters] = useState({ search: "", region: "", amenity: "" });
  const [activeFilters, setActiveFilters] = useState(filters);

  const queryKey = useMemo(() => ["campsites", activeFilters], [activeFilters]);

  const campsitesQuery = useQuery({
    queryKey,
    queryFn: () => fetchCampsites(activeFilters),
  });

  return (
    <section>
      <h1 className="page-title">Discover Campsites</h1>
      <p className="page-subtitle">Filter campsites by name, region, and amenities.</p>
      <DiscoveryFilterBar
        fields={filterFields}
        values={filters}
        onChange={(key, value) => setFilters((previous) => ({ ...previous, [key]: value }))}
        onSubmit={() => setActiveFilters(filters)}
      />

      {campsitesQuery.isLoading && <div className="state-box">Loading campsites...</div>}
      {campsitesQuery.isError && (
        <div className="state-box state-error">{campsitesQuery.error.message || "Failed to load campsites."}</div>
      )}
      {campsitesQuery.isSuccess && campsitesQuery.data.items.length === 0 && (
        <DiscoveryEmptyState
          title="No campsites found"
          message="Try broadening your filters or changing your search term."
        />
      )}

      {campsitesQuery.isSuccess && campsitesQuery.data.items.length > 0 && (
        <div className="list-grid">
          {campsitesQuery.data.items.map((campsite) => (
            <article className="card" key={campsite._id}>
              <h3>{campsite.name}</h3>
              <p>{campsite.location?.region || "Unknown region"}</p>
              <p>{(campsite.amenities || []).slice(0, 3).join(", ") || "Amenities unavailable"}</p>
              <a className="card-link" data-nav="spa" href={`/campsites/${campsite._id}`}>
                View details
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default CampsitesPage;
