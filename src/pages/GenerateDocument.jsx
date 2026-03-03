import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

const GenerateDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modelo, setModelo] = useState(null);
  const [variaveis, setVariaveis] = useState([]);
  const [valores, setValores] = useState({});
  const [documentoGerado, setDocumentoGerado] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModelo = async () => {
      try {
        const response = await api.get(`/modelos/${id}`);
        const data = response.data;
        setModelo(data);

        const regex = /{{(.*?)}}/g;
        const matches = [...data.conteudo.matchAll(regex)].map((m) => m[1]);

        const variaveisUnicas = [...new Set(matches)];
        setVariaveis(variaveisUnicas);

        const initialValues = {};
        variaveisUnicas.forEach((v) => (initialValues[v] = ""));
        setValores(initialValues);
      } catch (error) {
        alert("Erro ao carregar modelo para geração.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchModelo();
  }, [id, navigate]);

  const handleInputChange = (variavel, valor) => {
    setValores({ ...valores, [variavel]: valor });
  };

  const processarDocumento = (e) => {
    e.preventDefault();
    let textoFinal = modelo.conteudo;

    Object.keys(valores).forEach((chave) => {
      const regex = new RegExp(`{{${chave}}}`, "g");
      textoFinal = textoFinal.replace(regex, valores[chave] || `[${chave}]`);
    });

    setDocumentoGerado(textoFinal);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const exportarParaWord = () => {
    if (!documentoGerado) return;

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1701,
                right: 1134,
                bottom: 1134,
                left: 1701,
              },
            },
          },
          children: documentoGerado.split("\n").map((linha) => {
            return new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { line: 360 },
              children: [
                new TextRun({
                  text: linha,
                  font: "Arial",
                  size: 24,
                }),
              ],
            });
          }),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const nomeArquivo = `Peticao_${modelo.titulo.replace(/\s+/g, "_")}.docx`;
      saveAs(blob, nomeArquivo);
    });
  };

  if (loading)
    return (
      <div className="ml-44 pt-24 p-10 font-bold text-slate-500">
        Analisando variáveis jurídicas...
      </div>
    );

  return (
    <div className="ml-44 pt-24 p-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => navigate(`/modelo/${id}`)}
          className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 transition-all group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Voltar para a Peça Base
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 h-fit">
          <header className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Gerar Documento
            </h1>
            <p className="text-slate-500 font-medium italic">{modelo.titulo}</p>
          </header>

          <form onSubmit={processarDocumento} className="space-y-6">
            {variaveis.length > 0 ? (
              variaveis.map((v) => (
                <div key={v} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-amber-600 tracking-widest">
                    {v.replace("_", " ")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`Preencha o campo ${v}`}
                    value={valores[v]}
                    onChange={(e) => handleInputChange(v, e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-700 transition-all"
                  />
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic">
                Nenhuma variável encontrada neste modelo.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#0e1e3f] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              MESCLAR DADOS
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="font-black text-slate-400 uppercase text-xs tracking-widest">
                Visualização da Peça
              </h2>
              {documentoGerado && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(documentoGerado);
                    alert("Copiado para a área de transferência!");
                  }}
                  className="text-amber-600 font-bold text-xs hover:underline"
                >
                  COPIAR TEXTO
                </button>
              )}
            </div>

            <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-700 flex-1">
              {documentoGerado || (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <span className="text-6xl mb-4">✍️</span>
                  <p className="font-sans font-bold">
                    Preencha os campos ao lado e clique em "Mesclar Dados" para
                    visualizar o documento.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={exportarParaWord}
                disabled={!documentoGerado}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all shadow-lg ${
                  !documentoGerado
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {documentoGerado ? "BAIXAR EM WORD (.DOCX)" : "GERE O DOCUMENTO PRIMEIRO"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateDocument;