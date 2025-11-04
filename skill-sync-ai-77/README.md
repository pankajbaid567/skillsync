# SkillSync Frontend

Modern React + TypeScript frontend for the SkillSync skill-swapping platform with complete backend integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install
npm install axios socket.io-client

# Configure environment
cp .env.example .env.local

# Start development server
npm run dev
```

Visit http://localhost:5173

## 📦 Tech Stack

- **React 18** + **TypeScript** - UI library with type safety
- **Vite** - Fast build tool
- **React Router 6** - Client-side routing
- **Tailwind CSS** + **shadcn/ui** - Modern styling
- **React Query** - Server state management
- **Axios** - HTTP client with interceptors
- **Socket.IO Client** - Real-time features

## 🏗️ Architecture

This project follows industry-standard patterns:
- **Layered Architecture**: Presentation → State → Service → API Client
- **Context Pattern**: Global state (Auth, Socket)
- **Service Pattern**: Organized API calls by domain
- **Custom Hooks**: Reusable logic with React Query

## 📚 Full Documentation

For complete integration guide, see **[FRONTEND_BACKEND_INTEGRATION.md](./FRONTEND_BACKEND_INTEGRATION.md)**

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ee9de7ce-9694-44b3-8f20-251a4171721c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ee9de7ce-9694-44b3-8f20-251a4171721c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
