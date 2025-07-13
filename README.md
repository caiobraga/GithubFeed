# GitHub Feed

Uma aplicação Next.js que se conecta ao GitHub para exibir commits de diversos projetos em formato de feed e visualizar contribuições de perfis, usando apenas integração com GitHub OAuth sem banco de dados.

## Funcionalidades

- 🔐 **Autenticação com GitHub OAuth** - Login seguro usando sua conta GitHub
- 📊 **Feed de Commits** - Visualize commits de todos os seus repositórios em tempo real
- 👤 **Perfis de Usuário** - Clique em qualquer usuário para ver seu perfil completo
- 📁 **Lista de Repositórios** - Navegue por todos os seus repositórios com busca e filtros
- 📱 **Interface Responsiva** - Funciona perfeitamente em desktop e mobile
- ⚡ **Sem Banco de Dados** - Usa apenas a API do GitHub para buscar dados

## Configuração

### 1. Criar uma aplicação GitHub OAuth

1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Clique em "New OAuth App"
3. Preencha os campos:
   - **Application name**: GitHub Feed
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Anote o `Client ID` e `Client Secret`

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.local` e preencha com suas credenciais:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-aqui-use-um-valor-aleatorio-seguro
GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Executar a aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Como usar

1. **Login**: Acesse a aplicação e faça login com sua conta GitHub
2. **Feed de Commits**: Visualize os commits mais recentes de todos os seus repositórios
3. **Explorar Repositórios**: Use a aba "Repositórios" para navegar por seus projetos
4. **Visualizar Perfis**: Clique em qualquer nome de usuário para ver o perfil completo
5. **Buscar**: Use a barra de busca para encontrar repositórios específicos

## Tecnologias utilizadas

- **Next.js 15** - Framework React para produção
- **NextAuth.js** - Autenticação com GitHub OAuth
- **Octokit** - Cliente oficial da API do GitHub
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **TypeScript** - Tipagem estática

## Estrutura do projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/auth/          # Rotas de autenticação
│   ├── auth/signin/       # Página de login
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── providers/         # Providers de contexto
│   ├── ui/               # Componentes de UI
│   ├── commit-feed.tsx   # Feed de commits
│   ├── github-feed.tsx   # Componente principal
│   ├── header.tsx        # Cabeçalho
│   ├── repository-list.tsx # Lista de repositórios
│   └── user-profile.tsx  # Perfil do usuário
├── lib/                  # Utilitários e configurações
│   └── auth.ts          # Configuração do NextAuth
└── types/               # Tipos TypeScript
    └── next-auth.d.ts   # Tipos do NextAuth
```

## Permissões do GitHub

A aplicação solicita as seguintes permissões:

- `read:user` - Ler informações básicas do perfil
- `user:email` - Acessar endereço de email
- `repo` - Acessar repositórios públicos e privados

## Limitações da API

- A API do GitHub tem limite de 5.000 requisições por hora para usuários autenticados
- Repositórios muito grandes podem demorar para carregar todos os commits
- A aplicação carrega no máximo 50 commits no feed para melhor performance

## Deploy

Para fazer deploy da aplicação:

1. Configure as variáveis de ambiente no seu provedor de hospedagem
2. Atualize a URL de callback no GitHub OAuth App
3. Execute o build da aplicação:

```bash
npm run build
npm start
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está sob a licença MIT.

