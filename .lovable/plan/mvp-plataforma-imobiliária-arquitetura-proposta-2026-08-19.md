# MVP Plataforma Imobiliária — Arquitetura Proposta

## Observação importante sobre a stack

Next.js/App Router e Prisma/PostgreSQL autogerenciado não são suportados aqui: este projeto roda em **TanStack Start (React 19 + TypeScript + Vite)** com renderização no servidor, e o banco é **PostgreSQL gerenciado pelo Lovable Cloud** (com autenticação e storage de arquivos inclusos). O equivalente 1:1 de cada item do documento:

| Pedido | Equivalente aqui |
| --- | --- |
| Next.js App Router | TanStack Start file-based routing (SSR) |
| Server Actions / Route Handlers | `createServerFn` + rotas `src/routes/api/*` |
| Prisma + Postgres | PostgreSQL (Lovable Cloud) + migrations SQL versionadas |
| NextAuth | Autenticação gerenciada (e-mail/senha, senha com hash, sessão JWT) |
| Upload local → S3 | Storage de objetos do Cloud (bucket público `property-images`) |
| Tailwind, TypeScript estrito, sem `any` | Idênticos |

Tudo o que o documento pede em termos de produto é entregue; só muda o framework/ORM.

## Modelo de dados (migration SQL, equivalente ao schema Prisma)

Enums: `property_type` (HOUSE, APARTMENT, LAND, LOT, FARM, FARMHOUSE, COMMERCIAL_ROOM, WAREHOUSE), `transaction_type` (SALE, RENT), `property_status` (DRAFT, PUBLISHED, SOLD, RENTED, UNAVAILABLE).

- `properties`: id, public_code (IMV-00001, sequência automática), slug, title, description, property_type, transaction_type, status, price, city, neighborhood, address, show_address, zip_code, land_area, built_area, bedrooms, bathrooms, suites, parking_spaces, created_at, updated_at
- `property_images`: id, property_id (FK cascade), path, is_primary, sort_order, created_at
- `leads`: id, property_id, name, email, phone, message, created_at (formulário de contato)
- `profiles` + `user_roles` (papel `admin`, tabela separada + função `has_role`) — usuários administrativos são criados de forma controlada, sem cadastro público.

RLS: leitura pública apenas de imóveis com status PUBLISHED e suas imagens; escrita somente para admin. GRANTs explícitos por tabela. Seed com ~8 imóveis fictícios marcados como dados de desenvolvimento.

## Rotas

Público: `/`, `/imoveis` (filtros na URL), `/imoveis/$slug` (detalhe + galeria + WhatsApp + formulário), `/contato`.
Admin: `/admin/login`, `/admin/dashboard`, `/admin/imoveis`, `/admin/imoveis/novo`, `/admin/imoveis/$id/editar` — todas protegidas por gate de rota + verificação de admin no servidor.

## Estrutura de pastas

```text
src/
  routes/            rotas públicas, admin e api
  components/
    layout/          Header, Footer, AdminSidebar
    property/        PropertyCard, PropertyGallery, PropertyFilters,
                     PropertyForm, PropertyFeatures, ImageUploader
    common/          ConfirmDialog, ContactButton, EmptyState
  features/properties/  queries, serverFn, mapeamento de filtros
  lib/               validações zod, formatadores, config (WhatsApp/e-mail)
  types/             enums e tipos de domínio
```

## Decisões técnicas

- Filtros derivados de search params tipados (zod) — URL compartilhável, SSR-friendly, botão "limpar filtros".
- Toda validação duplicada: zod no cliente e o mesmo schema no servidor; upload validado por tipo/tamanho/quantidade no servidor.
- Número de WhatsApp e e-mails em um único módulo de configuração lido de variáveis de ambiente.
- SEO: `head()` por rota, slug amigável (`casa-alto-paraiso-3-quartos`), Open Graph com a foto principal.

## Fases (uma por vez, com verificação de tipos/lint/build ao final de cada)

1. Fundação: design system, layout base, Cloud habilitado, variáveis de ambiente
2. Banco: enums, tabelas, RLS, seed
3. Área pública: Header/Footer, home, listagem, PropertyCard, detalhe, galeria
4. Busca e filtros na URL, ordenação, paginação
5. Admin: login, proteção, dashboard, CRUD, publicar/despublicar
6. Imagens: upload, preview, exclusão, foto principal
7. Contato: WhatsApp e formulário de e-mail
8. Polimento: responsividade, estados de erro/vazio, SEO, acessibilidade, segurança

Aprovando, começo pela Fase 1.
