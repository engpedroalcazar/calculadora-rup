type Props = {
  etapaAtual: number;
  totalEtapas: number;
  labels?: string[];
};

export function QuizProgress({ etapaAtual, totalEtapas, labels }: Props) {
  const passos = Array.from({ length: totalEtapas }, (_, i) => i + 1);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {passos.map((n, idx) => {
          const ativa = n <= etapaAtual;
          const atual = n === etapaAtual;
          return (
            <div key={n} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                    atual
                      ? "border-gold-500 bg-gold-500 text-navy-900"
                      : ativa
                      ? "border-gold-500 bg-transparent text-gold-500"
                      : "border-[var(--navy-line-strong)] bg-transparent text-[var(--fg-on-dark-muted)]"
                  }`}
                >
                  {n}
                </div>
                {labels?.[idx] && (
                  <p
                    className={`mt-2 hidden text-[10px] uppercase tracking-wider sm:block ${
                      ativa ? "text-gold-500" : "text-[var(--fg-on-dark-muted)]"
                    }`}
                  >
                    {labels[idx]}
                  </p>
                )}
              </div>
              {idx < passos.length - 1 && (
                <div
                  className={`mx-2 h-[2px] flex-1 ${
                    n < etapaAtual
                      ? "bg-gold-500"
                      : "bg-[var(--navy-line-strong)]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
