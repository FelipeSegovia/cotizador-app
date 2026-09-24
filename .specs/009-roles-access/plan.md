# Plan: Roles, invitaciones y menú

## Archivos a tocar

- `.specs/009-roles-access/*` (nuevo)
- `src/shared/types/auth.ts`, tipos de invitación (nuevo o en auth)
- `src/shared/utils/permissions.ts` (nuevo), `parse-auth-me-response.ts`, `index.ts`
- `src/shared/data/endpoint.ts`, `paths.ts`, labels (admin users, invite, companies, settings)
- `src/shared/services/*` (invitations, companies, accept-invitation); quitar create-user / resend-password de UI
- `src/shared/hooks/*` (useInvitations, useCompanies, mutations)
- `src/shared/components/layouts/RoleProtectedRoute.tsx`, `DashboardLayout.tsx`
- `src/AppRouter.tsx`, `src/pages/LoginPage.tsx`
- `src/pages/AdminUsersPage/*` (invitar, invitaciones pendientes)
- `src/pages/AcceptInvitationPage.tsx` (nuevo)
- `src/pages/AdminCompaniesPage/*` (nuevo)
- `src/shared/components/forms/CompanySettingsForm.tsx`, `TermsSettingsForm.tsx`
- `src/shared/components/ui/CompanyRequiredModal.tsx`, `RoleBadge.tsx`
- `src/mocks/**` (users con business + companyId, invitations, companies, tenancy)

## Diseño

- Helper `can(role, feature)` + `ROLE_HOME` para menú, guards y redirects
- `RoleProtectedRoute` con `allowedRoles: UserRole[]`
- Invitaciones: admin manda `companyId`+`role`; business solo `email`+`name`
- Empresa propia: `GET /api/company` 404 → null; PUT solo business
- MSW: datos por `companyId`; admin 403 en quotations/clients

## Verificación end-to-end

1. Login admin → home empresas; sin ítems Cotizaciones/Clientes
2. Crear empresa → invitar business → aceptar en `/invitar` → login business
3. Business edita ficha, invita common, ve cotizaciones/clientes/usuarios
4. Common ve cotizaciones/clientes; configuración solo lectura
5. Admin ve feedback y usuarios de todas las empresas
