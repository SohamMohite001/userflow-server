# UserFlow — Backend API (Server)

The REST API backend for **UserFlow**, built with Node.js, Express.js, MongoDB Atlas, and JSON Web Token (JWT) authentication. Designed for seamless standalone deployment on **Railway** and integration with the frontend on Netlify.

---

## Features

- **Authentication & Authorization**: Stateless JWT verification and role-based access control (RBAC) restricting user management strictly to `ADMIN` accounts.
- **Data Persistence**: Mongoose with MongoDB Atlas, enforcing unique emails and automatic password exclusion.
- **Security**: Salted password hashing with `bcryptjs` (salt rounds: 10), email normalization, and CORS origin protection.
- **Health Verification**: `GET /api/health` endpoint for uptime monitoring.
- **CLI Provisioning**: Standalone `create-admin` script to securely provision the initial administrator without public registration.

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB Atlas Cluster**: Free shared M0 cluster or self-hosted instance

---

## Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in this directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. **Populate `.env`**:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/userflow
   JWT_SECRET=your_super_secret_jwt_key
   CLIENT_URL=http://localhost:5173
   ADMIN_NAME=Application Admin
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_secure_password
   ```

4. **Provision the initial administrator**:
   ```bash
   npm run create-admin
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   Server starts listening at `http://0.0.0.0:5000`.

---

## Deployment on Railway

### Step 1: Push to GitHub
Push this directory as its own GitHub repository (e.g., `userflow-server`).

### Step 2: Deploy to Railway
1. Log in to [Railway](https://railway.com/).
2. Click **New Project** > **Deploy from GitHub repo**.
3. Select your `userflow-server` repository.

### Step 3: Configure Environment Variables
In the Railway dashboard under **Variables**, set:
- `PORT`: `5000` (or Railway will inject its standard port)
- `NODE_ENV`: `production`
- `MONGODB_URI`: `<your-mongodb-atlas-connection-string>`
- `JWT_SECRET`: `<your-random-jwt-secret>`
- `CLIENT_URL`: `https://your-userflow-app.netlify.app` *(your Netlify frontend domain)*
- `ADMIN_NAME`: `Application Admin`
- `ADMIN_EMAIL`: `admin@example.com`
- `ADMIN_PASSWORD`: `<your-secure-admin-password>`

### Step 4: Generate Public Domain
Under **Settings** > **Networking** > **Public Networking**, click **Generate Domain** (e.g., `https://userflow-server.up.railway.app`).

### Step 5: Provision Initial Administrator on Railway
Run the admin creation script on Railway:
- **Using Railway CLI**:
  ```bash
  railway run npm run create-admin
  ```
- **Or via Railway Dashboard Shell**:
  Open the web console for your service and run:
  ```bash
  npm run create-admin
  ```

---

## API Endpoints

Base URL: `/api`

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System health check |
| `POST` | `/api/auth/login` | Public | Logs in administrator/user and returns JWT |
| `POST` | `/api/auth/logout` | Authenticated | Confirms session termination |
| `GET` | `/api/users` | Admin JWT | Retrieves all registered users |
| `POST` | `/api/users` | Admin JWT | Registers a new standard user |

---

## Folder Structure

```text
server/
├── scripts/
│   └── createAdmin.js
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```
