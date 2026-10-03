import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJournal, useSaveJournal } from "./useJournals";
import "./Journal.css";

export default function JournalForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: journal, isLoading } = useJournal(id);
  const save = useSaveJournal(id);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (journal) setContent(journal.content);
  }, [journal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    save.mutate(content.trim(), {
      onSuccess: (saved) => navigate(`/journals/${saved?.id ?? id}/edit`),
    });
  };

  if (id && isLoading) return <div className="journals"><p className="muted">Loading...</p></div>;

  return (
    <form onSubmit={handleSubmit} className="journals editor">
        <div className="wrapper">
            <h1 className="page-title">{id ? "Refine Your Thoughts" : "A Moment to Reflect"}</h1>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write what's on your mind..."
                rows={16}
                autoFocus
            />

            {save.isError && <p className="error">Could not save. Try again.</p>}

            <div className="actions">
              <Link to="/journals" className="btn btn-ghost">
                Cancel
                </Link>
                <button type="submit" className="btn" disabled={!content.trim() || save.isPending}>
                {save.isPending ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    </form>
  );
}