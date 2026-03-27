
export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/criar-conta",
  FORGOT_PASSWORD: "/esqueci-a-senha",
  RESET_PASSWORD: (token) => `/reset-password/${token}`,

  HOME: "/",

  CLIENTES: "/clientes",
  CLIENTES_NOVO: "/clientes/novo",

  TEMPLATES: "/templates",
  TEMPLATE_NOVO: "/novo-template",
  TEMPLATE_DETALHES: (id) => `/template/${id}`,
  TEMPLATE_EDITAR: (id) => `/editar-template/${id}`,

  MODELOS: "/modelos",
  MODELO_NOVO: "/novo-modelo",
  MODELO_DETALHES: (id) => `/modelo/${id}`,
  MODELO_EDITAR: (id) => `/editar-modelo/${id}`,

  GERAR_DOCUMENTO: (id) => `/gerar-documento/${id}`,

  HISTORICO: "/historico",
  AGENDA: "/agenda",
};
