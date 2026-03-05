import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const perfil = localStorage.getItem("perfil") || "Usuário";
  const nomeUsuario = localStorage.getItem("nome") || "Colega";

  const [stats, setStats] = useState({
    clientes: 0,
    documentos: 0,
    modelos: 0,
  });

  const proximasAudiencias = [
    { id: 1, cliente: "João Silva", processo: "0001234-56.2024.8.02.0001", data: "15/01/2025", hora: "14:00", tipo: "Audiência de Conciliação" },
    { id: 2, cliente: "Maria Santos", processo: "0007890-12.2024.8.02.0001", data: "18/01/2025", hora: "10:30", tipo: "Audiência de Instrução" },
    { id: 3, cliente: "Pedro Costa", processo: "0005678-90.2024.8.02.0001", data: "22/01/2025", hora: "15:00", tipo: "Audiência Inicial" },
  ];

  const compromissos = [
    { id: 1, titulo: "Protocolar Petição Inicial", prazo: "Hoje", prioridade: "alta" },
    { id: 2, titulo: "Responder Contestação - Processo 123", prazo: "Amanhã", prioridade: "alta" },
    { id: 3, titulo: "Reunião com Cliente - Ana Paula", prazo: "16/01", prioridade: "media" },
    { id: 4, titulo: "Revisar Contrato de Prestação de Serviços", prazo: "20/01", prioridade: "baixa" },
  ];

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
              <button 
                onClick={() => navigate("/agenda")}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Ver todas →
              </button>
            </div>
            <div className="space-y-4">
              {proximasAudiencias.map((audiencia) => (
                <div key={audiencia.id} className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 hover:bg-blue-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-1">{audiencia.cliente}</h3>
                      <p className="text-xs text-slate-500 mb-2">{audiencia.processo}</p>
                      <p className="text-sm text-slate-600 font-medium">{audiencia.tipo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">{audiencia.data}</p>
                      <p className="text-xs text-slate-500">{audiencia.hora}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compromissos e Prazos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <span className="text-2xl">📌</span>
                Compromissos e Prazos
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                Adicionar +
              </button>
            </div>
            <div className="space-y-3">
              {compromissos.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 text-sm mb-1">{item.titulo}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        item.prioridade === 'alta' ? 'bg-red-100 text-red-700' :
                        item.prioridade === 'media' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.prioridade === 'alta' ? '🔴 Urgente' : item.prioridade === 'media' ? '🟡 Médio' : '🟢 Baixo'}
                      </span>
                      <span className="text-xs text-slate-500">📅 {item.prazo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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