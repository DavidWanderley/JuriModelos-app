import React from 'react';

const Login = () => {
  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR DE PROPAGANDA (Lado Esquerdo) */}
      <div className="hidden lg:flex w-1/2 bg-[#0e1e3f] text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-500">JuriModelos</h1>
          <p className="mt-4 text-slate-300 text-lg">
            A inteligência por trás das suas petições.
          </p>
        </div>

        {/* Conteúdo da "Propaganda" */}
        <div className="space-y-8">
          <div className="flex gap-4">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-bold text-xl">Agilidade no Protocolo</h3>
              <p className="text-slate-400">Gere petições completas em menos de 2 minutos com nosso sistema de variáveis.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="font-bold text-xl">Segurança Jurídica</h3>
              <p className="text-slate-400">Modelos revisados e atualizados conforme as últimas jurisprudências.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="text-2xl">📁</span>
            <div>
              <h3 className="font-bold text-xl">Gestão Inteligente</h3>
              <p className="text-slate-400">Organize todos os documentos da CW Advocacia em um só lugar.</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          © 2026 JuriModelos - Tecnologia para Advogados
        </div>
      </div>

      {/* ÁREA DO FORMULÁRIO (Lado Direito) */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Bem-vindo de volta</h2>
          <p className="text-slate-500 mb-8">Acesse sua conta para gerenciar seus modelos.</p>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">E-mail</label>
              <input 
                type="email" 
                className="w-full mt-1 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              <input 
                type="password" 
                className="w-full mt-1 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-[#0e1e3f] text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg">
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;