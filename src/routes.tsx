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
import AuthCallback from "./pages/AuthCallback";

export const router = createBrowserRouter([
  // callback do magic-link (pública)
  { path: "/auth/callback", element: <AuthCallback /> },

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

  // --- App autenticado em /home ---
  {
    path: "/home",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Dashboard /> }, // "/home"
      { path: "orders", element: <Orders /> }, // "/home/orders"
      { path: "collaborators", element: <Collaborators /> }, // "/home/collaborators"
    ],
  },

  // (Opcional) redireciona bookmarks antigos
  { path: "/dashboard", element: <Navigate to="/home" replace /> },

  // 404
  { path: "*", element: <NotFound /> },
]);
