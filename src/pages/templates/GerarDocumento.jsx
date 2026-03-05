import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "../../components/Toast";
import { MESSAGES } from "../../utils/constants";
import Loading from "../../components/Loading";
import BackButton from "../../components/BackButton";

export default function GerarDocumento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [variaveis, setVariaveis] = useState([]);
  const [valores, setValores] = useState({});
  const [documentoGerado, setDocumentoGerado] = useState("");
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTemplate, resClientes] = await Promise.all([
          api.get(`/templates/${id}`),
          api.get("/clientes")
        ]);

        setTemplate(resTemplate.data);
        setClientes(resClientes.data);

        const regex = /{{(.*?)}}/g;
        const matches = [...resTemplate.data.conteudo.matchAll(regex)].map((m) => m[1]);
        const variaveisUnicas = [...new Set(matches)];
        setVariaveis(variaveisUnicas);

        const initialValues = {};
        variaveisUnicas.forEach((v) => (initialValues[v] = ""));
        setValores(initialValues);
      } catch (error) {
        console.error(error);
        toast.error(MESSAGES.ERROR.TEMPLATE_CARREGAR);
        navigate("/templates");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleAutoPreencher = (clienteId) => {
    if (!clienteId) return;
    const cliente = clientes.find((c) => c.id === parseInt(clienteId));
    if (!cliente) return;

    const mapa = {
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
      if (mapa[v.toLowerCase()]) {
        novosValores[v] = mapa[v.toLowerCase()];
      }
    });

    setValores(novosValores);
    toast.success(`Dados de ${cliente.nome_completo} aplicados!`);
  };

  const processarDocumento = (e) => {
    e.preventDefault();
    let textoFinal = template.conteudo;

    Object.keys(valores).forEach((chave) => {
      const regex = new RegExp(`{{${chave}}}`, "g");
      textoFinal = textoFinal.replace(regex, valores[chave] || `[${chave}]`);
    });

    setDocumentoGerado(textoFinal);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const exportarParaWord = async () => {
    if (!documentoGerado) return;

    setExporting(true);
    try {
      const nomeIdentificado = valores.nome_cliente || valores.nome || "";

      const response = await api.post("/documentos/salvar", {
        nome_cliente: nomeIdentificado,
        conteudo_final: documentoGerado,
        modelo_titulo: template.titulo,
      });

      const { downloadUrl } = response.data;
      const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const fullDownloadUrl = downloadUrl.startsWith('http') ? downloadUrl : `${baseURL}${downloadUrl}`;

      const link = document.createElement("a");
      link.href = fullDownloadUrl;
      link.setAttribute("download", `Peticao_${nomeIdentificado || "Gerada"}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(MESSAGES.SUCCESS.DOCUMENTO_GERADO);
    } catch (error) {
      console.error(error);
      toast.error(MESSAGES.ERROR.DOCUMENTO_GERAR);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <Loading message="Carregando template..." />;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-5xl ml-10">
        <BackButton to={`/template/${id}`} label="Voltar para Template" />
      </div>

      <div className="max-w-5xl ml-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 h-fit">
          <header className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gerar Documento</h1>
            <p className="text-slate-500 font-medium italic">{template.titulo}</p>
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
                <option value="">Selecione para preencher automaticamente...</option>
                {clientes.map((c) => (
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
                    onChange={(e) => setValores({ ...valores, [v]: e.target.value })}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-700 transition-all"
                  />
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic">Nenhuma variável encontrada neste template.</p>
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
                    toast.success(MESSAGES.SUCCESS.TEXTO_COPIADO);
                  }}
                  className="text-amber-600 font-bold text-xs hover:underline"
                >
                  COPIAR TEXTO
                </button>
              )}
            </div>

            <div className="font-serif text-lg leading-relaxed text-slate-700 flex-1">
              {documentoGerado ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: documentoGerado }} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <span className="text-6xl mb-4">✍️</span>
                  <p className="font-sans font-bold">
                    Preencha os campos ao lado e clique em "Mesclar Dados"
                  </p>
                </div>
              )}
            </div>

            {documentoGerado && (
              <button
                onClick={exportarParaWord}
                disabled={exporting}
                className="mt-6 w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {exporting && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                )}
                {exporting ? "GERANDO..." : "📥 BAIXAR DOCUMENTO (.DOCX)"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
