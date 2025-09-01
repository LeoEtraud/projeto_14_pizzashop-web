import { createBrowserRouter, Navigate } from "react-router-dom";

import { AuthLayout } from "./pages/_layouts/auth";
import { AppLayout } from "./pages/_layouts/app";

import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";

import { Dashboard } from "./pages/app/dashboard/dashboard";
import { Orders } from "./pages/app/orders/orders";
import { Collaborators } from "./pages/app/collaborators/collaborators";

import { NotFound } from "./pages/404";
import { Error } from "./pages/error";

export const router = createBrowserRouter([
  // --- Público (auth) na raiz ---
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <SignIn /> }, // "/" abre SignIn
      { path: "sign-in", element: <SignIn /> }, // "/sign-in"
      { path: "sign-up", element: <SignUp /> }, // "/sign-up"
    ],
  },

  // --- App autenticado em /app ---
  {
    path: "/app",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Dashboard /> }, // "/app"
      { path: "orders", element: <Orders /> }, // "/app/orders"
      { path: "collaborators", element: <Collaborators /> }, // "/app/collaborators"
    ],
  },

  // (Opcional) redireciona bookmarks antigos
  { path: "/dashboard", element: <Navigate to="/app" replace /> },

  // 404
  { path: "*", element: <NotFound /> },
]);
