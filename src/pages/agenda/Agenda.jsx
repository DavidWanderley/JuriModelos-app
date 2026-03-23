import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const TIPOS = ["Audiência", "Atendimento", "Reunião", "Prazo", "Protocolo", "Outros"];
const PRIORIDADES = ["baixa", "media", "alta"];
const STATUS_LIST = ["pendente", "concluido", "cancelado"];

// Cores por tipo — usadas nas bolinhas do calendário e nos cards
const TIPO_DOT = {
  "Audiência":   "bg-purple-500",
  "Atendimento": "bg-blue-500",
  "Reunião":     "bg-cyan-500",
  "Prazo":       "bg-red-500",
  "Protocolo":   "bg-orange-500",
  "Outros":      "bg-slate-400",
  "modelo":      "bg-amber-500",
};
const TIPO_BADGE = {
  "Audiência":   "bg-purple-100 text-purple-700",
  "Atendimento": "bg-blue-100 text-blue-700",
  "Reunião":     "bg-cyan-100 text-cyan-700",
  "Prazo":       "bg-red-100 text-red-700",
  "Protocolo":   "bg-orange-100 text-orange-700",
  "Outros":      "bg-slate-100 text-slate-600",
  "modelo":      "bg-amber-100 text-amber-700",
};
const PRIORIDADE_BADGE = { baixa: "bg-green-100 text-green-700", media: "bg-amber-100 text-amber-700", alta: "bg-red-100 text-red-700" };
const STATUS_BADGE = { pendente: "bg-blue-100 text-blue-700", concluido: "bg-green-100 text-green-700", cancelado: "bg-slate-100 text-slate-500" };

const FORM_INICIAL = { titulo: "", tipo: "Audiência", descricao: "", data: "", hora: "", local: "", prioridade: "media", status: "pendente" };

const normalizeArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

export default function Agenda() {
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [eventos, setEventos] = useState([]);
  const [eventosModelo, setEventosModelo] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const fetchEventos = useCallback(async () => {
    setLoading(true);
    try {
      const [resEventos, resModelos] = await Promise.all([
        api.get("/eventos", { params: { mes: mesAtual + 1, ano: anoAtual } }),
        api.get("/modelos"),
      ]);

      setEventos(normalizeArray(resEventos.data));

      // Converte modelos com data_audiencia em eventos virtuais para exibição
      const modelosComData = normalizeArray(resModelos.data)
        .filter(m => m.data_audiencia)
        .map(m => ({
          id: `modelo-${m.id}`,
          titulo: m.titulo,
          tipo: "Audiência",
          _origem: "modelo",
          descricao: m.descricao || "",
          data: m.data_audiencia,
          hora: m.hora_audiencia || "",
          local: "",
          prioridade: "alta",
          status: "pendente",
        }));

      setEventosModelo(modelosComData);
    } catch (e) {
      console.error("Erro ao carregar agenda:", e);
    } finally {
      setLoading(false);
    }
  }, [mesAtual, anoAtual]);

  useEffect(() => { fetchEventos(); }, [fetchEventos]);

  const todosEventos = [...eventos, ...eventosModelo];

  const diasDoMes = () => {
    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const cells = Array(primeiroDia).fill(null);
    for (let d = 1; d <= totalDias; d++) cells.push(d);
    return cells;
  };

  const dataStr = (dia) =>
    `${anoAtual}-${String(mesAtual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

  const eventosNoDia = (dia) => {
    if (!dia) return [];
    return todosEventos.filter(e => e.data === dataStr(dia));
  };

  const eventosDodiaSelecionado = diaSelecionado ? eventosNoDia(diaSelecionado) : [];

  const abrirCriar = () => {
    setErro("");
    setForm({ ...FORM_INICIAL, data: diaSelecionado ? dataStr(diaSelecionado) : "" });
    setEventoEditando(null);
    setModalAberto(true);
  };

  const abrirEditar = (evento) => {
    if (evento._origem === "modelo") return; // modelos são somente leitura na agenda
    setErro("");
    setForm({
      titulo: evento.titulo, tipo: evento.tipo, descricao: evento.descricao || "",
      data: evento.data, hora: evento.hora || "", local: evento.local || "",
      prioridade: evento.prioridade, status: evento.status,
    });
    setEventoEditando(evento);
    setModalAberto(true);
  };

  const salvar = async (e) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      if (eventoEditando) {
        await api.put(`/eventos/${eventoEditando.id}`, form);
      } else {
        await api.post("/eventos", form);
      }
      setModalAberto(false);
      await fetchEventos();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Erro ao salvar evento.";
      setErro(msg);
      console.error("Erro ao salvar evento:", err.response?.data || err);
    } finally {
      setSalvando(false);
    }
  };

  const deletar = async (id) => {
    if (!confirm("Excluir este evento?")) return;
    try {
      await api.delete(`/eventos/${id}`);
      await fetchEventos();
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  const navMes = (dir) => {
    setDiaSelecionado(null);
    if (dir === -1 && mesAtual === 0) { setMesAtual(11); setAnoAtual(a => a - 1); }
    else if (dir === 1 && mesAtual === 11) { setMesAtual(0); setAnoAtual(a => a + 1); }
    else setMesAtual(m => m + dir);
  };

  const isHoje = (dia) =>
    dia === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear();

  // Pega os tipos únicos do dia para colorir o fundo da célula
  const corFundoDia = (evs) => {
    if (!evs.length) return "";
    const tipos = [...new Set(evs.map(e => e.tipo))];
    if (tipos.includes("Prazo"))       return "bg-red-50 border border-red-200";
    if (tipos.includes("Audiência"))   return "bg-purple-50 border border-purple-200";
    if (tipos.includes("Atendimento")) return "bg-blue-50 border border-blue-200";
    if (tipos.includes("Reunião"))     return "bg-cyan-50 border border-cyan-200";
    if (tipos.includes("Protocolo"))   return "bg-orange-50 border border-orange-200";
    return "bg-slate-50 border border-slate-200";
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800">📅 Agenda Jurídica</h1>
          <p className="text-slate-500 font-medium">Audiências e compromissos</p>
        </div>
        <button onClick={abrirCriar} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">
          + Novo Evento
        </button>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(TIPO_DOT).filter(([k]) => k !== "modelo").map(([tipo, cor]) => (
          <span key={tipo} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span className={`w-2.5 h-2.5 rounded-full ${cor}`} />{tipo}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />Modelo
        </span>
      </div>

      <div className="flex gap-6">
        {/* Calendário */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => navMes(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 text-xl font-bold">‹</button>
            <h2 className="text-lg font-black text-slate-800">{MESES[mesAtual]} {anoAtual}</h2>
            <button onClick={() => navMes(1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 text-xl font-bold">›</button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DIAS_SEMANA.map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {diasDoMes().map((dia, i) => {
                const evs = eventosNoDia(dia);
                const selecionado = dia === diaSelecionado;
                const fundoComEvento = !selecionado && !isHoje(dia) ? corFundoDia(evs) : "";

                return (
                  <div
                    key={i}
                    onClick={() => dia && setDiaSelecionado(selecionado ? null : dia)}
                    className={`min-h-[64px] p-1.5 rounded-xl transition-all ${
                      !dia ? "" :
                      selecionado ? "bg-amber-500 cursor-pointer" :
                      isHoje(dia) ? "bg-amber-50 border-2 border-amber-400 cursor-pointer hover:bg-amber-100" :
                      evs.length ? `${fundoComEvento} cursor-pointer hover:opacity-80` :
                      "hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    {dia && (
                      <>
                        <span className={`text-sm font-bold block text-center ${selecionado ? "text-white" : isHoje(dia) ? "text-amber-600" : "text-slate-700"}`}>
                          {dia}
                        </span>
                        <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                          {evs.slice(0, 4).map((ev, idx) => (
                            <span
                              key={idx}
                              className={`w-2 h-2 rounded-full ${selecionado ? "bg-white" : ev._origem === "modelo" ? TIPO_DOT["modelo"] : (TIPO_DOT[ev.tipo] || TIPO_DOT["Outros"])}`}
                            />
                          ))}
                          {evs.length > 4 && (
                            <span className={`text-[9px] font-bold ${selecionado ? "text-white" : "text-slate-400"}`}>+{evs.length - 4}</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Painel lateral */}
        {diaSelecionado && (
          <div className="w-80 bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800">
                {String(diaSelecionado).padStart(2, "0")}/{String(mesAtual + 1).padStart(2, "0")}/{anoAtual}
              </h3>
              <button onClick={abrirCriar} className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg transition-colors">
                + Adicionar
              </button>
            </div>

            {eventosDodiaSelecionado.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-10">
                <span className="text-3xl mb-2">📭</span>
                <p className="text-sm font-medium">Nenhum evento neste dia</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3">
                {eventosDodiaSelecionado.map(ev => (
                  <div key={ev.id} className={`rounded-2xl p-3 border-l-4 ${ev._origem === "modelo" ? "border-amber-400 bg-amber-50" : "border-transparent bg-slate-50"} hover:bg-opacity-80 transition-colors`}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="font-bold text-slate-800 text-sm leading-tight">{ev.titulo}</p>
                      {!ev._origem && (
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => abrirEditar(ev)} className="text-slate-400 hover:text-amber-500 transition-colors">✏️</button>
                          <button onClick={() => deletar(ev.id)} className="text-slate-400 hover:text-red-500 transition-colors">🗑️</button>
                        </div>
                      )}
                      {ev._origem === "modelo" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">Modelo</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">
                      {ev.tipo}{ev.hora ? ` · ${ev.hora}` : ""}{ev.local ? ` · ${ev.local}` : ""}
                    </p>
                    {ev.descricao && <p className="text-xs text-slate-400 mb-2 line-clamp-2">{ev.descricao}</p>}
                    <div className="flex gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIPO_BADGE[ev.tipo] || TIPO_BADGE["Outros"]}`}>{ev.tipo}</span>
                      {!ev._origem && (
                        <>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRIORIDADE_BADGE[ev.prioridade]}`}>{ev.prioridade}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[ev.status]}`}>{ev.status}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal criar/editar */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-slate-800">{eventoEditando ? "Editar Evento" : "Novo Evento"}</h2>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none">×</button>
            </div>

            {erro && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-2.5 rounded-xl">
                {erro}
              </div>
            )}

            <form onSubmit={salvar} className="space-y-3">
              <input
                required
                placeholder="Título *"
                value={form.titulo}
                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.tipo}
                  onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white"
                >
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </select>
                <select
                  value={form.prioridade}
                  onChange={e => setForm(f => ({ ...f, prioridade: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white"
                >
                  {PRIORIDADES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="date"
                  value={form.data}
                  onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                />
                <input
                  type="time"
                  value={form.hora}
                  onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <input
                placeholder="Local"
                value={form.local}
                onChange={e => setForm(f => ({ ...f, local: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />

              <textarea
                placeholder="Descrição"
                rows={2}
                value={form.descricao}
                onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 resize-none"
              />

              {eventoEditando && (
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white"
                >
                  {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
                </select>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 border border-slate-200 text-slate-600 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                >
                  {salvando ? "Salvando..." : eventoEditando ? "Salvar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
