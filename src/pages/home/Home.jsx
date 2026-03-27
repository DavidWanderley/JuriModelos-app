import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Home = () => {
  const navigate = useNavigate();
  const perfil = localStorage.getItem("perfil") || "Usuário";
  const nomeUsuario = localStorage.getItem("nome") || "Colega";

  const [stats, setStats] = useState({ clientes: 0, documentos: 0, modelos: 0 });
  const [proximasAudiencias, setProximasAudiencias] = useState([]);
  const [compromissos, setCompromissos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);

  const formatData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [resProximos, resCompromissos, resStats, resModelos] = await Promise.all([
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

        const proximos = resProximos.data?.data || resProximos.data || [];
        const todos = resCompromissos.data?.data || resCompromissos.data || [];
        const statsData = resStats.data?.data || resStats.data || {};
        const modelos = resModelos.data?.data || resModelos.data || [];

        setStats({
          clientes: statsData.totalClientes ?? 0,
          documentos: statsData.totalDocumentos ?? 0,
          modelos: statsData.totalModelos ?? 0,
        });

        const hoje = new Date().toISOString().split("T")[0];

        const audienciasModelo = modelos
          .filter(m => m.data_audiencia && m.data_audiencia >= hoje)
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
    fetchDados();
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