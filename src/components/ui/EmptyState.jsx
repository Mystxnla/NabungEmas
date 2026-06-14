/**
 * EmptyState
 * Komponen yang ditampilkan ketika belum ada data.
 * Memberikan pesan informatif dan tombol aksi opsional.
 */
const EmptyState = ({ icon = '📭', title, message, actionLabel, onAction }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
