import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PassportNotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-lg text-slate-900">DPP Brasil</span>
        </Link>
      </nav>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Card>
          <CardContent className="p-8 space-y-4">
            <span className="text-6xl block">🔍</span>
            <h1 className="text-2xl font-bold text-slate-900">
              Produto não encontrado
            </h1>
            <p className="text-slate-500">
              O passaporte digital solicitado não existe ou foi removido.
            </p>
            <Link href="/">
              <Button>Voltar ao Início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
