import React from "react";

function DiscoveryEmptyState({ title, message }) {
  return (
    <div className="state-box" role="status">
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}

export default DiscoveryEmptyState;
