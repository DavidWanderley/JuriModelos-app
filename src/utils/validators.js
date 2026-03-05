// Validação de CPF
export const validarCPF = (cpf) => {
  const numeros = cpf.replace(/\D/g, "");
  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(numeros.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(numeros.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros.charAt(10))) return false;

  return true;
};

// Validação de CNPJ
export const validarCNPJ = (cnpj) => {
  const numeros = cnpj.replace(/\D/g, "");
  if (numeros.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(numeros)) return false;

  let tamanho = numeros.length - 2;
  let numeros_cnpj = numeros.substring(0, tamanho);
  const digitos = numeros.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros_cnpj.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros_cnpj = numeros.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros_cnpj.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
};

// Validação de CPF ou CNPJ
export const validarCPFouCNPJ = (valor) => {
  const numeros = valor.replace(/\D/g, "");
  if (numeros.length === 11) return validarCPF(valor);
  if (numeros.length === 14) return validarCNPJ(valor);
  return false;
};

// Validação de email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validação de CEP
export const validarCEP = (cep) => {
  const numeros = cep.replace(/\D/g, "");
  return numeros.length === 8;
};

// Validação de senha forte
export const validarSenhaForte = (senha) => {
  // Mínimo 8 caracteres
  if (senha.length < 8) {
    return { valida: false, mensagem: "A senha deve ter no mínimo 8 caracteres" };
  }

  // Pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(senha)) {
    return { valida: false, mensagem: "A senha deve conter pelo menos uma letra maiúscula" };
  }

  // Pelo menos uma letra minúscula
  if (!/[a-z]/.test(senha)) {
    return { valida: false, mensagem: "A senha deve conter pelo menos uma letra minúscula" };
  }

  // Pelo menos um número
  if (!/[0-9]/.test(senha)) {
    return { valida: false, mensagem: "A senha deve conter pelo menos um número" };
  }

  // Pelo menos um caractere especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
    return { valida: false, mensagem: "A senha deve conter pelo menos um caractere especial (!@#$%...)" };
  }

  return { valida: true, mensagem: "Senha forte" };
};

// Calcular força da senha (0-100)
export const calcularForcaSenha = (senha) => {
  let forca = 0;

  if (senha.length >= 8) forca += 20;
  if (senha.length >= 12) forca += 10;
  if (/[a-z]/.test(senha)) forca += 15;
  if (/[A-Z]/.test(senha)) forca += 15;
  if (/[0-9]/.test(senha)) forca += 15;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(senha)) forca += 15;
  if (senha.length >= 16) forca += 10;

  return Math.min(forca, 100);
};
