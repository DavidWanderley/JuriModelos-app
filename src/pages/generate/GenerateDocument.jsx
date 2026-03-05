import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const GenerateDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modelo, setModelo] = useState(null);
  const [variaveis, setVariaveis] = useState([]);
  const [valores, setValores] = useState({});
  const [documentoGerado, setDocumentoGerado] = useState("");
  const [loading, setLoading] = useState(true);
  const [listaClientes, setListaClientes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseModelo = await api.get(`/modelos/${id}`);
        const data = responseModelo.data;
        setModelo(data);

        const regex = /{{(.*?)}}/g;
        const matches = [...data.conteudo.matchAll(regex)].map((m) => m[1]);
        const variaveisUnicas = [...new Set(matches)];
        setVariaveis(variaveisUnicas);

        const initialValues = {};
        variaveisUnicas.forEach((v) => (initialValues[v] = ""));
        setValores(initialValues);

        const responseClientes = await api.get("/clientes");
        setListaClientes(responseClientes.data);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar dados para geração.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleInputChange = (variavel, valor) => {
    setValores({ ...valores, [variavel]: valor });
  };

  const handleAutoPreencher = (clienteId) => {
    if (!clienteId) return;
    const cliente = listaClientes.find((c) => c.id === parseInt(clienteId));
    if (!cliente) return;

  const mapaDeDados = {
    "nome_cliente": cliente.nome_completo,
    "nome": cliente.nome_completo,
    "nacionalidade": cliente.nacionalidade || "brasileiro(a)",
    "estado_civil": cliente.estado_civil,
    "profissao": cliente.profissao,
    "rg": cliente.rg,
    "cpf": cliente.cpf_cnpj, 
    "cpf_cnpj": cliente.cpf_cnpj,
    "email": cliente.email,
    "telefone": cliente.telefone,
    
    "cidade": cliente.cidade,      
    "estado": cliente.estado,      
    "uf": cliente.estado,          
    "cep": cliente.cep,
    "bairro": cliente.bairro,
    "logradouro": cliente.logradouro,
    "numero": cliente.numero,
    "endereco_completo": cliente.endereco_completo,
    "endereco": cliente.endereco_completo
  };

    const novosValores = { ...valores };

    variaveis.forEach((v) => {
      if (mapaDeDados[v.toLowerCase()]) {
        novosValores[v] = mapaDeDados[v.toLowerCase()];
      }
    });

    setValores(novosValores);
    alert(`Dados de ${cliente.nome_completo} aplicados!`);
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

  const exportarParaWord = async () => {
    if (!documentoGerado) return;

    try {
      const nomeIdentificado = valores.nome_cliente || valores.nome || "";

      const response = await api.post("/documentos/salvar", {
        nome_cliente: nomeIdentificado,
        conteudo_final: documentoGerado,
        modelo_titulo: modelo.titulo,
      });

      const { downloadUrl } = response.data;
      const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const fullDownloadUrl = downloadUrl.startsWith('http') ? downloadUrl : `${baseURL}${downloadUrl}`;

      const link = document.createElement("a");
      link.href = fullDownloadUrl;
      link.setAttribute(
        "download",
        `Peticao_${nomeIdentificado || "Gerada"}.docx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert("Documento gerado e arquivado no histórico da CW Advocacia!");
    } catch (error) {
      console.error(error);
      alert("Erro ao processar no servidor. O arquivo não pôde ser gerado.");
    }
  };

  if (loading)
    return (
      <div className="font-bold text-slate-500">
        Analisando variáveis jurídicas...
      </div>
    );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-5xl ml-10">
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

      <div className="max-w-5xl ml-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 h-fit">
          <header className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Gerar Documento
            </h1>
            <p className="text-slate-500 font-medium italic">{modelo.titulo}</p>
          </header>

          <form onSubmit={processarDocumento} className="space-y-6">

            <div className="mb-6 p-5 bg-amber-50 rounded-3xl border border-amber-200">
              <label className="text-[10px] font-black uppercase text-amber-700 tracking-widest block mb-2">
                👤 BUSCAR CLIENTE CADASTRADO
              </label>
              <select
                onChange={(e) => handleAutoPreencher(e.target.value)}
                className="w-full p-3 bg-white border border-amber-300 rounded-xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-amber-500"
              >
                <option value="">
                  Selecione para preencher automaticamente...
                </option>
                {listaClientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome_completo} ({c.cpf_cnpj})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-amber-600 mt-2 italic">
                * Isso preencherá os campos correspondentes automaticamente.
              </p>
            </div>

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
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = documentoGerado;
                    navigator.clipboard.writeText(tempDiv.innerText);
                    alert("Texto puro copiado para a área de transferência!");
                  }}
                  className="text-amber-600 font-bold text-xs hover:underline"
                >
                  COPIAR TEXTO
                </button>
              )}
            </div>

            <div className="font-serif text-lg leading-relaxed text-slate-700 flex-1">
              {documentoGerado ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: documentoGerado }}
                />
              ) : (
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
                {documentoGerado
                  ? "BAIXAR EM WORD (.DOCX)"
                  : "GERE O DOCUMENTO PRIMEIRO"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateDocument;
