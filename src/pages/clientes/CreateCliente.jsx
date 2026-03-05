import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { mascaraCPFouCNPJ, mascaraTelefone, mascaraCEP } from "../../utils/masks";
import { validarCPFouCNPJ, validarEmail, validarCEP } from "../../utils/validators";
import { toast } from "../../components/Toast";
import { MESSAGES, STYLES } from "../../utils/constants";
import { LABELS } from "../../utils/labels";

const CreateCliente = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome_completo: "", cpf_cnpj: "", rg: "", 
    estado_civil: "", profissao: "", nacionalidade: "Brasileiro(a)",
    email: "", telefone: "", cep: "", logradouro: "", 
    numero: "", complemento: "", bairro: "", cidade: "", estado: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = MESSAGES.CONFIRM.SAIR_SEM_SALVAR;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

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
    
    setLoading(true);
    try {
      await api.post("/clientes", { 
        ...form, 
        endereco_completo: enderecoFormatado 
      });
      toast.success(MESSAGES.SUCCESS.CLIENTE_CADASTRADO);
      setHasChanges(false);
      setTimeout(() => navigate("/clientes"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || MESSAGES.ERROR.CLIENTE_SALVAR);
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (field) => errors[field] ? STYLES.INPUT_ERROR : STYLES.INPUT;

  return (
    <div className=" bg-slate-50 min-h-screen">
      <div className="max-w-6xl ml-10">
        <header className="mb-10 flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Novo Cadastro</h1>
            <p className="text-slate-500 font-medium italic">Qualificação completa para a base da CW Advocacia</p>
          </div>
          <button onClick={() => navigate("/clientes")} className="text-slate-400 hover:text-slate-800 font-bold text-sm underline">
            CANCELAR E VOLTAR
          </button>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          
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
            <p className={STYLES.HELPER}>{LABELS.HELPER_NOME}</p>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.CPF_CNPJ} <span className="text-red-500">{LABELS.OBRIGATORIO}</span></label>
            <input 
              className={getInputStyle("cpf_cnpj")} 
              placeholder={LABELS.PLACEHOLDER_CPF} 
              value={form.cpf_cnpj} 
              onChange={e => handleChange("cpf_cnpj", mascaraCPFouCNPJ(e.target.value))} 
              onBlur={() => handleBlur("cpf_cnpj")}
              required 
            />
            {errors.cpf_cnpj ? (
              <p className={STYLES.ERROR_TEXT}>{errors.cpf_cnpj}</p>
            ) : (
              <p className={STYLES.HELPER}>{LABELS.HELPER_CPF}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.RG}</label>
            <input 
              className={getInputStyle("rg")} 
              placeholder={LABELS.PLACEHOLDER_RG} 
              value={form.rg} 
              onChange={e => handleChange("rg", e.target.value)} 
            />
            <p className={STYLES.HELPER}>{LABELS.HELPER_RG}</p>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.ESTADO_CIVIL}</label>
            <select 
              className={getInputStyle("estado_civil")} 
              value={form.estado_civil} 
              onChange={e => handleChange("estado_civil", e.target.value)}
            >
              <option value="">{LABELS.PLACEHOLDER_SELECIONE}</option>
              <option value="Solteiro(a)">{LABELS.SOLTEIRO}</option>
              <option value="Casado(a)">{LABELS.CASADO}</option>
              <option value="Divorciado(a)">{LABELS.DIVORCIADO}</option>
              <option value="Viúvo(a)">{LABELS.VIUVO}</option>
              <option value="União Estável">{LABELS.UNIAO_ESTAVEL}</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.PROFISSAO}</label>
            <input 
              className={getInputStyle("profissao")} 
              placeholder={LABELS.PLACEHOLDER_PROFISSAO} 
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
            <label className={STYLES.LABEL}>{LABELS.TELEFONE} <span className="text-red-500">{LABELS.OBRIGATORIO}</span></label>
            <input 
              className={getInputStyle("telefone")} 
              placeholder={LABELS.PLACEHOLDER_TELEFONE} 
              value={form.telefone} 
              onChange={e => handleChange("telefone", mascaraTelefone(e.target.value))} 
              required 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.EMAIL}</label>
            <input 
              className={getInputStyle("email")} 
              type="email" 
              placeholder={LABELS.PLACEHOLDER_EMAIL} 
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
            <label className={STYLES.LABEL}>{LABELS.CEP} <span className="text-red-500">{LABELS.OBRIGATORIO}</span></label>
            <div className="relative">
              <input 
                className={`${getInputStyle("cep")} border-amber-200 bg-amber-50/30`} 
                placeholder={LABELS.PLACEHOLDER_CEP} 
                value={form.cep} 
                onBlur={handleCepBlur} 
                onChange={e => handleChange("cep", mascaraCEP(e.target.value))} 
                disabled={buscandoCep}
                required 
              />
              {buscandoCep && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500"></div>
                </div>
              )}
            </div>
            <p className="text-[10px] text-amber-600 ml-1 italic font-bold">{LABELS.HELPER_CEP}</p>
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
            <label className={STYLES.LABEL}>{LABELS.NUMERO} <span className="text-red-500">{LABELS.OBRIGATORIO}</span></label>
            <input 
              className={getInputStyle("numero")} 
              placeholder={LABELS.PLACEHOLDER_NUMERO} 
              value={form.numero} 
              onChange={e => handleChange("numero", e.target.value)} 
              required 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.COMPLEMENTO}</label>
            <input 
              className={getInputStyle("complemento")} 
              placeholder={LABELS.PLACEHOLDER_COMPLEMENTO} 
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
              className={`${STYLES.INPUT} bg-slate-100 cursor-not-allowed`} 
              value={form.cidade} 
              readOnly 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={STYLES.LABEL}>{LABELS.ESTADO}</label>
            <input 
              className={`${STYLES.INPUT} bg-slate-100 cursor-not-allowed`} 
              value={form.estado} 
              readOnly 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="md:col-span-3 bg-[#0e1e3f] text-white p-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            )}
            {loading ? "SALVANDO..." : "SALVAR CLIENTE NA BASE DA CW ADVOCACIA"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCliente;