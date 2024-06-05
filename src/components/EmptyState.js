export default function EmptyState({ title, message, children }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 flex flex-col justify-center text-center py-20">
      <div className="flex flex-col gap-6 max-w-[480px] mx-auto">
        <div className="flex flex-col gap-1">
          <h2 className="font-medium">{title}</h2>
          <p className="font-regulr text-sm text-gray-700">{message}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
