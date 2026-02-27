import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* LADO ESQUERDO: PROPAGANDA (Ajustado) */}
      <div className="hidden lg:flex w-1/2 bg-[#0e1e3f] text-white p-16 flex-col justify-between relative overflow-hidden">
        {/* Detalhe decorativo sutil ao fundo */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight text-amber-500">JuriModelos</h1>
          <p className="mt-4 text-slate-300 text-xl font-light max-w-md">
            Otimize sua prática jurídica com a inteligência da <span className="text-white font-semibold">CW Advocacia</span>.
          </p>
        </div>

        {/* Itens de Propaganda como "Mini Cards" */}
        <div className="space-y-6 relative z-10">
          <div className="flex gap-5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-500">Agilidade no Protocolo</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Petições completas em minutos com preenchimento dinâmico de variáveis.</p>
            </div>
          </div>

          <div className="flex gap-5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-500">Segurança Jurídica</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Modelos baseados nas jurisprudências mais recentes dos tribunais superiores.</p>
            </div>
          </div>

          <div className="flex gap-5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center text-2xl">
              📁
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-500">Gestão de Peças</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Acesse sua biblioteca pessoal de modelos em qualquer lugar, 24/7.</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500 relative z-10 border-t border-white/10 pt-6">
          © 2026 <span className="text-slate-400 font-medium">CW Advocacia</span> • Todos os direitos reservados.
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO (Mantido com melhorias de foco) */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-24">
        <div className="max-w-md w-full">
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-bold text-[#0e1e3f]">JuriModelos</h1>
          </div>
          
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Login</h2>
          <p className="text-slate-500 mb-10">Insira suas credenciais para acessar o painel.</p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 text-red-700 text-sm flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-mail Corporativo</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="exemplo@cwadvocacia.com.br"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Senha de Acesso</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-[#0e1e3f] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Validando acesso...' : 'Acessar Plataforma'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;