import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="ml-44 pt-24 p-10 bg-slate-50 min-h-screen flex flex-col items-center justify-center text-center">
      <div className="max-w-md">
        <span className="text-9xl mb-6 block">⚖️</span>
        <h1 className="text-6xl font-black text-[#0e1e3f] mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 mb-6">Petição Não Encontrada!</h2>
        <p className="text-slate-500 mb-10 leading-relaxed font-medium">
          Parece que esta "peça" não consta nos autos do sistema. O link pode estar quebrado ou a página foi movida para outro acervo.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="bg-[#0e1e3f] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-95"
        >
          VOLTAR AO ACERVO PRINCIPAL
        </button>
      </div>
    </div>
  );
};

export default NotFound;