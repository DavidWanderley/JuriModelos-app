const Pagination = ({ paginaAtual, totalPaginas, onPaginar }) => {
  if (totalPaginas <= 1) return null;

  const paginas = [];
  for (let i = 1; i <= totalPaginas; i++) paginas.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPaginar(paginaAtual - 1)}
        disabled={paginaAtual === 1}
        className="px-3 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ←
      </button>

      {paginas.map(p => (
        <button
          key={p}
          onClick={() => onPaginar(p)}
          className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
            p === paginaAtual
              ? "bg-[#0e1e3f] text-white shadow"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPaginar(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
        className="px-3 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
