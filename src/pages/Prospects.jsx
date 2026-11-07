
import {
  ArrowDownUp,
  ArrowRight,
  Building2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePrototype } from "../context/PrototypeContext";
import { PageHeader } from "../components/UI";

const getScore = (prospect) =>
  Number(prospect.score ?? prospect.icpFitScore ?? 0);

const getPriority = (score) => {
  if (score >= 90) return "Hot";
  if (score >= 70) return "High";
  if (score >= 50) return "Medium";
  return "Low";
};

export default function Prospects() {
  const { prospects = [] } = usePrototype();

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredProspects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...prospects]
      .filter((prospect) => {
        const company = prospect.company || prospect.name || "";
        const industry = prospect.industry || "";
        const location =
          prospect.location ||
          prospect.city ||
          prospect.headquarters ||
          "";

        const matchesSearch =
          !normalizedSearch ||
          company.toLowerCase().includes(normalizedSearch) ||
          industry.toLowerCase().includes(normalizedSearch) ||
          location.toLowerCase().includes(normalizedSearch);

        const prospectPriority = getPriority(getScore(prospect));

        const matchesPriority =
          priority === "All" || prospectPriority === priority;

        return matchesSearch && matchesPriority;
      })
      .sort((a, b) => {
        const difference = getScore(a) - getScore(b);
        return sortOrder === "desc" ? -difference : difference;
      });
  }, [prospects, search, priority, sortOrder]);

  const toggleSort = () => {
    setSortOrder((current) => (current === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="prospects-page">
      <PageHeader
        title="Prospects"
        description="Review and qualify companies against your ideal customer profile."
      />

      <div className="prospects-toolbar">
        <div className="prospects-search">
          <Search size={18} aria-hidden="true" />

          <input
            type="search"
            placeholder="Search companies, industries, or locations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search prospects"
          />
        </div>

        <div className="prospects-filter">
          <SlidersHorizontal size={17} aria-hidden="true" />

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            aria-label="Filter prospects by priority"
          >
            <option value="All">All priorities</option>
            <option value="Hot">Hot</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button
          type="button"
          className="button button-secondary prospects-sort"
          onClick={toggleSort}
        >
          <ArrowDownUp size={16} aria-hidden="true" />
          ICP Fit: {sortOrder === "desc" ? "Highest first" : "Lowest first"}
        </button>
      </div>

      <div className="prospects-result-count">
        Showing <strong>{filteredProspects.length}</strong>{" "}
        {filteredProspects.length === 1 ? "company" : "companies"}
      </div>

      <section className="prospect-evidence-guide" aria-label="Prospect evidence definitions">
        <article className="prospect-evidence-card trigger-card"><span className="prospect-evidence-icon">01</span><div><strong>Trigger</strong><p>A recent event that may create a need, such as funding, a leadership hire or expansion.</p></div></article>
        <article className="prospect-evidence-card signal-card"><span className="prospect-evidence-icon">02</span><div><strong>Buying Signal</strong><p>An observable business situation that may point to a challenge your product can solve.</p></div></article>
        <article className="prospect-evidence-card intent-card"><span className="prospect-evidence-icon">03</span><div><strong>Intent</strong><p>Evidence the company is actively seeking or evaluating a solution. A trigger or hiring activity alone is not intent.</p></div></article>
        <p className="prospect-evidence-footnote">Show a source when one is available. Unverified information is labelled as inferred; missing evidence is left as a research task rather than presented as fact.</p>
      </section>

      <div className="table-panel prospects-table-panel">
        <div className="table-scroll prospects-table-scroll">
          <table className="data-table prospects-table">
            <thead>
              <tr>
                <th scope="col">Company</th>
                <th scope="col">Location / Size</th>
                <th scope="col">ICP Fit</th>
                <th scope="col" className="prospects-action-heading">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProspects.map((prospect) => {
                const company =
                  prospect.company || prospect.name || "Unnamed company";

                const industry =
                  prospect.industry || "Industry not specified";

                const location =
                  prospect.location ||
                  prospect.city ||
                  prospect.headquarters ||
                  "Location not specified";

                const size =
                  prospect.size ||
                  prospect.employeeRange ||
                  prospect.employees ||
                  "Size not specified";

                const score = getScore(prospect);
                const prospectPriority = getPriority(score);

                return (
                  <tr key={prospect.id}>
                    <td>
                      <div className="table-company prospects-company">
                        <div className="company-avatar">
                          <Building2 size={19} aria-hidden="true" />
                        </div>

                        <div className="table-main">
                          <span className="prospects-company-name">
                            {company}
                          </span>
                          <span className="table-sub">{industry}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="table-main">
                        <span>{location}</span>
                        <span className="table-sub">
                          {size}
                          {typeof size === "number" ? " employees" : ""}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="prospects-fit">
                        <span className="prospects-fit-score">
                          {score}%
                        </span>

                        <span
                          className={`prospects-priority prospects-priority-${prospectPriority.toLowerCase()}`}
                          title={
                            prospectPriority === "Hot"
                              ? "Highest score tier; validate trigger, buying signal and intent evidence"
                              : prospectPriority === "High"
                                ? "Strong score tier; validate account context and evidence"
                                : prospectPriority === "Medium"
                                  ? "Partial score match; review available evidence"
                                  : "Low score tier; review fit before prioritizing"
                          }
                        >
                          {prospectPriority}
                        </span>
                      </div>
                    </td>

                    <td className="prospects-action-cell">
                      <Link
                        to={`/prospects/${prospect.id}`}
                        className="table-action"
                        aria-label={`View ${company} details`}
                        title={`View ${company} details`}
                      >
                        <ArrowRight size={18} aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredProspects.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <Search size={24} aria-hidden="true" />
                      <p>No matching prospects found.</p>
                      <span>
                        Try another search or select a different priority.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
