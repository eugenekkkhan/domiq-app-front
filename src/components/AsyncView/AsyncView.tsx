import { PageSpinner } from "../Spinner/Spinner";

const AsyncView = ({
  loading,
  error,
  onRetry,
  children,
}: {
  loading: boolean;
  error: string;
  onRetry: () => void;
  children: React.ReactNode;
}) => {
  if (loading) return <PageSpinner />;
  if (error)
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-sm text-danger">{error}</p>
        <button className="btn btn-secondary" onClick={onRetry}>
          Обновить
        </button>
      </div>
    );
  return children;
};

export default AsyncView;
