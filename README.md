# 🖥️ JuriModelos Web (Frontend)

Interface administrativa e editor inteligente.

## 🚀 Tecnologias e Ecossistema
* **React.js (Vite):** Biblioteca base para interface reativa e rápida.
* **Tailwind CSS:** Framework utilitário para estilização moderna e design system da CW Advocacia.
* **Axios:** Cliente HTTP para comunicação assíncrona com a API.
* **React Router Dom:** Gerenciamento de navegação SPA e proteção de rotas privadas.
* **Lucide React:** Conjunto de ícones vetoriais para sinalização de interface.
* **ViaCEP API:** Integração externa para consulta e preenchimento automatizado de endereços.
* **Regular Expressions (Regex):** Motor de busca e captura de chaves dinâmicas `{{...}}` e validação de máscaras.

## ✨ Funcionalidades Implementadas
* **Gestão de Clientes:** Cadastro detalhado com abas separadas para Listagem e Criação.
* **Smart Fill (Preenchimento Inteligente):** Algoritmo que traduz dados do banco de dados para campos de qualificação em tempo real.
* **Integração ViaCEP:** Busca automática de logradouro, bairro, cidade e estado a partir do CEP.
* **Sistema de Máscaras Nativas:** Formatação dinâmica para CPF, CNPJ, Telefone e CEP sem dependências de terceiros, garantindo compatibilidade com React 18+.
* **Renderização de PDF Dinâmica:** Visualização condicional de referências em PDF, evitando links quebrados (tratamento de erros 404 e caminhos nulos).
* **Previsualização HTML:** Suporte para visualização de documentos com formatação rich-text antes da geração final.

## 📁 Organização do Projeto
* `/src/pages`: Páginas da aplicação (`Clientes.jsx`, `CreateCliente.jsx`, `GenerateDocument.jsx`).
* `/src/services`: Configuração da instância do Axios e endpoints da API.
* `/src/components`: Elementos reutilizáveis como `Sidebar` e `PrivateRoute`.
* `/src/routes`: Centralização de rotas e segurança de acesso.

## 🛠️ Instalação e Execução
1.  Acesse a pasta do projeto: `cd JuriModelos-web`
2.  Instale as dependências: `npm install`
3.  Inicie o projeto: `npm run dev`

## ⚠️ Requisito Obrigatório
Este projeto **não funciona isoladamente**. Ele depende da **JuriModelos API** ativa para autenticação e persistência de dados.
