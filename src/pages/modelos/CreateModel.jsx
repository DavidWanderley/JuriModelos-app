import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateModel = () => {
  const [dados, setDados] = useState({
    titulo: "",
    categoria: "Petições",
    descricao: "",
    conteudo: "",
    jurisdicao: "Estadual",
    complexidade: "Média",
    tipo_cliente: "PF",
    base_legal: "",
    tags: "",
    data_audiencia: "",
    hora_audiencia: "",
  });

  const [arquivo, setArquivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(dados).forEach((key) => {
        formData.append(key, dados[key]);
      });

      if (arquivo) {
        formData.append("pdf_referencia", arquivo);
      }

      await api.post("/modelos", formData);
      alert("Modelo e PDF salvos com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar. Verifique se o Backend aceita arquivos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-44 pt-24 p-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-200">
        <header className="mb-6">
          <h1 className="text-3xl font-black text-slate-800 mb-2">
            Engenharia de Modelo
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Configurando inteligência para o acervo da CW Advocacia.
          </p>
        </header>

        <p className="text-rose-500 text-sm font-bold mb-10 flex items-center gap-1">
          <span className="text-lg">*</span> Campos obrigatórios para o acervo
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="space-y-6">
            <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest border-b pb-2">
              1. Identificação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  TÍTULO DA PEÇA <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-xl"
                  required
                  placeholder="Ex: Ação de Indenização por Danos Morais"
                  value={dados.titulo}
                  onChange={(e) =>
                    setDados({ ...dados, titulo: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  CATEGORIA <span className="text-rose-500">*</span>
                </label>
                <select
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-xl bg-white"
                  required
                  value={dados.categoria}
                  onChange={(e) =>
                    setDados({ ...dados, categoria: e.target.value })
                  }
                >
                  <option value="Petições">Petições</option>
                  <option value="Contratos">Contratos</option>
                  <option value="Recursos">Recursos</option>
                  <option value="Pareceres">Pareceres</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  TIPO DE CLIENTE
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setDados({ ...dados, tipo_cliente: "PF" })}
                    className={`flex-1 py-4 rounded-xl font-bold border ${dados.tipo_cliente === "PF" ? "bg-[#0e1e3f] text-white border-[#0e1e3f]" : "bg-white text-slate-500"}`}
                  >
                    Pessoa Física
                  </button>
                  <button
                    type="button"
                    onClick={() => setDados({ ...dados, tipo_cliente: "PJ" })}
                    className={`flex-1 py-4 rounded-xl font-bold border ${dados.tipo_cliente === "PJ" ? "bg-[#0e1e3f] text-white border-[#0e1e3f]" : "bg-white text-slate-500"}`}
                  >
                    Pessoa Jurídica
                  </button>
                </div>
              </div>
              
              <div className="bg-amber-50/50 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6 border border-amber-100 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase text-amber-700 px-2">
                    Data da Audiência
                  </label>
                  <input
                    type="date"
                    name="data_audiencia"
                    value={dados.data_audiencia}
                    onChange={(e) =>
                      setDados({ ...dados, data_audiencia: e.target.value })
                    }
                    className="bg-white border-amber-200 border p-3 rounded-xl outline-none font-bold text-slate-700"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase text-amber-700 px-2">
                    Hora da Audiência
                  </label>
                  <input
                    type="time"
                    name="hora_audiencia"
                    value={dados.hora_audiencia}
                    onChange={(e) =>
                      setDados({ ...dados, hora_audiencia: e.target.value })
                    }
                    className="bg-white border-amber-200 border p-3 rounded-xl outline-none font-bold text-slate-700"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest border-b pb-2">
              2. Parâmetros Técnicos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">JURISDIÇÃO</label>
                <select
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 text-lg bg-white"
                  value={dados.jurisdicao}
                  onChange={(e) => setDados({ ...dados, jurisdicao: e.target.value })}
                >
                  <option value="Estadual">Justiça Estadual</option>
                  <option value="Federal">Justiça Federal</option>
                  <option value="Trabalhista">Justiça do Trabalho</option>
                  <option value="Superior">Tribunais Superiores</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">COMPLEXIDADE</label>
                <select
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 text-lg bg-white"
                  value={dados.complexidade}
                  onChange={(e) => setDados({ ...dados, complexidade: e.target.value })}
                >
                  <option value="Baixa">Baixa (Padrão)</option>
                  <option value="Média">Média (Requer atenção)</option>
                  <option value="Alta">Alta (Complexa)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">BASE LEGAL PRINCIPAL</label>
                <input
                  type="text"
                  placeholder="Ex: Art. 186 CC"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 text-lg"
                  value={dados.base_legal}
                  onChange={(e) => setDados({ ...dados, base_legal: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest border-b pb-2">
              3. Anexos de Referência
            </h2>
            <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center transition-all hover:border-amber-400">
              <label className="cursor-pointer text-center">
                <span className="text-4xl mb-3 block">📄</span>
                <span className="text-lg font-bold text-slate-700 block">
                  {arquivo ? arquivo.name : "Upload de PDF (Exemplo Real)"}
                </span>
                <span className="text-sm text-slate-400">Clique para selecionar</span>
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setArquivo(e.target.files[0])} />
              </label>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest border-b pb-2">
              4. Conteúdo Jurídico
            </h2>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                DESCRIÇÃO RÁPIDA
              </label>
              <input
                type="text"
                placeholder="Ex: Usar quando houver negativa de cirurgia urgente."
                className="w-full px-5 py-4 rounded-xl border border-slate-200 text-lg"
                value={dados.descricao}
                onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                TEXTO BASE DO MODELO <span className="text-rose-500">*</span>
              </label>
              <textarea
                className="w-full px-6 py-5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-lg min-h-[400px] font-serif leading-relaxed"
                required
                placeholder="EXCELENTÍSSIMO SENHOR DOUTOR JUIZ..."
                value={dados.conteudo}
                onChange={(e) => setDados({ ...dados, conteudo: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">PALAVRAS-CHAVE</label>
              <input
                type="text"
                placeholder="liminar, saúde, cdc"
                className="w-full px-5 py-4 rounded-xl border border-slate-200 text-lg"
                value={dados.tags}
                onChange={(e) => setDados({ ...dados, tags: e.target.value })}
              />
            </div>
          </section>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0e1e3f] text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loading ? "SINCRONIZANDO..." : "SALVAR MODELO"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-10 py-5 rounded-2xl font-bold text-xl text-slate-500 hover:bg-slate-100 transition-all"
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModel;