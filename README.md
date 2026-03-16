# API Cookie Finder

Bem-vindo ao repositório do **API Cookie Finder**, o backend de uma aplicação focada no compartilhamento e descoberta de receitas culinárias, posts e interações sociais entre usuários.

## 🏗️ Arquitetura Utilizada

Este projeto foi construído utilizando **Node.js** com o framework **NestJS**, adotando padrões de design limpos e modulares para garantir escalabilidade e fácil manutenção.

### Princípios e Padrões
- **Design Modular**: A aplicação é dividida em módulos independentes (Auth, Users, Recipes, Categories, Posts, Notifications, Storage).
- **Use Cases Pattern**: A regra de negócios principal é isolada em Use Cases (ex: `CreateRecipeUseCase`), separando-a dos Controllers.
- **Repository Pattern**: A camada de persistência de dados é abstraída usando repositórios, facilitando testes e possíveis migrações de banco de dados.
- **Filas e Processamento em Segundo Plano**: Utilização de Jobs assíncronos (BullMQ + Redis) para tarefas como envio de notificações sem bloquear a thread principal.

### 🛠️ Tecnologias e Ferramentas
- **Linguagem**: TypeScript
- **Framework Web**: NestJS
- **Banco de Dados & ORM**: Prisma ORM (Mapeamento relacional)
- **Autenticação**: JWT (JSON Web Tokens) e integração com Google Auth
- **Armazenamento de Arquivos/Imagens**: Google Cloud Storage
- **Mensageria / Filas**: BullMQ operando com Redis
- **Notificações Push**: OneSignal

## ⚙️ Funcionalidades Principais

A aplicação funciona como uma rede social de culinária onde os usuários podem:
- **Gerenciar Conta**: Registrar-se utilizando credenciais ou através do Google.
- **Perfil e Social**: Visualizar perfis e seguir/deixar de seguir outros cozinheiros.
- **Receitas**: Criar novas receitas com upload de fotos, buscar, favoritar, visualizar listagens e avaliar/dar notas às receitas de outros.
- **Posts (Feed)**: Criar postagens (com imagens e tags), comentar em posts, salvar posts para ler depois e explorar conteúdo na plataforma.
- **Categorias**: Organizar receitas através de categorias cadastradas (ex: Doces, Salgados, Vegano).
- **Notificações**: Receber avisos de interações através de notificações (listagem in-app e push).

## 🚀 Endpoints / API REST

Abaixo estão os principais endpoints separados por domínio (requerem token JWT no header de Authorization, exceto os marcados ou rotas públicas naturais como login e registro):

### 🔐 Autenticação (`/auth`)
- `POST /auth/sign-in` : Autenticação de usuário via e-mail e senha.
- `POST /auth/google-login` : Autenticação utilizando conta Google.

### 👤 Usuários (`/users`)
- `POST /users/register` : Cria uma nova conta de usuário.
- `GET /users/:id` : Retorna o perfil de um usuário específico.
- `POST /users/:id/follow` : Segue um usuário.
- `DELETE /users/:id/follow` : Deixa de seguir um usuário.

### 🍳 Receitas (`/recipes`)
- `POST /recipes` : Cria uma nova receita (suporta upload de imagem via `multipart/form-data`).
- `GET /recipes` : Lista de todas as receitas (paginada).
- `GET /recipes/me` : Lista as receitas criadas pelo usuário logado.
- `GET /recipes/me/favorites` : Lista as receitas favoritadas pelo usuário logado.
- `GET /recipes/:id` : Busca os detalhes de uma receita específica.
- `POST /recipes/:id/favorite` : Favorita uma receita.
- `DELETE /recipes/:id/favorite` : Remove uma receita dos favoritos.
- `POST /recipes/:id/evaluate` : Avalia (dá nota) a uma receita.
- `GET /recipes/:id/evaluations` : Lista as avaliações de uma receita.
- `DELETE /recipes/:id` : Deleta uma receita do próprio usuário.

### 📝 Posts (`/posts`)
- `GET /posts` : Listagem de posts (feed).
- `POST /posts` : Cria um novo post (suporta upload de imagem via `multipart/form-data`).
- `GET /posts/:id` : Busca os detalhes de um post.
- `GET /posts/saved` : Lista os posts salvos pelo usuário logado.
- `GET /posts/tags` : Lista as tags disponíveis para os posts.
- `POST /posts/:id/comments` : Adiciona um comentário a um post.
- `GET /posts/:id/comments` : Lista os comentários de um post.
- `POST /posts/:id/save` : Salva um post.
- `DELETE /posts/:id/save` : Remove um post dos salvos.

### 🏷️ Categorias (`/categories`)
- `GET /categories` : Lista as categorias de receitas disponíveis.
- `POST /categories` : Cria uma nova categoria (suporta upload de imagem de capa).

### 🔔 Notificações (`/notifications`)
- `GET /notifications` : Lista as notificações do usuário logado.

---

## 🛠️ Como Executar o Projeto Localmente

1. **Clone o repositório e instale as dependências:**
   ```bash
   npm install
   ```
2. **Configuração de Variáveis de Ambiente:**
   Copie o arquivo `.env-example` para `.env` e preencha as chaves necessárias (banco de dados, JWT, Redis, GCP, OneSignal).
3. **Inicie o banco de dados e Redis (via Docker, se configurado):**
   ```bash
   docker-compose up -d
   ```
4. **Execute as migrations do Prisma:**
   ```bash
   npx prisma migrate dev
   ```
5. **Inicie a aplicação:**
   ```bash
   npm run dev
   ```
A aplicação estará rodando na porta definida padrão do NestJS (geralmente `3000`).

---

# API Cookie Finder (English translation)

Welcome to the **API Cookie Finder** repository, the backend of an application focused on sharing and discovering culinary recipes, posts, and social interactions among users.

## 🏗️ Architecture Used

This project was built using **Node.js** with the **NestJS** framework, adopting clean and modular design patterns to ensure scalability and easy maintenance.

### Principles and Patterns
- **Modular Design**: The application is divided into independent modules (Auth, Users, Recipes, Categories, Posts, Notifications, Storage).
- **Use Cases Pattern**: The core business logic is isolated in Use Cases (e.g., `CreateRecipeUseCase`), separating it from Controllers.
- **Repository Pattern**: The data persistence layer is abstracted using repositories, facilitating tests and potential database migrations.
- **Queues and Background Processing**: Use of asynchronous Jobs (BullMQ + Redis) for tasks like sending notifications without blocking the main thread.

### 🛠️ Technologies and Tools
- **Language**: TypeScript
- **Web Framework**: NestJS
- **Database & ORM**: Prisma ORM (Relational mapping)
- **Authentication**: JWT (JSON Web Tokens) and integration with Google Auth
- **File/Image Storage**: Google Cloud Storage
- **Messaging / Queues**: BullMQ operating with Redis
- **Push Notifications**: OneSignal

## ⚙️ Main Features

The application works as a culinary social network where users can:
- **Account Management**: Register using credentials or through Google.
- **Profile and Social**: View profiles and follow/unfollow other cooks.
- **Recipes**: Create new recipes with photo uploads, search, favorite, view listings, and evaluate/rate other users' recipes.
- **Posts (Feed)**: Create posts (with images and tags), comment on posts, save posts to read later, and explore content on the platform.
- **Categories**: Organize recipes through registered categories (e.g., Sweets, Savory, Vegan).
- **Notifications**: Receive alerts of interactions through notifications (in-app listing and push).

## 🚀 Endpoints / REST API

Below are the main endpoints separated by domain (they require a JWT token in the Authorization header, except for naturally public routes like login and registration):

### 🔐 Authentication (`/auth`)
- `POST /auth/sign-in` : User authentication via email and password.
- `POST /auth/google-login` : Authentication using a Google account.

### 👤 Users (`/users`)
- `POST /users/register` : Creates a new user account.
- `GET /users/:id` : Returns the profile of a specific user.
- `POST /users/:id/follow` : Follows a user.
- `DELETE /users/:id/follow` : Unfollows a user.

### 🍳 Recipes (`/recipes`)
- `POST /recipes` : Creates a new recipe (supports image upload via `multipart/form-data`).
- `GET /recipes` : List of all recipes (paginated).
- `GET /recipes/me` : Lists the recipes created by the logged-in user.
- `GET /recipes/me/favorites` : Lists the recipes favorited by the logged-in user.
- `GET /recipes/:id` : Fetches the details of a specific recipe.
- `POST /recipes/:id/favorite` : Favorites a recipe.
- `DELETE /recipes/:id/favorite` : Removes a recipe from favorites.
- `POST /recipes/:id/evaluate` : Evaluates (rates) a recipe.
- `GET /recipes/:id/evaluations` : Lists the evaluations of a recipe.
- `DELETE /recipes/:id` : Deletes a recipe owned by the user.

### 📝 Posts (`/posts`)
- `GET /posts` : List of posts (feed).
- `POST /posts` : Creates a new post (supports image upload via `multipart/form-data`).
- `GET /posts/:id` : Fetches the details of a post.
- `GET /posts/saved` : Lists the posts saved by the logged-in user.
- `GET /posts/tags` : Lists available tags for posts.
- `POST /posts/:id/comments` : Adds a comment to a post.
- `GET /posts/:id/comments` : Lists the comments of a post.
- `POST /posts/:id/save` : Saves a post.
- `DELETE /posts/:id/save` : Removes a post from saved.

### 🏷️ Categories (`/categories`)
- `GET /categories` : Lists available recipe categories.
- `POST /categories` : Creates a new category (supports cover image upload).

### 🔔 Notifications (`/notifications`)
- `GET /notifications` : Lists the logged-in user's notifications.

---

## 🛠️ How to Run the Project Locally

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```
2. **Environment Variables Configuration:**
   Copy the `.env-example` file to `.env` and fill in the necessary keys (database, JWT, Redis, GCP, OneSignal).
3. **Start the database and Redis (via Docker, if configured):**
   ```bash
   docker-compose up -d
   ```
4. **Run Prisma migrations:**
   ```bash
   npx prisma migrate dev
   ```
5. **Start the application:**
   ```bash
   npm run dev
   ```
The application will be running on the default NestJS port (usually `3000`).
