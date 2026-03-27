export const API_TIMEOUT = 30000;

export const CATEGORIAS = [
  "Petições",
  "Contratos",
  "Recursos",
  "Pareceres",
  "Outros",
];

export const MESSAGES = {
  SUCCESS: {
    CLIENTE_CADASTRADO: "Cliente cadastrado com sucesso!",
    CLIENTE_ATUALIZADO: "Cliente atualizado com sucesso!",
    TEMPLATE_CRIADO: "Template criado com sucesso!",
    TEMPLATE_ATUALIZADO: "Template atualizado com sucesso!",
    TEMPLATE_DELETADO: "Template removido com sucesso!",
    MODELO_CRIADO: "Modelo cadastrado com sucesso!",
    MODELO_DELETADO: "Modelo removido com sucesso!",
    DOCUMENTO_GERADO: "Documento gerado e arquivado no histórico!",
    DADOS_APLICADOS: "Dados aplicados com sucesso!",
    TEXTO_COPIADO: "Texto copiado para área de transferência!",
  },
  ERROR: {
    CLIENTE_SALVAR: "Erro ao salvar cliente. Verifique os dados e tente novamente.",
    CLIENTE_CARREGAR: "Erro ao carregar clientes.",
    TEMPLATE_CARREGAR: "Erro ao carregar template.",
    TEMPLATE_ATUALIZAR: "Erro ao atualizar template.",
    TEMPLATE_DELETAR: "Erro ao excluir template.",
    MODELO_CARREGAR: "Erro ao carregar modelo.",
    MODELO_DELETAR: "Erro ao excluir modelo.",
    DOCUMENTO_GERAR: "Erro ao gerar documento.",
    CEP_BUSCAR: "Erro ao buscar CEP. Verifique o número e tente novamente.",
    CEP_INVALIDO: "CEP não encontrado.",
    CPF_INVALIDO: "CPF inválido. Verifique o número digitado.",
    CNPJ_INVALIDO: "CNPJ inválido. Verifique o número digitado.",
    EMAIL_INVALIDO: "E-mail inválido.",
    CAMPOS_OBRIGATORIOS: "Preencha todos os campos obrigatórios.",
  },
  INFO: {
    CARREGANDO: "Carregando...",
    PROCESSANDO: "Processando...",
    BUSCANDO_CEP: "Buscando endereço...",
  },
  CONFIRM: {
    DELETAR_TEMPLATE: "⚠️ ATENÇÃO: Deseja excluir este template? Esta ação é irreversível.",
    DELETAR_MODELO: "⚠️ ATENÇÃO: Deseja excluir este modelo? Esta ação é irreversível.",
    SAIR_SEM_SALVAR: "Você tem alterações não salvas. Deseja realmente sair?",
  }
};

export const STYLES = {
  INPUT: "p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-700 transition-all text-left",
  INPUT_ERROR: "p-4 bg-red-50 rounded-2xl border-2 border-red-300 outline-none focus:ring-2 focus:ring-red-500 font-bold text-slate-700 transition-all text-left",
  LABEL: "text-[11px] font-bold text-slate-700 ml-1 uppercase tracking-wider",
  HELPER: "text-[10px] text-slate-400 ml-1 italic font-medium",
  ERROR_TEXT: "text-[10px] text-red-600 ml-1 font-bold",
  BUTTON_PRIMARY: "bg-[#0e1e3f] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-95",
  BUTTON_SECONDARY: "bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all",
  BUTTON_DANGER: "bg-white border border-rose-200 text-rose-600 px-6 py-2 rounded-xl font-bold hover:bg-rose-50 transition-all",
};

export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ONLY_NUMBERS: /\D/g,
};
