"use client";

// Botão exclusivo de desenvolvimento — marca um lead como pago sem passar pelo
// fluxo de checkout. Permite testar o relatório completo enquanto a integração
// Mercado Pago ainda não está disponível (vem na Iter #6).
// O endpoint chamado também valida NODE_ENV; este botão só renderiza se isDev.

import { useState } from "react";
import { Unlock, Loader2 } from "lucide-react";

export function DevUnlockButton({ leadId }: { leadId: string }) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function destravar() {
    setCarregando(true);
    setErro(null);
    try {
      const r = await fetch(`/api/orcamento/dev/marcar-pago/${leadId}`, { method: "POST" });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        setErro(data?.erro ?? "Falha ao destravar.");
        return;
      }
      window.location.reload();
    } catch {
      setErro("Falha de conexão.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-dashed border-ink-900/20 bg-white/60 p-4 text-xs text-ink-500">
      <p className="mb-2 font-bold uppercase tracking-wider">
        Modo desenvolvimento
      </p>
      <p className="mb-3 leading-relaxed">
        Atalho interno pra liberar o relatório completo sem pagamento — funciona
        só em <code>NODE_ENV=development</code>. Em produção, este botão e o
        endpoint não existem.
      </p>
      <button
        type="button"
        onClick={destravar}
        disabled={carregando}
        className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-cream-50 hover:bg-ink-900/90 disabled:opacity-60"
      >
        {carregando ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Unlock className="h-4 w-4" />
        )}
        Destravar manualmente (dev)
      </button>
      {erro && <p className="mt-2 text-rose-600">{erro}</p>}
    </div>
  );
}
