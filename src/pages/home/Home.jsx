import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const perfil = localStorage.getItem("perfil") || "Usuário";
  const nomeUsuario = localStorage.getItem("nome") || "Colega";

  const atalhos = [
    { titulo: "Gerar Documento", descricao: "Mesclar modelo com cliente", icon: "📝", path: "/gerar-documento", cor: "bg-blue-500" },
    { titulo: "Modelos", descricao: "Biblioteca de templates", icon: "📋", path: "/modelos", cor: "bg-amber-500" },
    { titulo: "Clientes", descricao: "Gerenciar cadastros", icon: "👥", path: "/clientes", cor: "bg-emerald-500" },
    { titulo: "Histórico", descricao: "Documentos gerados", icon: "📂", path: "/historico", cor: "bg-purple-500" },
    { titulo: "Agenda", descricao: "Audiências agendadas", icon: "📅", path: "/agenda", cor: "bg-rose-500" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl ml-10">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-800 mb-2">
            Olá, {nomeUsuario.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-500 text-lg font-medium">CW Advocacia - Gestão de Acervo Jurídico</p>
        </header>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase text-slate-400 tracking-widest mb-2">Status do Acesso</p>
              <div className="flex items-center gap-3">
                <span className={`w-4 h-4 rounded-full animate-pulse ${perfil === 'admin' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                <h2 className="text-2xl font-black text-slate-700">
                  {perfil === 'admin' ? '🛡️ Administrador' : '⚖️ Advogado'}
                </h2>
              </div>
            </div>
            {perfil === 'admin' && (
              <button
                onClick={() => navigate("/novo-modelo")}
                className="bg-[#0e1e3f] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                + Novo Modelo
              </button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-800 mb-6">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {atalhos.map((atalho) => (
              <button
                key={atalho.path}
                onClick={() => navigate(atalho.path)}
                className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-amber-400 transition-all text-left group"
              >
                <div className={`w-14 h-14 ${atalho.cor} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {atalho.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{atalho.titulo}</h3>
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