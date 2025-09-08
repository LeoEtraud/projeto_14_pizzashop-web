import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash; // "#token=..."
    const params = new URLSearchParams(
      hash.startsWith("#") ? hash.slice(1) : hash,
    );
    const token = params.get("token");

    if (token) {
      localStorage.setItem("ps_token", token);
    }

    // limpa o hash e manda pro app
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    navigate("/app", { replace: true });
  }, [navigate]);

  return null; // pode renderizar um spinner se quiser
}
