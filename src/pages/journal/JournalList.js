import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import JournalCard from "../../components/journal-card/JournalCard";
import { useJournals } from "./useJournals";
import "../../components/journal-card/JournalCard.css";
import "./Journal.css";

export default function JournalList() {
  const { data: journals, isLoading, isError } = useJournals();
  const [query, setQuery] = useState("");

  const visible = (journals ?? []).filter((j) =>
    j.content.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="journals">
        <div className="journal-wrapper">
            <div className="journal-header">    
                <div className="title-row">
                    <h1 className="page-title">Journals</h1>
                    <Link to="/journals/new" className="icon-btn icon-btn-lg">
                    <Plus size={16} />
                    </Link>
                </div>
                <div className="search">
                    <Search size={16} />
                    <input
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {isLoading && <p className="muted">Loading...</p>}
            {isError && <p className="muted">Could not load your journals.</p>}
            {journals && visible.length === 0 && (
                <p className="muted">
                {query ? "No journals match your search." : "No journals yet. Hit the plus button to write one."}
                </p>
            )}

            <div className="grid">
                {visible.map((j) => (
                <JournalCard key={j.id} journal={j} />
                ))}
            </div>
        </div>
    </div>
  );
}