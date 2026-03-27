import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { mascaraCPFouCNPJ, mascaraTelefone, mascaraCEP } from "../../utils/masks";
import { validarCPFouCNPJ, validarEmail, validarCEP } from "../../utils/validators";
import { toast } from "../../components/Toast";
import { MESSAGES, STYLES } from "../../utils/constants";
import { LABELS } from "../../utils/labels";
import Loading from "../../components/Loading";

const EditCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome_completo: "", cpf_cnpj: "", rg: "", 
    estado_civil: "", profissao: "", nacionalidade: "Brasileiro(a)",
    email: "", telefone: "", cep: "", logradouro: "", 
    numero: "", complemento: "", bairro: "", cidade: "", estado: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        setForm(response.data);
      } catch (err) {
        toast.error("Erro ao carregar cliente");
        navigate("/clientes");
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [id, navigate]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setHasChanges(true);
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case "cpf_cnpj":
        if (value && !validarCPFouCNPJ(value)) {
          const numeros = value.replace(/\D/g, "");
          return numeros.length === 11 ? MESSAGES.ERROR.CPF_INVALIDO : MESSAGES.ERROR.CNPJ_INVALIDO;
        }
        break;
      case "email":
        if (value && !validarEmail(value)) {
          return MESSAGES.ERROR.EMAIL_INVALIDO;
        }
        break;
      case "cep":
        if (value && !validarCEP(value)) {
          return "CEP deve ter 8 dígitos";
        }
        break;
    }
    return "";
  };

  const handleBlur = (field) => {
    const error = validateField(field, form[field]);
    if (error) {
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;
    
    setBuscandoCep(true);
    try {
      const response = await api.get(`/buscar-cep/${cep}`);
      const data = response.data;
      
      if (data.logradouro) {
        setForm(prev => ({ 
          ...prev, 
          logradouro: data.logradouro || "", 
          bairro: data.bairro || "", 
          cidade: data.localidade || "", 
          estado: data.uf || "" 
        }));
        toast.success("Endereço encontrado!");
      } else {
        toast.error(MESSAGES.ERROR.CEP_INVALIDO);
      }
    } catch (err) {
      toast.error(MESSAGES.ERROR.CEP_BUSCAR);
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (form.cpf_cnpj) {
      const cpfError = validateField("cpf_cnpj", form.cpf_cnpj);
      if (cpfError) newErrors.cpf_cnpj = cpfError;
    }
    if (form.email) {
      const emailError = validateField("email", form.email);
      if (emailError) newErrors.email = emailError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(MESSAGES.ERROR.CAMPOS_OBRIGATORIOS);
      return;
    }

    const enderecoFormatado = `${form.logradouro}, nº ${form.numero}${form.complemento ? `, ${form.complemento}` : ""}, ${form.bairro}, ${form.cidade}/${form.estado}, CEP: ${form.cep}`;
    
    setSaving(true);
    try {
      await api.put(`/clientes/${id}`, { 
        ...form, 
        endereco_completo: enderecoFormatado 
      });
      toast.success("Cliente atualizado com sucesso!");
      setHasChanges(false);
      setTimeout(() => navigate("/clientes"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao atualizar cliente");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      await api.delete(`/clientes/${id}`);
      toast.success("Cliente excluído com sucesso!");
      navigate("/clientes");
    } catch (err) {
      toast.error("Erro ao excluir cliente");
    }
  };

  const getInputStyle = (field) => errors[field] ? STYLES.INPUT_ERROR : STYLES.INPUT;

  if (loading) return <Loading message="Carregando cliente..." />;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl ml-10">
        <header className="mb-10 flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Editar Cliente</h1>
            <p className="text-slate-500 font-medium italic">{form.nome_completo}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 font-bold text-sm underline"
            >
              EXCLUIR CLIENTE
            </button>
            <button 
              onClick={() => navigate("/clientes")} 
              className="text-slate-400 hover:text-slate-800 font-bold text-sm underline"
            >
              CANCELAR
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-3 border-b border-slate-100 pb-2 text-left">
            <h2 className="text-amber-600 font-black text-xs uppercase tracking-widest">{LABELS.SECAO_INFO_PESSOAIS}</h2>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.NOME_COMPLETO} <span className="text-red-500">{LABELS.OBRIGATORIO}</span></label>
            <input 
              className={getInputStyle("nome_completo")} 
              placeholder={LABELS.PLACEHOLDER_NOME} 
              value={form.nome_completo} 
              onChange={e => handleChange("nome_completo", e.target.value)} 
              required 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.CPF_CNPJ}</label>
            <input 
              className={getInputStyle("cpf_cnpj")} 
              value={form.cpf_cnpj} 
              onChange={e => handleChange("cpf_cnpj", mascaraCPFouCNPJ(e.target.value))} 
              onBlur={() => handleBlur("cpf_cnpj")}
            />
            {errors.cpf_cnpj && <p className={STYLES.ERROR_TEXT}>{errors.cpf_cnpj}</p>}
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.RG}</label>
            <input 
              className={getInputStyle("rg")} 
              value={form.rg} 
              onChange={e => handleChange("rg", e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.ESTADO_CIVIL}</label>
            <select 
              className={getInputStyle("estado_civil")} 
              value={form.estado_civil} 
              onChange={e => handleChange("estado_civil", e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="Solteiro(a)">Solteiro(a)</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="Divorciado(a)">Divorciado(a)</option>
              <option value="Viúvo(a)">Viúvo(a)</option>
              <option value="União Estável">União Estável</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.PROFISSAO}</label>
            <input 
              className={getInputStyle("profissao")} 
              value={form.profissao} 
              onChange={e => handleChange("profissao", e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.NACIONALIDADE}</label>
            <input 
              className={getInputStyle("nacionalidade")} 
              value={form.nacionalidade} 
              onChange={e => handleChange("nacionalidade", e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.TELEFONE}</label>
            <input 
              className={getInputStyle("telefone")} 
              value={form.telefone} 
              onChange={e => handleChange("telefone", mascaraTelefone(e.target.value))} 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.EMAIL}</label>
            <input 
              className={getInputStyle("email")} 
              type="email" 
              value={form.email} 
              onChange={e => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
            />
            {errors.email && <p className={STYLES.ERROR_TEXT}>{errors.email}</p>}
          </div>

          <div className="md:col-span-3 border-b border-slate-100 pb-2 mt-4 text-left">
            <h2 className="text-amber-600 font-black text-xs uppercase tracking-widest">{LABELS.SECAO_ENDERECO}</h2>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.CEP}</label>
            <input 
              className={getInputStyle("cep")} 
              value={form.cep} 
              onBlur={handleCepBlur} 
              onChange={e => handleChange("cep", mascaraCEP(e.target.value))} 
              disabled={buscandoCep}
            />
          </div>

          <div className="flex flex-col gap-1 text-left md:col-span-2">
            <label className={STYLES.LABEL}>{LABELS.LOGRADOURO}</label>
            <input 
              className={getInputStyle("logradouro")} 
              value={form.logradouro} 
              onChange={e => handleChange("logradouro", e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.NUMERO}</label>
            <input 
              className={getInputStyle("numero")} 
              value={form.numero} 
              onChange={e => handleChange("numero", e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.COMPLEMENTO}</label>
            <input 
              className={getInputStyle("complemento")} 
              value={form.complemento} 
              onChange={e => handleChange("complemento", e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.BAIRRO}</label>
            <input 
              className={getInputStyle("bairro")} 
              value={form.bairro} 
              onChange={e => handleChange("bairro", e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.CIDADE}</label>
            <input 
              className={STYLES.INPUT} 
              value={form.cidade} 
              onChange={e => handleChange("cidade", e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.ESTADO}</label>
            <input 
              className={STYLES.INPUT} 
              value={form.estado} 
              onChange={e => handleChange("estado", e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="md:col-span-3 bg-[#0e1e3f] text-white p-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95 mt-4 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {saving && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
            {saving ? "SALVANDO..." : "ATUALIZAR CLIENTE"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCliente;
