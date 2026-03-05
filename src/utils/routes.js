
export const ROUTES = {
  // Públicas
  LOGIN: "/login",
  SIGNUP: "/criar-conta",
  FORGOT_PASSWORD: "/esqueci-a-senha",
  RESET_PASSWORD: (token) => `/reset-password/${token}`,

  // Home
  HOME: "/",

  // Clientes
  CLIENTES: "/clientes",
  CLIENTES_NOVO: "/clientes/novo",

  // Templates
  TEMPLATES: "/templates",
  TEMPLATE_NOVO: "/novo-template",
  TEMPLATE_DETALHES: (id) => `/template/${id}`,
  TEMPLATE_EDITAR: (id) => `/editar-template/${id}`,

  // Modelos
  MODELOS: "/modelos",
  MODELO_NOVO: "/novo-modelo",
  MODELO_DETALHES: (id) => `/modelo/${id}`,
  MODELO_EDITAR: (id) => `/editar-modelo/${id}`,

  // Documentos
  GERAR_DOCUMENTO: (id) => `/gerar-documento/${id}`,

  // Outros
  HISTORICO: "/historico",
  AGENDA: "/agenda",
};
