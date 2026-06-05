import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "../../components/Toast";

const TIPOS = ["Audiência", "Prazo Fatal", "Protocolo", "Reunião", "Outros"];
const STATUS_CORES = {
  pendente:  "bg-amber-100 text-amber-700",
  concluido: "bg-emerald-100 text-emerald-700",
  cancelado: "bg-slate-100 text-slate-500",
};
const TIPO_CORES = {
  "Audiência":    "bg-purple-100 text-purple-700",
  "Prazo Fatal":  "bg-red-100 text-red-700",
  "Protocolo":    "bg-orange-100 text-orange-700",
  "Reunião":      "bg-cyan-100 text-cyan-700",
  "Outros":       "bg-slate-100 text-slate-600",
};

const formInicial = {
  titulo: "", numero_processo: "", descricao: "", data_prazo: "",
  hora: "", tipo: "Prazo Fatal", ClienteId: "", ModeloId: "",
};

const Prazos = () => {
  const [prazos, setPrazos]         = useState([]);
  const [clientes, setClientes]     = useState([]);
  const [modelos, setModelos]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando]     = useState(null);
  const [form, setForm]             = useState(formInicial);
  const [salvando, setSalvando]     = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const fetchPrazos = async () => {
    try {
      const res = await api.get("/prazos");
      setPrazos(res.data?.data || res.data || []);
    } catch { toast.error("Erro ao carregar prazos."); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchPrazos();
    api.get("/clientes").then(r => setClientes(r.data?.data || r.data || [])).catch(() => {});
    api.get("/modelos").then(r => setModelos(r.data?.data || r.data || [])).catch(() => {});
  }, []);

  const abrirModal = (prazo = null) => {
    setEditando(prazo);
    setForm(prazo ? {
      titulo: prazo.titulo, numero_processo: prazo.numero_processo || "",
      descricao: prazo.descricao || "", data_prazo: prazo.data_prazo,
      hora: prazo.hora || "", tipo: prazo.tipo,
      ClienteId: prazo.ClienteId || "", ModeloId: prazo.ModeloId || "",
    } : formInicial);
    setModalAberto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const payload = { ...form, ClienteId: form.ClienteId || null, ModeloId: form.ModeloId || null };
      if (editando) {
        await api.put(`/prazos/${editando.id}`, payload);
        toast.success("Prazo atualizado!");
      } else {
        await api.post("/prazos", payload);
        toast.success("Prazo criado!");
      }
      setModalAberto(false);
      fetchPrazos();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao salvar prazo.");
    } finally { setSalvando(false); }
  };

  const concluir = async (id) => {
    try {
      await api.patch(`/prazos/${id}/concluir`);
      toast.success("Prazo concluído!");
      fetchPrazos();
    } catch { toast.error("Erro ao concluir prazo."); }
  };

  const deletar = async (id) => {
    if (!window.confirm("Deseja excluir este prazo?")) return;
    try {
      await api.delete(`/prazos/${id}`);
      toast.success("Prazo removido!");
      fetchPrazos();
    } catch { toast.error("Erro ao remover prazo."); }
  };

  const hoje = new Date().toISOString().split("T")[0];
  const prazosFiltrados = prazos.filter(p => filtroStatus === "todos" || p.status === filtroStatus);
  const vencidos = prazos.filter(p => p.data_prazo < hoje && p.status === "pendente").length;

  const diasRestantes = (data) => {
    const diff = Math.round((new Date(data) - new Date(hoje)) / (1000 * 60 * 60 * 24));
    if (diff < 0)  return { label: `${Math.abs(diff)}d atrasado`, cor: "text-red-600 font-black" };
    if (diff === 0) return { label: "Hoje!",   cor: "text-red-600 font-black" };
    if (diff === 1) return { label: "Amanhã",  cor: "text-orange-500 font-bold" };
    if (diff <= 7)  return { label: `${diff}d`, cor: "text-amber-600 font-bold" };
    return { label: `${diff}d`, cor: "text-slate-400" };
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl ml-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">⚖️ Prazos Processuais</h1>
            <p className="text-slate-500 font-medium">Controle de prazos e audiências</p>
          </div>
          <button
            onClick={() => abrirModal()}
            className="bg-[#0e1e3f] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            + Novo Prazo
          </button>
        </div>

        {/* Cards resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total",     valor: prazos.length,                                                cor: "text-slate-800" },
            { label: "Pendentes", valor: prazos.filter(p => p.status === "pendente").length,           cor: "text-amber-600" },
            { label: "Concluídos",valor: prazos.filter(p => p.status === "concluido").length,          cor: "text-emerald-600" },
            { label: "Vencidos",  valor: vencidos,                                                     cor: "text-red-600" },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{c.label}</p>
              <p className={`text-3xl font-black mt-1 ${c.cor}`}>{c.valor}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6">
          {["todos", "pendente", "concluido", "cancelado"].map(s => (
            <button
              key={s}
              onClick={() => setFiltroStatus(s)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                filtroStatus === s ? "bg-[#0e1e3f] text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-slate-400"
              }`}
            >
              {s === "todos" ? "Todos" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Lista */}
        {prazosFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 border-2 border-dashed border-slate-200 text-center">
            <p className="text-5xl mb-4">⚖️</p>
            <p className="text-xl font-medium text-slate-400">Nenhum prazo encontrado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prazosFiltrados.map(p => {
              const { label, cor } = diasRestantes(p.data_prazo);
              return (
                <div key={p.id} className={`bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4 ${
                  p.data_prazo < hoje && p.status === "pendente" ? "border-red-200 bg-red-50/30" : "border-slate-200"
                }`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIPO_CORES[p.tipo] || "bg-slate-100 text-slate-600"}`}>{p.tipo}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_CORES[p.status]}`}>{p.status}</span>
                      {p.numero_processo && <span className="text-[10px] text-slate-400 font-mono">Proc. {p.numero_processo}</span>}
                    </div>
                    <p className="font-black text-slate-800 truncate">{p.titulo}</p>
                    <div className="flex gap-4 mt-1 text-xs text-slate-400">
                      <span>📅 {p.data_prazo}{p.hora ? ` às ${p.hora}` : ""}</span>
                      {p.cliente && <span>👤 {p.cliente.nome_completo}</span>}
                      {p.modelo  && <span>📋 {p.modelo.titulo}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {p.status === "pendente" && (
                      <span className={`text-sm ${cor}`}>{label}</span>
                    )}
                    {p.status === "pendente" && (
                      <button onClick={() => concluir(p.id)} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-100 transition-all">
                        ✓ Concluir
                      </button>
                    )}
                    <button onClick={() => abrirModal(p)} className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-100 transition-all">
                      Editar
                    </button>
                    <button onClick={() => deletar(p.id)} className="text-xs bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 transition-all">
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800">{editando ? "Editar Prazo" : "Novo Prazo"}</h2>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Título *</label>
                <input required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Nº Processo</label>
                  <input value={form.numero_processo} onChange={e => setForm({...form, numero_processo: e.target.value})}
                    className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700" placeholder="0000000-00.0000.0.00.0000" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Tipo *</label>
                  <select required value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
                    className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700">
                    {TIPOS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Data *</label>
                  <input required type="date" value={form.data_prazo} onChange={e => setForm({...form, data_prazo: e.target.value})}
                    className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Hora</label>
                  <input type="time" value={form.hora} onChange={e => setForm({...form, hora: e.target.value})}
                    className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Cliente</label>
                <select value={form.ClienteId} onChange={e => setForm({...form, ClienteId: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700">
                  <option value="">Sem cliente vinculado</option>
                  {clientes.map(c => <option key={c.id} value={c.id}>{c.nome_completo}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Processo/Modelo</label>
                <select value={form.ModeloId} onChange={e => setForm({...form, ModeloId: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700">
                  <option value="">Sem processo vinculado</option>
                  {modelos.map(m => <option key={m.id} value={m.id}>{m.titulo}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Descrição</label>
                <textarea rows={3} value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})}
                  className="w-full bg-slate-50 border p-3 rounded-xl outline-none font-bold text-slate-700 resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalAberto(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando}
                  className="flex-1 bg-[#0e1e3f] text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50">
                  {salvando ? "Salvando..." : editando ? "Salvar" : "Criar Prazo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prazos;
