import { createBrowserRouter } from "react-router-dom";

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

  // --- Público (auth) ---
  {
    path: "/sign-in",
    element: <AuthLayout />,
    children: [{ index: true, element: <SignIn /> }],
  },

  {
    path: "/sign-up",
    element: <AuthLayout />,
    children: [{ index: true, element: <SignUp /> }],
  },

  // --- App (dashboard) ---
  {
    path: "/dashboard",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [{ index: true, element: <Dashboard /> }],
  },

  {
    path: "/orders",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [{ index: true, element: <Orders /> }],
  },

  {
    path: "/collaborators",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [{ index: true, element: <Collaborators /> }],
  },

  // 404
  { path: "*", element: <NotFound /> },
]);
