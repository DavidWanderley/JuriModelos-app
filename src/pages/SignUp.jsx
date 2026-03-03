import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SignUp = () => {
  const [dados, setDados] = useState({
    nome: "",
    email: "",
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
  const [cepLoading, setCepLoading] = useState(false);
  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const navigate = useNavigate();

  const estadosBR = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  useEffect(() => {
    const carregarCidades = async () => {
      if (!dados.estado) {
        setCidades([]);
        return;
      }
      setLoadingCidades(true);
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${dados.estado}/municipios`,
        );
        const data = await response.json();
        const nomesCidades = data.map((c) => c.nome).sort();
        setCidades(nomesCidades);
      } catch (error) {
        console.error("Erro ao carregar cidades", error);
      } finally {
        setLoadingCidades(false);
      }
    };
    carregarCidades();
  }, [dados.estado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cep") {
      const soNumeros = value.replace(/\D/g, "");
      setDados({ ...dados, [name]: soNumeros });
      return;
    }
    setDados({ ...dados, [name]: value });
  };

  const handleCepBlur = async () => {
    const cep = dados.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setDados((prev) => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          estado: data.uf,
          cidade: data.localidade,
        }));
      } else {
        alert("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dados.senha !== dados.confirmarSenha)
      return alert("As senhas não coincidem!");

    setLoading(true);
    try {
      const { confirmarSenha, ...dadosParaEnviar } = dados;
      await api.post("/auth/register", dadosParaEnviar);
      alert("Advogado cadastrado com sucesso!");
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
          <h1 className="text-4xl font-black text-[#0e1e3f] mb-2 tracking-tight">
            Cadastro de Advogado
          </h1>
          <p className="text-slate-500 font-medium italic">
            CW Advocacia - Gestão de Acervo
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="space-y-6">
            <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest border-b pb-2">
              1. Identificação e Acesso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nome"
                  required
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-amber-500"
                  value={dados.nome}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-1 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  required
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700"
                  value={dados.cpf}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-1 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  OAB *
                </label>
                <input
                  type="text"
                  name="oab"
                  required
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700"
                  value={dados.oab}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-amber-500"
                  value={dados.email}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Senha *
                </label>
                <input
                  type="password"
                  name="senha"
                  required
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700"
                  value={dados.senha}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  name="confirmarSenha"
                  required
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700"
                  value={dados.confirmarSenha}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Telefone *
                </label>
                <input
                  type="text"
                  name="telefone"
                  required
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700"
                  value={dados.telefone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest border-b pb-2">
              2. Endereço
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex justify-between">
                  CEP *
                  {cepLoading && (
                    <span className="text-amber-500 animate-pulse text-[8px]">
                      Buscando...
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="cep"
                  maxLength="8"
                  required
                  onBlur={handleCepBlur}
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700"
                  value={dados.cep}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Rua *
                </label>
                <input
                  type="text"
                  name="endereco"
                  required
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700"
                  value={dados.endereco}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Número *
                </label>
                <input
                  type="text"
                  name="numero"
                  required
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700"
                  value={dados.numero}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Bairro *
                </label>
                <input
                  type="text"
                  name="bairro"
                  required
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700"
                  value={dados.bairro}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Complemento
                </label>
                <input
                  type="text"
                  name="complemento"
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-amber-500"
                  value={dados.complemento}
                  onChange={handleChange}
                  placeholder="Ex: Sala 2, Bloco A"
                />
              </div>

              <div className="md:col-span-1 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Estado *
                </label>
                <select
                  name="estado"
                  required
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-amber-500"
                  value={dados.estado}
                  onChange={handleChange}
                >
                  <option value="">UF</option>
                  {estadosBR.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Cidade *{" "}
                  {loadingCidades && (
                    <span className="ml-2 text-amber-500 animate-pulse text-[8px]">
                      Sincronizando...
                    </span>
                  )}
                </label>
                <select
                  name="cidade"
                  required
                  disabled={!dados.estado || loadingCidades}
                  className="bg-slate-50 border p-4 rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                  value={dados.cidade}
                  onChange={handleChange}
                >
                  <option value="">
                    {dados.estado
                      ? "Selecione a cidade"
                      : "Escolha o estado primeiro"}
                  </option>
                  {cidades.map((cid) => (
                    <option key={cid} value={cid}>
                      {cid}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0e1e3f] text-white py-5 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "PROCESSANDO..." : "CONCLUIR CADASTRO JURÍDICO"}
            </button>

            <div className="text-center">
              <p className="text-slate-500 font-medium">
                Já possui uma conta no JuriModelos?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-amber-600 font-black hover:underline underline-offset-4 transition-all"
                >
                  Faça login aqui
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
