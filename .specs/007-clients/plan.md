# Plan: Sección Clientes

## Archivos a tocar

- `.specs/007-clients/*` (nuevo)
- `docs/clients-api.md` (nuevo)
- `src/shared/types/client.ts` (nuevo)
- `src/shared/data/endpoint.ts`, `paths.ts`, `labels-clients-page.ts`, `index.ts`
- `src/shared/utils/format.ts`, `index.ts`
- `src/shared/services/get-clients.ts`, `create-client.ts`, `update-client.ts`, `delete-client.ts`, `create-client-activity.ts`, `index.ts`
- `src/shared/hooks/useClients.ts`, `useClientMutations.ts`, `index.ts`
- `src/mocks/data/clients.ts`, `handlers/clients.ts`, `handlers/index.ts`
- `src/pages/ClientsPage/*` (nuevo)
- `src/pages/index.ts`, `AppRouter.tsx`, `DashboardLayout.tsx`

## Diseño

- Entidad `Client` con `status`, `contacts` (email/phone/whatsapp) y `activities[]`
- PATCH parcial para estado y canales; POST de notas en `/activities`
- MSW con `requireAuth`; semilla Ana Torres, Comercial Delta, Luis Marín
- UI calcada de AdminUsersPage + split desktop/móvil de QuotationsListPage
- Tokens: CTA `bg-primary`, cards `rounded-2xl border-border bg-card`

## Verificación end-to-end

1. Login → sidebar Clientes → listado con 3 leads y stats
2. Agregar cliente → aparece en lista y en timeline «creado»
3. Filtrar / buscar → lista se reduce
4. Cambiar estado y toggles → eventos en timeline del detalle
5. Agregar nota → aparece arriba del timeline
6. Eliminar con confirmación → desaparece de la lista
7. Viewport móvil: cards + modal de detalle usable
