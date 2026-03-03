import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SignUp = () => {
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    confirmarEmail: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    oab: "",
    cpf: "",
    sexo: "Masculino",
    nacionalidade: "Brasileiro(a)",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleCepBlur = async () => {
    const cep = dados.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setDados((prev) => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dados.email !== dados.confirmarEmail) return alert("Os e-mails não coincidem!");
    if (dados.senha !== dados.confirmarSenha) return alert("As senhas não coincidem!");

    setLoading(true);
    try {
      const { confirmarEmail, confirmarSenha, ...dadosParaEnviar } = dados;
      await api.post("/auth/register", dadosParaEnviar);
      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao realizar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-200">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#0e1e3f] mb-2 tracking-tight">Cadastro de Advogado</h1>
          <p className="text-slate-500 font-medium italic">Integração ao ecossistema digital da CW Advocacia</p>
        </header>

        {/* Mensagem Visual de Campos Obrigatórios */}
        <div className="mb-10 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl">
          <p className="text-amber-800 text-sm font-bold">
            <span className="text-rose-500 text-lg">*</span> Indica que o preenchimento do campo é obrigatório para o cadastro jurídico.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          <section className="space-y-6">
            <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest border-b pb-2">1. Identificação e Acesso</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Nome Completo <span className="text-rose-500">*</span>
                </label>
                <input type="text" name="nome" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-amber-500" value={dados.nome} onChange={handleChange} />
              </div>
              <div className="md:col-span-1 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  CPF <span className="text-rose-500">*</span>
                </label>
                <input type="text" name="cpf" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.cpf} onChange={handleChange} />
              </div>
              <div className="md:col-span-1 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Número da OAB <span className="text-rose-500">*</span>
                </label>
                <input type="text" name="oab" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.oab} onChange={handleChange} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  E-mail <span className="text-rose-500">*</span>
                </label>
                <input type="email" name="email" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.email} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Confirmar E-mail <span className="text-rose-500">*</span>
                </label>
                <input type="email" name="confirmarEmail" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.confirmarEmail} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Senha <span className="text-rose-500">*</span>
                </label>
                <input type="password" name="senha" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.senha} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Confirmar Senha <span className="text-rose-500">*</span>
                </label>
                <input type="password" name="confirmarSenha" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.confirmarSenha} onChange={handleChange} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Telefone <span className="text-rose-500">*</span>
                </label>
                <input type="text" name="telefone" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.telefone} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Sexo</label>
                <select name="sexo" className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.sexo} onChange={handleChange}>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nacionalidade</label>
                <input type="text" name="nacionalidade" className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.nacionalidade} onChange={handleChange} />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest border-b pb-2">2. Endereço</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  CEP <span className="text-rose-500">*</span>
                </label>
                <input type="text" name="cep" required onBlur={handleCepBlur} className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.cep} onChange={handleChange} />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Rua <span className="text-rose-500">*</span>
                </label>
                <input type="text" name="endereco" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.endereco} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Número <span className="text-rose-500">*</span>
                </label>
                <input type="text" name="numero" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.numero} onChange={handleChange} />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Bairro <span className="text-rose-500">*</span>
                </label>
                <input type="text" name="bairro" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.bairro} onChange={handleChange} />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Complemento</label>
                <input type="text" name="complemento" className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.complemento} onChange={handleChange} />
              </div>
              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Cidade <span className="text-rose-500">*</span>
                </label>
                <input type="text" name="cidade" required className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700" value={dados.cidade} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Estado <span className="text-rose-500">*</span>
                </label>
                <input type="text" name="estado" required maxLength="2" className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold uppercase text-slate-700" value={dados.estado} onChange={handleChange} />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0e1e3f] text-white py-5 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "PROCESSANDO..." : "CONCLUIR CADASTRO JURÍDICO"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;