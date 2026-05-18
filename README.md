# JuriModelos — Interface Web

Plataforma administrativa da **CW Advocacia** para gestão de modelos jurídicos, clientes, agenda e geração automatizada de documentos.

---

## ⚠️ Requisito Obrigatório

Este projeto **não funciona de forma isolada**. Ele depende da **JuriModelos API** (backend) para autenticação, persistência de dados e geração de documentos.

Repositório do backend: [JuriModelos-api](../JuriModelos-api)

Certifique-se de que a API está rodando antes de iniciar o frontend.

---

## 🚀 Tecnologias

| Tecnologia | Uso |
|---|---|
| **React 19 + Vite** | Base da interface SPA |
| **Tailwind CSS 4** | Estilização e design system |
| **Axios** | Comunicação HTTP com a API |
| **React Router Dom v7** | Navegação e proteção de rotas privadas |
| **Lucide React** | Ícones vetoriais |
| **ViaCEP API** | Preenchimento automático de endereço por CEP |

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com e-mail e senha
- Proteção de rotas privadas via JWT
- Renovação automática de token
- Recuperação de senha por e-mail
- Logout com limpeza de sessão

### 👥 Gestão de Clientes
- Cadastro completo com dados pessoais e endereço
- Busca automática de endereço via CEP (ViaCEP)
- Máscaras nativas para CPF, CNPJ, Telefone e CEP
- Validação de CPF/CNPJ e e-mail em tempo real
- Edição e exclusão de clientes
- Listagem com ações rápidas de editar e excluir

### 📋 Biblioteca de Modelos
- Listagem com filtros por categoria e complexidade
- Busca por título
- Criação e edição de modelos jurídicos
- Upload de PDF de referência
- Campos para data e hora de audiência vinculados à agenda

### ⚙️ Templates de Automação
- Criação de templates com variáveis dinâmicas `{{variavel}}`
- Listagem e edição de templates
- Visualização detalhada antes de usar

### 📄 Geração de Documentos
- Preenchimento automático de variáveis a partir do cliente selecionado (Smart Fill)
- Previsualização HTML do documento antes de exportar
- Exportação em formato `.docx`
- Vínculo do documento gerado ao cliente cadastrado
- Histórico de todos os documentos gerados com link para o cliente

### 📅 Agenda Jurídica
- Calendário mensal com navegação entre meses
- Cores diferentes por tipo de evento (Audiência, Prazo, Reunião, Atendimento, Protocolo)
- Clique no dia para visualizar todos os eventos
- Criação, edição e exclusão de eventos diretamente na agenda
- Eventos de modelos (data de audiência) aparecem automaticamente na agenda
- Integração com o dashboard da Home

### 🏠 Dashboard (Home)
- Cards de estatísticas: total de clientes, documentos gerados e modelos disponíveis
- Atualização automática ao retornar para a aba
- Próximas audiências (agenda + modelos)
- Compromissos e prazos pendentes do mês
- Acesso rápido às principais seções

### 🔔 Notificações
- Sino no header com eventos de hoje e amanhã
- Badge com contador de notificações não visualizadas
- Notificações de eventos da agenda e audiências de modelos
- Link direto para a agenda

### 📂 Histórico de Documentos
- Listagem de todos os documentos gerados
- Cliente vinculado exibido como link clicável para o perfil
- Download do arquivo `.docx` gerado

---

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis (Header, Sidebar, Layout, Toast...)
├── hooks/            # Hooks customizados (useFetch)
├── pages/
│   ├── agenda/       # Agenda jurídica
│   ├── clientes/     # Gestão de clientes
│   ├── historico/    # Histórico de documentos
│   ├── home/         # Dashboard
│   ├── modelos/      # Biblioteca de modelos
│   ├── publicas/     # Login, Cadastro, Recuperação de senha
│   └── templates/    # Templates e geração de documentos
├── routers/          # Definição de rotas e proteção de acesso
├── services/         # Instância do Axios e serviço de storage
└── utils/            # Constantes, labels, máscaras e validadores
```

---

## 🛠️ Instalação e Execução

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd jurimodelos-app
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Inicie o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`.

---

## 🏗️ Build para Produção

```bash
npm run build
```

Os arquivos gerados estarão na pasta `dist/`. O projeto está configurado para deploy na **Vercel**.

---

## 🔗 Dependência do Backend

Todas as funcionalidades abaixo **requerem a JuriModelos API ativa**:

- Autenticação e controle de acesso
- Gestão de clientes, modelos e templates
- Geração e armazenamento de documentos
- Agenda e eventos
- Notificações por e-mail
- Estatísticas do dashboard

Sem o backend, o sistema redirecionará para a tela de login e não será possível acessar nenhuma funcionalidade.

---

© 2026 CW Advocacia · JuriModelos
