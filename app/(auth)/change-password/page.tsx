"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Erro ao trocar senha");
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Erro de conexão");
      setLoading(false);
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
        Trocar Senha
      </h2>

      {error && (
        <div className="alert-card alert-danger" style={{ marginBottom: 16 }}>
          <div>
            <div className="alert-text">{error}</div>
          </div>
        </div>
      )}

      {success && (
        <div className="alert-card alert-success" style={{ marginBottom: 16 }}>
          <div>
            <div className="alert-text">Senha alterada com sucesso!</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Senha Atual</label>
          <input
            type="password"
            className="form-input"
            placeholder="Sua senha atual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Nova Senha</label>
          <input
            type="password"
            className="form-input"
            placeholder="Mínimo 6 caracteres"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Confirmar Nova Senha</label>
          <input
            type="password"
            className="form-input"
            placeholder="Repita a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          disabled={loading}
        >
          {loading ? "Alterando..." : "Alterar Senha"}
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
        <a
          href="/"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          Voltar ao Dashboard
        </a>
      </p>
    </div>
  );
}
