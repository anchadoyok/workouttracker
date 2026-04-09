export const LoadingState = ({ message = "Loading..." }: { message?: string }) => (
  <div className="rounded-3xl border border-stone-200 bg-white p-5 text-sm text-stone-500 shadow-card">
    {message}
  </div>
);

export const ErrorState = ({ message }: { message: string }) => (
  <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
    {message}
  </div>
);
