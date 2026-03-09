"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLE_CARDS = [
  {
    email: "fabricante@dpp.br",
    name: "Ana Silva",
    role: "Fabricante",
    organization: "Brastemp (Whirlpool)",
    icon: "🏭",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    description: "Cria passaportes, gerencia produção",
  },
  {
    email: "varejista@dpp.br",
    name: "Carlos Santos",
    role: "Varejista",
    organization: "Magazine Luiza",
    icon: "🏬",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    description: "Registra vendas, rastreia estoque",
  },
  {
    email: "consumidor@dpp.br",
    name: "Maria Oliveira",
    role: "Consumidor",
    organization: "Pessoa Física",
    icon: "👤",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    description: "Consulta produto, manual, garantia",
  },
  {
    email: "tecnico@dpp.br",
    name: "João Pereira",
    role: "Técnico de Reparo",
    organization: "Brastemp Assistência",
    icon: "🔧",
    color: "bg-orange-50 border-orange-200 hover:border-orange-400",
    description: "Registra reparos, consulta peças",
  },
  {
    email: "reciclador@dpp.br",
    name: "Roberto Costa",
    role: "Reciclador",
    organization: "JG-SUSTENTARE",
    icon: "♻️",
    color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
    description: "Registra fim de vida, desmontagem",
  },
  {
    email: "regulador@dpp.br",
    name: "Patrícia Rocha",
    role: "Regulador",
    organization: "INMETRO",
    icon: "🏛️",
    color: "bg-red-50 border-red-200 hover:border-red-400",
    description: "Acesso completo, auditorias",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleDemoLogin(demoEmail: string) {
    setLoading(demoEmail);
    setError("");

    const result = await signIn("credentials", {
      email: demoEmail,
      password: "dpp2026",
      redirect: false,
    });

    if (result?.error) {
      setError("Erro ao fazer login. Tente novamente.");
      setLoading(null);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleManualLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading("manual");
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou senha inválidos.");
      setLoading(null);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl">📋</span>
          <h1 className="text-3xl font-bold text-slate-900">
            DPP Brasil
          </h1>
        </div>
        <p className="text-lg text-slate-600">
          Passaporte Digital de Produto — Linha Branca
        </p>
        <p className="text-sm text-slate-400 mt-1">
          Proof of Concept • ESPR / CIRPASS alignment
        </p>
      </header>

      {/* Role Selector */}
      <main className="flex-1 max-w-5xl mx-auto px-4 pb-12 w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-slate-700 mb-1">
            Selecione um perfil para entrar
          </h2>
          <p className="text-sm text-slate-500">
            Cada perfil tem uma visão diferente do passaporte digital
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {ROLE_CARDS.map((card) => (
            <Card
              key={card.email}
              className={`cursor-pointer transition-all duration-200 border-2 ${card.color} ${
                loading === card.email ? "opacity-75 scale-95" : "hover:scale-[1.02] hover:shadow-md"
              }`}
              onClick={() => !loading && handleDemoLogin(card.email)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{card.icon}</span>
                  <div>
                    <CardTitle className="text-base">{card.role}</CardTitle>
                    <CardDescription className="text-xs">
                      {card.organization}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-2">{card.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{card.name}</span>
                  {loading === card.email ? (
                    <span className="text-xs text-slate-500 animate-pulse">
                      Entrando...
                    </span>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      Entrar →
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {error && (
          <div className="text-center text-red-600 text-sm mb-4">{error}</div>
        )}

        {/* Manual Login Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowManual(!showManual)}
            className="text-sm text-slate-400 hover:text-slate-600 underline"
          >
            {showManual ? "Ocultar login manual" : "Ou faça login com email e senha"}
          </button>
        </div>

        {showManual && (
          <Card className="max-w-sm mx-auto mt-4">
            <CardHeader>
              <CardTitle className="text-base">Login Manual</CardTitle>
              <CardDescription className="text-xs">
                Senha padrão: dpp2026
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualLogin} className="space-y-3">
                <div>
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="fabricante@dpp.br"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="dpp2026"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading === "manual"}
                >
                  {loading === "manual" ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t">
        DPP Brasil POC • Dados reais de recicladores: JG-SUSTENTARE, WK
        Solutions, Greentech
      </footer>
    </div>
  );
}
