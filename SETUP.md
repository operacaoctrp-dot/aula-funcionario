# 🚀 Sistema de Cadastro de Funcionários - Guia de Setup

Este guia contém as instruções necessárias para configurar e executar o sistema de cadastro de funcionários.

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- NPM ou Yarn
- Conta no Supabase

## ⚙️ Configuração do Ambiente

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais do Supabase:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_publica_do_supabase
```

**Exemplo:**

```env
SUPABASE_URL=https://xbbsbuwapgdxkkvcyhrr.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Configuração do Banco de Dados

No painel do Supabase, execute o seguinte comando SQL para criar a tabela de funcionários:

```sql
CREATE TABLE public.funcionarios (
  id SERIAL NOT NULL,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  endereco TEXT NULL,
  email TEXT NULL,
  salario NUMERIC(10, 2) NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT funcionarios_pkey PRIMARY KEY (id),
  CONSTRAINT funcionarios_email_key UNIQUE (email)
) TABLESPACE pg_default;
```

### 3. Instalação das Dependências

```bash
npm install
```

### 4. Executar o Projeto

Para desenvolvimento:

```bash
npm run dev
```

Para build de produção:

```bash
npm run build
```

## 🏗️ Estrutura da Tabela `funcionarios`

| Campo        | Tipo          | Descrição                             | Obrigatório     |
| ------------ | ------------- | ------------------------------------- | --------------- |
| `id`         | Serial        | Identificador único (auto-incremento) | ✅              |
| `nome`       | Text          | Nome completo do funcionário          | ✅              |
| `cargo`      | Text          | Cargo/função do funcionário           | ✅              |
| `endereco`   | Text          | Endereço residencial                  | ❌              |
| `email`      | Text          | Email (único no sistema)              | ❌              |
| `salario`    | Numeric(10,2) | Salário em formato decimal            | ❌              |
| `created_at` | Timestamp     | Data/hora de criação do registro      | ✅ (automático) |

## 🔧 Funcionalidades do Sistema

- ✅ **Autenticação** com Supabase Auth
- ✅ **CRUD Completo** de funcionários
- ✅ **Validação de dados** no frontend
- ✅ **Design responsivo** com Tailwind CSS
- ✅ **Modal de confirmação** para exclusões
- ✅ **Toast notifications** para feedback
- ✅ **Sistema de cores** consistente

## 🎨 Tecnologias Utilizadas

- **Nuxt 3** - Framework Vue.js
- **Supabase** - Backend as a Service
- **Tailwind CSS** - Framework de CSS
- **TypeScript** - Tipagem estática
- **Vue 3** - Framework JavaScript reativo

## 📱 Páginas Disponíveis

- `/` - Dashboard principal com lista de funcionários
- `/login` - Página de autenticação
- `/novocadastro` - Cadastro de novo funcionário
- `/funcionario/[id]` - Visualização do funcionário
- `/funcionario/[id]/editar` - Edição do funcionário

## 🛡️ Segurança

- Autenticação obrigatória em todas as páginas (exceto login)
- Validação de dados no frontend e backend
- Proteção contra SQL injection (Supabase)
- Sanitização de inputs

## 📞 Suporte

Para dúvidas ou problemas, consulte:

- [Documentação do Nuxt 3](https://nuxt.com/)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)

---

**Desenvolvido com ❤️ usando Nuxt 3 + Supabase**
