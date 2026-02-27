import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Usar navigate é mais suave que window.location em SPAs
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between shadow-sm">
      
      {/* Barra de Pesquisa */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-amber-500 transition-colors">
            🔍
          </span>
          <input 
            type="text" 
            placeholder="Pesquisar modelos, processos ou petições..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
          />
        </div>
      </div>
      
      {/* Perfil e Ações */}
      <div className="flex items-center gap-6">
        
        {/* Notificações (Opcional, mas dá um ar profissional) */}
        <button className="text-slate-400 hover:text-amber-600 transition-colors text-xl relative">
          🔔
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Divisor */}
        <div className="h-8 w-[1px] bg-slate-200"></div>

        {/* Info do Advogado */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">David Wanderley</p>
            <p className="text-[11px] text-amber-600 font-semibold uppercase tracking-wider mt-1">OAB/CE Ativa</p>
          </div>
          
          <div className="relative group">
            <div className="w-10 h-10 bg-[#0e1e3f] border-2 border-amber-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer group-hover:scale-105 transition-transform">
              DW
            </div>
          </div>

          {/* Botão Sair */}
          <button 
            onClick={handleLogout}
            className="ml-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2 group"
            title="Sair do sistema"
          >
            <span className="text-lg group-hover:rotate-12 transition-transform">🚪</span>
            <span className="text-xs font-bold hidden md:block">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;