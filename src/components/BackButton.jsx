import { useNavigate } from "react-router-dom";

export default function BackButton({ to, label = "Voltar" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 transition-all group"
    >
      <span className="group-hover:-translate-x-1 transition-transform">←</span>
      {label}
    </button>
  );
}
