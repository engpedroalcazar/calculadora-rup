# ObraRadar — Calculadora de Produtividade RUP

Produto digital para diagnóstico de produtividade de mão de obra em construção civil, baseado na Razão Unitária de Produção (RUP).

## Fluxo

```
/ (landing)  →  /diagnostico (quiz + calc)  →  /resultado (prévia grátis)  →  /checkout  →  /relatorio/[id]
```

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Prisma + PostgreSQL** (Docker)
- **lucide-react**

---

## Instalação e execução local

### 1. Instalar dependências

```bash
npm install
```

### 2. Subir o banco de dados (Docker)

```bash
docker-compose up -d
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Conteúdo padrão do `.env.local`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/calculadora_rup"
ADMIN_TOKEN="admin123"
NEXT_PUBLIC_PRECO=29.90
```

### 4. Criar as tabelas no banco

```bash
npx prisma db push
```

### 5. Rodar o servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/diagnostico` | Quiz 6 etapas + Calculadora de RUP |
| `/resultado?id=...` | Prévia gratuita do diagnóstico |
| `/checkout?id=...` | Tela de pagamento (simulada no MVP) |
| `/relatorio/[id]` | Relatório completo (após pagamento) |
| `/admin?token=...` | Painel administrativo |

## Admin

Acesse `/admin?token=admin123` (substituir pelo `ADMIN_TOKEN` configurado).

---

## Motor de cálculo

```
RUP = HH Total / Quantidade executada
HH Total = Trabalhadores × Horas/dia × Dias
Desvio (%) = ((RUP real - RUP ref) / RUP ref) × 100
```

| Desvio | Severidade |
|--------|-----------|
| < -10% | VERIFICAR |
| -10% a +10% | NORMAL |
| +10% a +20% | ATENÇÃO |
| +20% a +30% | ALERTA |
| > +30% | CRÍTICO |

---

## Integração de pagamento (próximas versões)

A rota `/api/checkout/[id]` está pronta para integrar:
- **Stripe** — webhook `payment_intent.succeeded`
- **Mercado Pago** — notificação de pagamento aprovado
- **Hotmart / Kiwify / Perfect Pay** — webhook de venda aprovada

No MVP, a rota simula o pagamento marcando `pago: true` diretamente.
