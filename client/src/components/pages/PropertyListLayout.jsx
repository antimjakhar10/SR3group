import React from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import "./PropertyListLayout.css";

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") return "₹0";

  if (typeof price === "number") {
    return `₹${price.toLocaleString("en-IN")}`;
  }

  if (typeof price === "string") {
    const trimmed = price.trim();

    if (!trimmed) return "₹0";

    const numericValue = Number(trimmed.replace(/,/g, ""));

    if (!isNaN(numericValue)) {
      return `₹${numericValue.toLocaleString("en-IN")}`;
    }

    return `₹${trimmed}`;
  }

  return "₹0";
};

const PropertyListLayout = ({
  properties,
  showActions = false,
  showApproval = false,
  onEdit,
  onDelete,
  onTogglePremium,
  onUpdateApproval,
}) => {
  return (
    <div className="property-list-wrapper">
      <div className="property-list-header">
        Showing {properties.length} properties
      </div>

      <div className="property-table-wrapper">
        <table className="property-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Price</th>
              <th>Area</th>
              <th>{showApproval ? "Approval" : "Status"}</th>
              <th>Date</th>
              {showActions && <th className="actions-col">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {properties.map((p, index) => (
              <tr key={p._id}>
                <td className="id-cell">{`PR-${1000 + index}`}</td>

                <td className="title-cell">{p.title}</td>

                <td className="muted">{p.location || "-"}</td>

                <td>{p.type || "-"}</td>

                <td className="price-cell">{formatPrice(p.price)}</td>

                <td className="center">{p.sqft || "-"} sqft</td>

                <td>
                  <span
                    className={`status-pill ${
                      showApproval
                        ? p.approvalStatus?.toLowerCase()
                        : p.status?.replace(" ", "-").toLowerCase()
                    }`}
                  >
                    {showApproval ? p.approvalStatus : p.status || "For Sale"}
                  </span>
                </td>

                <td className="muted">
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                {showActions && (
                  <td className="actions-cell">
                    <div className="actions-group">
                      <button
                        className="btn blue"
                        onClick={() => onEdit(p._id)}
                      >
                        <Pencil size={16} color="white" />
                      </button>

                      <button
                        className="btn red"
                        onClick={() => onDelete(p._id)}
                      >
                        <Trash2 size={16} color="white" />
                      </button>

                      {showApproval && (
                        <select
                          value={p.approvalStatus}
                          onChange={(e) =>
                            onUpdateApproval(p._id, e.target.value)
                          }
                          className="approval-select"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      )}

                      <button
                        className={`btn star ${p.premium ? "premium" : ""}`}
                        onClick={() => {
                          onTogglePremium(p._id);
                        }}
                      >
                        <Star
                          size={16}
                          color={p.premium ? "white" : "#334155"}
                        />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyListLayout;