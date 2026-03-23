import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import { MESSAGES, CATEGORIAS } from "../../utils/constants";
import BackButton from "../../components/BackButton";

const CreateTemplate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: "",
    categoria: "",
    conteudo: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/templates", form);
      toast.success(MESSAGES.SUCCESS.TEMPLATE_CRIADO);
      setTimeout(() => navigate("/templates"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao criar template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-5xl ml-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">⚙️ Novo Template de Automação</h1>
            <p className="text-slate-500 font-medium">Crie um modelo com chaves para geração automática</p>
          </div>
          <BackButton to="/templates" label="Voltar" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-2">💡 DICA: Use chaves para campos dinâmicos</p>
            <p className="text-xs text-amber-600">
              Exemplo: {`{{nome}}, {{cpf}}, {{endereco}}`} - Serão substituídos pelos dados do cliente
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Título do Template *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Petição Inicial - Ação de Cobrança"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Categoria *
            </label>
            <select
              required
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-700 bg-white"
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Conteúdo do Template *
            </label>
            <textarea
              required
              rows={20}
              placeholder={`Digite o conteúdo com chaves dinâmicas...\n\nExemplo:\nEXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO\n\n{{nome}}, {{nacionalidade}}, {{estado_civil}}, portador do CPF {{cpf}}, residente em {{endereco}}, vem respeitosamente...`}
              value={form.conteudo}
              onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
              className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm text-slate-700"
            />
            <p className="text-xs text-slate-400 mt-2">
              Use {`{{chave}}`} para campos que serão preenchidos automaticamente
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/templates")}
              className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0e1e3f] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {loading ? "Salvando..." : "Criar Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTemplate;
