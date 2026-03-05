
const KEYS = {
  TOKEN: "token",
  USER: "user",
  NOME: "nome",
  PERFIL: "perfil",
};

export const storage = {
  getToken: () => localStorage.getItem(KEYS.TOKEN),
  setToken: (token) => localStorage.setItem(KEYS.TOKEN, token),
  removeToken: () => localStorage.removeItem(KEYS.TOKEN),

  getUser: () => {
    try {
      const user = localStorage.getItem(KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(KEYS.USER),

  getNome: () => localStorage.getItem(KEYS.NOME),
  setNome: (nome) => localStorage.setItem(KEYS.NOME, nome),
  removeNome: () => localStorage.removeItem(KEYS.NOME),

  getPerfil: () => localStorage.getItem(KEYS.PERFIL),
  setPerfil: (perfil) => localStorage.setItem(KEYS.PERFIL, perfil),
  removePerfil: () => localStorage.removeItem(KEYS.PERFIL),

  clear: () => {
    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.NOME);
    localStorage.removeItem(KEYS.PERFIL);
  },

  isAuthenticated: () => {
    const token = storage.getToken();
    return token !== null && token !== "" && token !== "undefined";
  },
};
