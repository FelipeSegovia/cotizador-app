# Plan: Editar datos de clientes

## Archivos a tocar

- `.specs/008-edit-client/*` (nuevo)
- `docs/clients-api.md` (diagrama de flujo)
- `src/shared/data/labels-clients-page.ts`
- `src/pages/ClientsPage/EditClientModal.tsx` (nuevo)
- `src/pages/ClientsPage/ClientsTable.tsx`
- `src/pages/ClientsPage/ClientsMobileList.tsx`
- `src/pages/ClientsPage/ClientDetailModal.tsx`
- `src/pages/ClientsPage/index.tsx`

## Diseño

- Modal propio `EditClientModal` calcado de `EditUserModal`: props `client | null`, `useEffect` + `reset`
- Reutiliza `useUpdateClient` y `UpdateClientDto` ya existentes
- Payload envía strings (incluso vacíos) para poder limpiar campos opcionales
- Si se limpia email/phone, el mismo PATCH desmarca los flags de canal correspondientes
- Un solo modal a la vez: desde detalle, `onEdit` cierra detalle y abre edición

## Verificación end-to-end

1. Login → Clientes → lápiz → formulario prellenado
2. Cambiar nombre/correo → guardar → lista y detalle actualizados
3. Vaciar teléfono con WhatsApp marcado → checkboxes desmarcados y deshabilitados
4. Validación: nombre vacío / correo inválido
5. Desde detalle, «Editar» abre el formulario
6. Viewport móvil: lápiz usable
