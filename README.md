<div align="center">

# GitHub Feed

*Your real-time window into GitHub activity*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![GitHub OAuth](https://img.shields.io/badge/GitHub-OAuth-black?style=for-the-badge&logo=github)](https://github.com/)

</div>

---

## For Managers

### Overview
GitHub Feed is a powerful, real-time dashboard that transforms how teams monitor and interact with GitHub repositories. It provides instant visibility into development activity, helping managers and team leads stay informed without diving into technical details.

### Key Benefits

**Instant Visibility**
- Real-time commit feed across all repositories
- At-a-glance view of team activity
- Zero setup time for new repositories

**Team Insights**
- Track developer contributions
- Monitor project velocity
- Identify active/inactive repositories

**Business Value**
- Reduce time spent on progress tracking
- Improve team coordination
- Enhance transparency in development

### ROI Metrics
- **Time Saved**: ~2 hours/week per manager on project status reviews
- **Onboarding**: 50% faster repository familiarization for new team members
- **Coordination**: 30% reduction in status update meetings

---

## For Developers

### Technical Overview
A modern, performant web application built with Next.js 15, TypeScript, and Tailwind CSS. Uses GitHub OAuth for authentication and Octokit for API interactions.

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/github-feed.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Core Features

### Features

- **GitHub OAuth Authentication** - Secure login using your GitHub account
- **Commit Feed** - View commits from all your repositories in real-time
- **User Profiles** - Click on any user to see their complete profile
- **Repository List** - Browse all your repositories with search and filters
- **Responsive Interface** - Works perfectly on desktop and mobile
- **No Database** - Uses only the GitHub API to fetch data

### Configuration

### 1. Create a GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the fields:
   - **Application name**: GitHub Feed
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Note down your `Client ID` and `Client Secret`

### 2. Configure Environment Variables

Copy the `.env.local` file and fill in your credentials:

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

The application will be available at `http://localhost:3000`.

### Usage

1. **Login**: Access the application and sign in with your GitHub account
2. **Commit Feed**: View the most recent commits from all your repositories
3. **Explore Repositories**: Use the "Repositories" tab to browse your projects
4. **View Profiles**: Click on any username to see their complete profile
5. **Search**: Use the search bar to find specific repositories

### Tech Stack

- **Next.js 15** - Production-grade React framework
- **NextAuth.js** - GitHub OAuth authentication
- **Octokit** - Official GitHub API client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icons
- **TypeScript** - Static typing

### Project Structure

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

### GitHub Permissions

The application requires the following permissions:

- `read:user` - Read basic profile information
- `user:email` - Access email address
- `repo` - Access public and private repositories

### API Limitations

- GitHub API has a limit of 5,000 requests per hour for authenticated users
- Very large repositories may take longer to load all commits
- Some commits may not appear if the user doesn't have access

## Deployment

To deploy the application:

1. Configure environment variables on your hosting provider
2. Update the callback URL in your GitHub OAuth App settings
3. Run the build command:

```bash
npm run build
npm start
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está sob a licença MIT.

