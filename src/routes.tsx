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
  { path: "/dashboard/auth/callback", element: <AuthCallback /> }, // opcional, paliativo

  // --- Público (auth) na raiz ---
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "sign-in", element: <SignIn /> }, // "/sign-in"
      { path: "sign-up", element: <SignUp /> }, // "/sign-up"
    ],
  },

  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "orders", element: <Orders /> },
      { path: "collaborators", element: <Collaborators /> },
    ],
  },

  // (Opcional) redireciona bookmarks antigos
  { path: "/dashboard", element: <Navigate to="/" replace /> },

  // 404
  { path: "*", element: <NotFound /> },
]);
