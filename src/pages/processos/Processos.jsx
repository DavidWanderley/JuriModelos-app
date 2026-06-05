import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";

const STATUS_CORES = {
  "Em andamento": "bg-blue-100 text-blue-700",
  "Aguardando":   "bg-amber-100 text-amber-700",
  "Encerrado":    "bg-slate-100 text-slate-600",
  "Ganho":        "bg-emerald-100 text-emerald-700",
  "Perdido":      "bg-red-100 text-red-700",
};

const STATUS_LIST = ["Em andamento", "Aguardando", "Encerrado", "Ganho", "Perdido"];

const Processos = () => {
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [busca, setBusca]         = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const navigate = useNavigate();

  const fetchProcessos = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (busca) params.busca = busca;
      if (filtroStatus) params.status = filtroStatus;
      const res = await api.get("/processos", { params });
      setProcessos(res.data?.data || res.data || []);
    } catch { toast.error("Erro ao carregar processos."); }
    finally { setLoading(false); }
  }, [busca, filtroStatus]);

  useEffect(() => {
    const timer = setTimeout(fetchProcessos, 400);
    return () => clearTimeout(timer);
  }, [fetchProcessos]);

  const deletar = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Deseja excluir este processo? O registro será preservado no sistema.")) return;
    try {
      await api.delete(`/processos/${id}`);
      toast.success("Processo excluído.");
      fetchProcessos();
    } catch { toast.error("Erro ao excluir processo."); }
  };

  const proximoPrazo = (prazos = []) => {
    const pendentes = prazos.filter(p => p.status === "pendente").sort((a, b) => a.data_prazo.localeCompare(b.data_prazo));
    return pendentes[0] || null;
  };

  const diasRestantes = (data) => {
    const hoje = new Date().toISOString().split("T")[0];
    const diff = Math.round((new Date(data) - new Date(hoje)) / (1000 * 60 * 60 * 24));
    if (diff < 0)   return { label: `${Math.abs(diff)}d atrasado`, cor: "text-red-600 font-black" };
    if (diff === 0) return { label: "Hoje!",  cor: "text-red-600 font-black" };
    if (diff === 1) return { label: "Amanhã", cor: "text-orange-500 font-bold" };
    if (diff <= 7)  return { label: `${diff}d`, cor: "text-amber-600 font-bold" };
    return { label: `${diff}d`, cor: "text-slate-400" };
  };

  const totais = STATUS_LIST.reduce((acc, s) => {
    acc[s] = processos.filter(p => p.status === s).length;
    return acc;
  }, {});

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl ml-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">📁 Processos</h1>
            <p className="text-slate-500 font-medium">Gestão completa de processos jurídicos</p>
          </div>
          <button
            onClick={() => navigate("/processos/novo")}
            className="bg-[#0e1e3f] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            + Novo Processo
          </button>
        </div>

        {/* Cards de status */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {STATUS_LIST.map(s => (
            <button
              key={s}
              onClick={() => setFiltroStatus(filtroStatus === s ? "" : s)}
              className={`bg-white rounded-2xl border p-4 shadow-sm text-left transition-all hover:shadow-md ${
                filtroStatus === s ? "border-[#0e1e3f] ring-2 ring-[#0e1e3f]/20" : "border-slate-200"
              }`}
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">{s}</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{totais[s] || 0}</p>
            </button>
          ))}
        </div>

        {/* Busca */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar por título, nº processo ou tipo de ação..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full outline-none font-medium text-slate-700 placeholder:text-slate-300 bg-transparent"
          />
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
          </div>
        ) : processos.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 border-2 border-dashed border-slate-200 text-center">
            <p className="text-5xl mb-4">📁</p>
            <p className="text-xl font-medium text-slate-400">Nenhum processo encontrado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {processos.map(p => {
              const prazo = proximoPrazo(p.prazos);
              const dias = prazo ? diasRestantes(prazo.data_prazo) : null;
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/processos/${p.id}`)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-slate-300 cursor-pointer transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_CORES[p.status]}`}>
                        {p.status}
                      </span>
                      {p.numero_processo && (
                        <span className="text-[10px] text-slate-400 font-mono">Proc. {p.numero_processo}</span>
                      )}
                    </div>
                    <p className="font-black text-slate-800 truncate text-lg">{p.titulo}</p>
                    <div className="flex gap-4 mt-1 text-xs text-slate-400 flex-wrap">
                      {p.tipo_acao && <span>⚖️ {p.tipo_acao}</span>}
                      {p.cliente   && <span>👤 {p.cliente.nome_completo}</span>}
                      {p.comarca   && <span>📍 {p.comarca}</span>}
                      {p.valor_causa && <span>💰 R$ {Number(p.valor_causa).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {prazo && dias && (
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-medium">Próx. prazo</p>
                        <p className={`text-sm ${dias.cor}`}>{dias.label}</p>
                      </div>
                    )}
                    {p.prazos?.length > 0 && (
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-full">
                        {p.prazos.length} prazo{p.prazos.length > 1 ? "s" : ""}
                      </span>
                    )}
                    <button
                      onClick={(e) => deletar(p.id, e)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Processos;
