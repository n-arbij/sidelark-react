import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { colorFor, formatDate, previewOf } from "../../pages/journal/format";

export default function JournalCard({ journal }) {
  return (
    <>
    <div className="card" style={{ background: colorFor(journal.id) }}>
        <p className="card-text">{previewOf(journal.content)}</p>
        <span className="card-date">{formatDate(journal.createdAt)}</span>
      <Link
        to={`/journals/${journal.id}/edit`}
        className="icon-btn card-edit"
        aria-label="Edit journal"
        >
        <Pencil size={16} />
      </Link>
    </div>
    </>
  );
}