import React from "react";

function DiscoveryFilterBar({ fields, values, onChange, onSubmit }) {
  return (
    <form
      className="filter-bar"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {fields.map((field) => {
        if (field.type === "select") {
          return (
            <select
              key={field.name}
              value={values[field.name] || ""}
              onChange={(event) => onChange(field.name, event.target.value)}
              aria-label={field.label}
            >
              <option value="">{field.placeholder || field.label}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        }

        return (
          <input
            key={field.name}
            type="text"
            value={values[field.name] || ""}
            placeholder={field.placeholder || field.label}
            onChange={(event) => onChange(field.name, event.target.value)}
            aria-label={field.label}
          />
        );
      })}
      <button className="btn btn-primary" type="submit">
        Apply
      </button>
    </form>
  );
}

export default DiscoveryFilterBar;
