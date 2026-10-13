# Vercel deployment

Deploy this repository as two Vercel projects. This gives the Vite site and the Express API independent build and runtime logs.

## 1. Deploy the API

1. Import this repository in Vercel and set the Root Directory to `backend`.
2. Vercel detects the Express app from `server.js`; do not set a custom build command.
3. Add these Production environment variables:

```text
MONGO_URI=
JWT_SECRET=
CORS_ORIGIN=https://your-frontend.vercel.app
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

4. Deploy, then open `https://your-backend.vercel.app/api/health`.

The health response reports the database and Cloudinary configuration. If a request fails, Vercel logs contain a JSON event with the `requestId`; that same ID is returned in the API error response.

## 2. Deploy the website

1. Import the same repository as a second Vercel project and set the Root Directory to `frontend`.
2. Add these Production environment variables:

```text
VITE_API_URL=https://your-backend.vercel.app
VITE_API_TIMEOUT_MS=15000
VITE_GOOGLE_CLIENT_ID=
```

3. Deploy. The included `frontend/vercel.json` keeps React routes such as `/blogs/...` working after a refresh.
4. Copy the website URL into the API project's `CORS_ORIGIN`, then redeploy the API once.

## Local development

Create `backend/.env` from `backend/sample.env`. Use `frontend/.env.example` as the frontend reference. Start the API from `backend` with `npm run dev` and the website from `frontend` with `npm run dev`.

Do not commit `.env` files or real credentials. Set values in Vercel Project Settings -> Environment Variables for Preview and Production.
