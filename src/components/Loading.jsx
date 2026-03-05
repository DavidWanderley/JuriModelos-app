export default function Loading({ message = "Carregando..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      <p className="mt-4 text-slate-500 font-bold">{message}</p>
    </div>
  );
}
