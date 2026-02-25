"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou senha incorretos");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div
      className="card"
      style={{ background: "var(--bg-secondary)", padding: 28 }}
    >
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Entrar
      </h2>

      {error && (
        <div
          className="alert-card alert-danger"
          style={{ marginBottom: 16 }}
        >
          <div>
            <div className="alert-text">{error}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-input"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 13,
          color: "var(--text-secondary)",
        }}
      >
        Não tem conta?{" "}
        <a
          href="/register"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          Criar conta
        </a>
      </p>
    </div>
  );
}
