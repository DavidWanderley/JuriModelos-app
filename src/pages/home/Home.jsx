import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { storage } from "../../services/storage";

const Home = () => {
  const navigate = useNavigate();
  const perfil = storage.getPerfil() || "user";
  const nomeUsuario = storage.getNome() || "Colega";

  const [stats, setStats] = useState({ clientes: 0, documentos: 0, modelos: 0 });
  const [proximasAudiencias, setProximasAudiencias] = useState([]);
  const [compromissos, setCompromissos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [docsPorMes, setDocsPorMes] = useState([]);
  const [eventosPorTipo, setEventosPorTipo] = useState([]);

  const formatData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const fetchDados = async () => {
    try {
      const [resProximos, resCompromissos, resStats, resModelos] = await Promise.allSettled([
        api.get("/eventos/proximos"),
        api.get("/eventos", {
          params: {
            mes: new Date().getMonth() + 1,
            ano: new Date().getFullYear(),
          },
        }),
        api.get("/stats"),
        api.get("/modelos"),
      ]);

      const proximos = resProximos.status === 'fulfilled' ? (resProximos.value.data?.data || resProximos.value.data || []) : [];
      const todos = resCompromissos.status === 'fulfilled' ? (resCompromissos.value.data?.data || resCompromissos.value.data || []) : [];
      const statsData = resStats.status === 'fulfilled' ? (resStats.value.data?.data || resStats.value.data || {}) : {};
      const modelos = resModelos.status === 'fulfilled' ? (resModelos.value.data?.data || resModelos.value.data || []) : [];

      setStats({
        clientes: statsData.totalClientes ?? 0,
        documentos: statsData.totalDocumentos ?? 0,
        modelos: statsData.totalModelos ?? 0,
      });

      // Gráfico: eventos por tipo no mês atual
      const contagemTipos = {};
      todos.forEach(e => {
        contagemTipos[e.tipo] = (contagemTipos[e.tipo] || 0) + 1;
      });
      setEventosPorTipo(
        Object.entries(contagemTipos)
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value }))
      );

      // Gráfico: documentos por mês (últimos 6 meses) via histórico
      let historico = [];
      try {
        const resHistorico = await api.get("/documentos/meus-documentos");
        historico = Array.isArray(resHistorico.data) ? resHistorico.data : resHistorico.data?.data || [];
      } catch (_) {}

      const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
      const hoje = new Date();
      const contagemMeses = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        contagemMeses[chave] = { mes: MESES[d.getMonth()], documentos: 0 };
      }
      historico.forEach(doc => {
        const chave = doc.createdAt?.slice(0, 7);
        if (chave && contagemMeses[chave]) contagemMeses[chave].documentos += 1;
      });
      setDocsPorMes(Object.values(contagemMeses));

      const hojeStr = hoje.toISOString().split("T")[0];

      const audienciasModelo = modelos
        .filter(m => m.data_audiencia && m.data_audiencia >= hojeStr)
        .map(m => ({
          id: `modelo-${m.id}`,
          titulo: m.titulo,
          tipo: "Audiência",
          data: m.data_audiencia,
          hora: m.hora_audiencia || "",
          local: "",
          descricao: m.descricao || "",
          _origem: "modelo",
        }));

      const todasAudiencias = [
        ...proximos.filter(e => e.tipo === "Audiência"),
        ...audienciasModelo,
      ].sort((a, b) => a.data.localeCompare(b.data)).slice(0, 3);

      setProximasAudiencias(todasAudiencias);

      const tiposCompromisso = ["Prazo", "Protocolo", "Reunião", "Atendimento", "Outros"];
      setCompromissos(
        todos
          .filter(e => tiposCompromisso.includes(e.tipo) && e.status === "pendente")
          .slice(0, 5)
      );
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoadingEventos(false);
    }
  };

  useEffect(() => {
    fetchDados();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchDados();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const atalhos = [
    { titulo: "Templates", descricao: "Modelos de automação", icon: "⚙️", path: "/templates", cor: "bg-indigo-500" },
    { titulo: "Modelos", descricao: "Biblioteca de referência", icon: "📋", path: "/modelos", cor: "bg-amber-500" },
    { titulo: "Clientes", descricao: "Gerenciar cadastros", icon: "👥", path: "/clientes", cor: "bg-emerald-500" },
    { titulo: "Histórico", descricao: "Documentos gerados", icon: "📂", path: "/historico", cor: "bg-purple-500" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-black text-slate-800 mb-2">
            Olá, {nomeUsuario.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-500 text-lg font-medium">CW Advocacia - Dashboard Jurídico</p>
        </header>

        {/* Status do Perfil */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full animate-pulse ${perfil === 'admin' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
            <p className="text-sm font-bold uppercase text-slate-400 tracking-wider">Status do Acesso</p>
            <h2 className="text-lg font-black text-slate-700">
              {perfil === 'admin' ? '🛡️ Administrador' : '⚖️ Advogado'}
            </h2>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm font-semibold">Total de Clientes</p>
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-4xl font-black">{stats.clientes}</h3>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm font-semibold">Documentos Gerados</p>
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="text-4xl font-black">{stats.documentos}</h3>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-amber-100 text-sm font-semibold">Modelos Disponíveis</p>
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-4xl font-black">{stats.modelos}</h3>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico: Documentos por Mês */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-black text-slate-800 mb-4">📄 Documentos Gerados por Mês</h2>
            <div className="flex items-end gap-2 h-36">
              {docsPorMes.map((item, i) => {
                const max = Math.max(...docsPorMes.map(d => d.documentos), 1);
                const altura = item.documentos > 0 ? Math.max((item.documentos / max) * 100, 8) : 2;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-500">{item.documentos > 0 ? item.documentos : ''}</span>
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{ height: `${altura}%`, backgroundColor: item.documentos > 0 ? '#0e1e3f' : '#e2e8f0' }}
                    />
                    <span className="text-[10px] text-slate-400 font-medium">{item.mes}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gráfico: Eventos por Tipo */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-black text-slate-800 mb-4">📊 Eventos por Tipo (Mês Atual)</h2>
            {eventosPorTipo.length > 0 ? (
              <div className="space-y-3">
                {eventosPorTipo.map((item, i) => {
                  const total = eventosPorTipo.reduce((s, e) => s + e.value, 0);
                  const pct = Math.round((item.value / total) * 100);
                  const cores = ['#7c3aed','#ef4444','#f59e0b','#06b6d4','#f97316','#64748b'];
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span>{item.name}</span>
                        <span>{item.value} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cores[i % 6] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-36 text-slate-400 text-sm font-medium">Nenhum evento cadastrado este mês</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Próximas Audiências */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <span className="text-2xl">⚖️</span>
                Próximas Audiências
              </h2>
              <button onClick={() => navigate("/agenda")} className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                Ver todas →
              </button>
            </div>
            {loadingEventos ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              </div>
            ) : proximasAudiencias.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-3xl mb-2">⚖️</p>
                <p className="text-sm font-medium">Nenhuma audiência próxima</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proximasAudiencias.map((ev) => (
                  <div key={ev.id} className="border-l-4 border-purple-500 bg-purple-50 rounded-r-xl p-4 hover:bg-purple-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-800">{ev.titulo}</h3>
                          {ev._origem === "modelo" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Modelo</span>
                          )}
                        </div>
                        {ev.local && <p className="text-xs text-slate-500 mb-1">{ev.local}</p>}
                        {ev.descricao && <p className="text-sm text-slate-600 font-medium line-clamp-1">{ev.descricao}</p>}
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm font-bold text-purple-600">{formatData(ev.data)}</p>
                        {ev.hora && <p className="text-xs text-slate-500">{ev.hora}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compromissos e Prazos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <span className="text-2xl">📌</span>
                Compromissos e Prazos
              </h2>
              <button onClick={() => navigate("/agenda")} className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                Ver agenda →
              </button>
            </div>
            {loadingEventos ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500" />
              </div>
            ) : compromissos.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm font-medium">Nenhum compromisso pendente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {compromissos.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-sm mb-1">{item.titulo}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          item.prioridade === "alta" ? "bg-red-100 text-red-700" :
                          item.prioridade === "media" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {item.prioridade === "alta" ? "🔴 Urgente" : item.prioridade === "media" ? "🟡 Médio" : "🟢 Baixo"}
                        </span>
                        <span className="text-xs text-slate-500">📅 {formatData(item.data)}</span>
                        <span className="text-xs text-slate-400 font-medium">{item.tipo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Acesso Rápido */}
        <div>
          <h2 className="text-xl font-black text-slate-800 mb-6">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {atalhos.map((atalho) => (
              <button
                key={atalho.path}
                onClick={() => navigate(atalho.path)}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-amber-400 transition-all text-left group"
              >
                <div className={`w-12 h-12 ${atalho.cor} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {atalho.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{atalho.titulo}</h3>
                <p className="text-slate-500 text-sm">{atalho.descricao}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
