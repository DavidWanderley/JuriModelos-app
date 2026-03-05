// Máscara para CPF ou CNPJ (detecta automaticamente)
export const mascaraCPFouCNPJ = (valor) => {
  const numeros = valor.replace(/\D/g, "");
  
  if (numeros.length <= 11) {
    // CPF: 000.000.000-00
    return numeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .substring(0, 14);
  } else {
    // CNPJ: 00.000.000/0000-00
    return numeros
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
      .substring(0, 18);
  }
};

// Máscara para telefone (celular ou fixo)
export const mascaraTelefone = (valor) => {
  const numeros = valor.replace(/\D/g, "");
  
  if (numeros.length <= 10) {
    // Fixo: (00) 0000-0000
    return numeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2")
      .substring(0, 14);
  } else {
    // Celular: (00) 00000-0000
    return numeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
      .substring(0, 15);
  }
};

// Máscara para CEP
export const mascaraCEP = (valor) => {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 9);
};

// Remove máscara (retorna apenas números)
export const removerMascara = (valor) => {
  return valor.replace(/\D/g, "");
};
