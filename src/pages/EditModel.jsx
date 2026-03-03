import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import LegalEditor from "../components/LegalEditor";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "indent",
];

const EditModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "Petições",
    complexidade: "Média",
    jurisdicao: "",
    base_legal: "",
    tags: "",
    conteudo: "",
    data_audiencia: "",
    hora_audiencia: "",
  });
  useEffect(() => {
    const loadModelo = async () => {
      try {
        const response = await api.get(`/modelos/${id}`);
        const data = response.data;

        setFormData({
          ...data,
          data_audiencia: data.data_audiencia || "",
          hora_audiencia: data.hora_audiencia || "",
          jurisdicao: data.jurisdicao || "",
          base_legal: data.base_legal || "",
          tags: data.tags || "",
        });
      } catch (error) {
        alert("Erro ao carregar dados.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    loadModelo();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (file) data.append("pdf_referencia", file);

      await api.put(`/modelos/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Alterações salvas com sucesso!");
      navigate(`/modelo/${id}`);
    } catch (error) {
      alert("Erro ao atualizar o modelo.");
    }
  };

  if (loading)
    return (
      <div className="ml-44 pt-24 p-10 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );

  return (
    <div className="ml-44 pt-24 p-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-200">
        <div className="mb-10 border-b pb-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Editar Modelo
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Atualize as informações do acervo da CW Advocacia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                Título da Peça
              </label>
              <input
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                Substituir PDF (Opcional)
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                Categoria
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold"
              >
                <option>Contratos</option>
                <option>Petições</option>
                <option>Recursos</option>
                <option>Pareceres</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                Complexidade
              </label>
              <select
                name="complexidade"
                value={formData.complexidade}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold"
              >
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 bg-amber-50/50 p-2 rounded-2xl border border-amber-100">
              <label className="text-[10px] font-black uppercase text-amber-600 px-2">
                Data da Audiência
              </label>
              <input
                type="date"
                name="data_audiencia"
                value={formData.data_audiencia}
                onChange={handleChange}
                className="bg-transparent p-2 outline-none font-bold text-slate-700"
              />
            </div>
            <div className="flex flex-col gap-2 bg-amber-50/50 p-2 rounded-2xl border border-amber-100">
              <label className="text-[10px] font-black uppercase text-amber-600 px-2">
                Hora da Audiência
              </label>
              <input
                type="time"
                name="hora_audiencia"
                value={formData.hora_audiencia}
                onChange={handleChange}
                className="bg-transparent p-2 outline-none font-bold text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                Jurisdição
              </label>
              <input
                name="jurisdicao"
                value={formData.jurisdicao}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                Base Legal
              </label>
              <input
                name="base_legal"
                value={formData.base_legal}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                Tags
              </label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="separadas por vírgula"
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <div className="flex justify-between items-end mb-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                Conteúdo da Peça
              </label>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full uppercase">
                Dica: Use {"{{variavel}}"} para automação
              </span>
            </div>
            <LegalEditor
              value={formData.conteudo}
              onChange={(content) =>
                setFormData({ ...formData, conteudo: content })
              }
            />
          </div>

          <div className="flex justify-end gap-6 pt-10 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(`/modelo/${id}`)}
              className="px-8 py-3 font-bold text-slate-400 hover:text-slate-600 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#0e1e3f] text-white px-12 py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all active:scale-95"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModel;
