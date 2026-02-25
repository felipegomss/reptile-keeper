import type { Metadata } from "next";
import Link from "next/link";
import "./landing.css";

export const metadata: Metadata = {
  title: "Reptile Keeper - Gerenciamento Completo do Seu Réptil de Estimação",
  description:
    "Acompanhe alimentação, peso, trocas de pele, documentos e saúde do seu réptil. O app mais completo para criadores e tutores de répteis no Brasil.",
  keywords: [
    "réptil",
    "pet",
    "cobra",
    "lagarto",
    "quelônio",
    "alimentação réptil",
    "controle de peso réptil",
    "troca de pele",
    "reptile keeper",
    "gerenciamento de répteis",
  ],
  openGraph: {
    title: "Reptile Keeper - Gerenciamento Completo do Seu Réptil",
    description:
      "Acompanhe alimentação, peso, trocas de pele e saúde do seu réptil de estimação.",
    siteName: "Reptile Keeper",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reptile Keeper",
    description:
      "O app mais completo para gerenciar seu réptil de estimação.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingPage() {
  return (
    <div className="landing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Reptile Keeper",
            description:
              "Gerenciamento completo do seu réptil de estimação. Acompanhe alimentação, peso, trocas de pele e saúde.",
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Web",
            inLanguage: "pt-BR",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "BRL",
            },
          }),
        }}
      />

      {/* Header */}
      <header className="landing-header">
        <span className="landing-logo">
          Reptile <span>Keeper</span>
        </span>
        <nav className="landing-nav">
          <a href="#funcionalidades" className="landing-nav-link">
            Funcionalidades
          </a>
          <a href="#como-funciona" className="landing-nav-link">
            Como Funciona
          </a>
          <Link href="/login" className="landing-btn landing-btn-ghost">
            Entrar
          </Link>
          <Link href="/register" className="landing-btn landing-btn-primary">
            Criar Conta
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-badge">Gratuito</div>
        <h1>
          Cuide do seu réptil com <span className="accent">inteligência</span>
        </h1>
        <p>
          Controle alimentação, peso, trocas de pele, documentos e saúde do seu
          pet em um só lugar. Tudo o que criadores e tutores de répteis precisam.
        </p>
        <div className="hero-actions">
          <Link href="/register" className="landing-btn landing-btn-primary">
            Comece Agora
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a href="#funcionalidades" className="landing-btn landing-btn-ghost">
            Ver Funcionalidades
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="landing-features">
        <h2>Tudo em um só lugar</h2>
        <p>
          Ferramentas completas para acompanhar cada detalhe da vida do seu
          réptil.
        </p>
        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v17M8 7l4-4 4 4" />
                <rect x="3" y="14" width="18" height="7" rx="2" />
              </svg>
            </div>
            <h3>Controle de Peso</h3>
            <p>
              Acompanhe o crescimento com gráficos detalhados. Veja a evolução
              mês a mês e identifique tendências.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
              </svg>
            </div>
            <h3>Registro de Alimentação</h3>
            <p>
              Controle tipo de presa, aceitação, intervalos e gramatura. Nunca
              mais esqueça o dia da próxima refeição.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M8 12l3 3 5-5" />
              </svg>
            </div>
            <h3>Trocas de Pele</h3>
            <p>
              Monitore frequência e qualidade das ecdises. Acompanhe a saúde
              do casco para quelônios.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
              </svg>
            </div>
            <h3>Alertas Inteligentes</h3>
            <p>
              Receba avisos automáticos sobre atrasos na alimentação, ecdises e
              variações de peso incomuns.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 16l4-8 4 5 4-10" />
              </svg>
            </div>
            <h3>Gráficos e Relatórios</h3>
            <p>
              Visualize a evolução com gráficos de peso e alimentação. Dados
              claros para decisões melhores.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3>Documentos</h3>
            <p>
              Organize laudos veterinários, exames, documentos de legalidade e
              notas de saúde em um só lugar.
            </p>
          </article>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="landing-steps">
        <h2>Simples de usar</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Crie sua conta</h3>
            <p>Cadastro rápido e gratuito. Comece em segundos.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Adicione seu pet</h3>
            <p>Registre espécie, morph, data de nascimento e mais.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Acompanhe tudo</h3>
            <p>Registre alimentações, pesos, ecdises e monitore a saúde.</p>
          </div>
        </div>
        <Link href="/register" className="landing-btn landing-btn-primary">
          Criar Conta Gratuita
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>
          Reptile Keeper &mdash; Feito com dedicação para criadores e tutores de
          répteis.
        </p>
      </footer>
    </div>
  );
}
