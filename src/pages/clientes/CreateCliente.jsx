import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateCliente = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome_completo: "", cpf_cnpj: "", rg: "", 
    estado_civil: "", profissao: "", nacionalidade: "Brasileiro(a)",
    email: "", telefone: "", cep: "", logradouro: "", 
    numero: "", complemento: "", bairro: "", cidade: "", estado: ""
  });

  const mascaraCPF = (v) => v.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
  const mascaraTelefone = (v) => v.replace(/\D/g, "").replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3").substring(0, 15);
  const mascaraCEP = (v) => v.replace(/\D/g, "").replace(/^(\d{5})(\d{3}).*/, "$1-$2").substring(0, 9);

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setForm(prev => ({ 
          ...prev, 
          logradouro: data.logradouro || "", 
          bairro: data.bairro || "", 
          cidade: data.localidade || "", 
          estado: data.uf || "" 
        }));
      }
    } catch (err) { console.error("Erro CEP:", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enderecoFormatado = `${form.logradouro}, nº ${form.numero}${form.complemento ? `, ${form.complemento}` : ""}, ${form.bairro}, ${form.cidade}/${form.estado}, CEP: ${form.cep}`;
    
    try {
      await api.post("/clientes", { 
        ...form, 
        endereco_completo: enderecoFormatado 
      });
      alert("Cliente cadastrado com sucesso!");
      navigate("/clientes");
    } catch (err) { 
      alert("Erro ao salvar cliente."); 
    }
  };

  const inputStyle = "p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-700 transition-all text-left";
  const labelStyle = "text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wider";
  const helperStyle = "text-[10px] text-slate-400 ml-1 italic font-medium";

  return (
    <div className="ml-44 pt-24 p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
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
            <h2 className="text-amber-600 font-black text-xs uppercase tracking-widest">1. Informações Pessoais</h2>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>Nome Completo <span className="text-red-500">*</span></label>
            <input className={inputStyle} placeholder="Ex: João da Silva" value={form.nome_completo} onChange={e => setForm({...form, nome_completo: e.target.value})} required />
            <p className={helperStyle}>Nome para o cabeçalho da petição.</p>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>CPF / CNPJ <span className="text-red-500">*</span></label>
            <input className={inputStyle} placeholder="000.000.000-00" value={form.cpf_cnpj} onChange={e => setForm({...form, cpf_cnpj: mascaraCPF(e.target.value)})} required />
            <p className={helperStyle}>Documento principal da parte.</p>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>RG</label>
            <input className={inputStyle} placeholder="Número do RG" value={form.rg} onChange={e => setForm({...form, rg: e.target.value})} />
            <p className={helperStyle}>Registro Geral e Órgão Expedidor.</p>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>Estado Civil</label>
            <select className={inputStyle} value={form.estado_civil} onChange={e => setForm({...form, estado_civil: e.target.value})}>
              <option value="">Selecione...</option>
              <option value="Solteiro(a)">Solteiro(a)</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="Divorciado(a)">Divorciado(a)</option>
              <option value="Viúvo(a)">Viúvo(a)</option>
              <option value="União Estável">União Estável</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>Profissão</label>
            <input className={inputStyle} placeholder="Ex: Autônomo" value={form.profissao} onChange={e => setForm({...form, profissao: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>Nacionalidade</label>
            <input className={inputStyle} value={form.nacionalidade} onChange={e => setForm({...form, nacionalidade: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>Telefone / WhatsApp <span className="text-red-500">*</span></label>
            <input className={inputStyle} placeholder="(00) 00000-0000" value={form.telefone} onChange={e => setForm({...form, telefone: mascaraTelefone(e.target.value)})} required />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>E-mail</label>
            <input className={inputStyle} type="email" placeholder="cliente@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>

          <div className="md:col-span-3 border-b border-slate-100 pb-2 mt-4 text-left">
            <h2 className="text-amber-600 font-black text-xs uppercase tracking-widest">2. Endereço Residencial</h2>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>CEP <span className="text-red-500">*</span></label>
            <input className={`${inputStyle} border-amber-200 bg-amber-50/30`} placeholder="00000-000" value={form.cep} onBlur={handleCepBlur} onChange={e => setForm({...form, cep: mascaraCEP(e.target.value)})} required />
            <p className="text-[10px] text-amber-600 ml-1 italic font-bold">Busca automática ao sair do campo.</p>
          </div>

          <div className="flex flex-col gap-1 text-left md:col-span-2">
            <label className={labelStyle}>Logradouro (Rua/Avenida)</label>
            <input className={inputStyle} value={form.logradouro} onChange={e => setForm({...form, logradouro: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>Número <span className="text-red-500">*</span></label>
            <input className={inputStyle} placeholder="Ex: 123" value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>Complemento</label>
            <input className={inputStyle} placeholder="Apto, Casa 2..." value={form.complemento} onChange={e => setForm({...form, complemento: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>Bairro</label>
            <input className={inputStyle} value={form.bairro} onChange={e => setForm({...form, bairro: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>Cidade</label>
            <input className={`${inputStyle} bg-slate-100 cursor-not-allowed`} value={form.cidade} readOnly />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className={labelStyle}>Estado (UF)</label>
            <input className={`${inputStyle} bg-slate-100 cursor-not-allowed`} value={form.estado} readOnly />
          </div>

          <button type="submit" className="md:col-span-3 bg-[#0e1e3f] text-white p-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95 mt-4">
            SALVAR CLIENTE NA BASE DA CW ADVOCACIA
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCliente;