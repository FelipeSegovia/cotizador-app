# Spec: Editar datos de clientes

## Objetivo

Permitir a los usuarios autenticados editar el nombre, web, correo y teléfono de un lead ya creado, sin salir del flujo de Clientes.

## Requisitos funcionales

- Modal de edición con los mismos campos que el alta: nombre (obligatorio), web, correo y teléfono (opcionales)
- Acceso desde la tabla desktop (lápiz), la lista móvil (lápiz) y el modal de detalle (botón «Editar»)
- Validación igual que el alta: nombre no vacío; correo válido si viene
- Permitir vaciar web, correo o teléfono
- Si se borra el correo, desmarcar `contacts.email`; si se borra el teléfono, desmarcar `contacts.phone` y `contacts.whatsapp`
- Persistencia vía `PATCH /api/clients/:id`; toast de éxito y cierre del modal
- La lista se actualiza tras guardar (invalidación de queries)

## Fuera de alcance

- Actividad automática en el timeline al editar la ficha
- Cambiar estado o canales desde el formulario de edición
- Cambios de contrato backend (el PATCH ya acepta estos campos)

## Criterios de aceptación

- [x] Se puede abrir el formulario de edición desde tabla, lista móvil y detalle
- [x] El formulario viene prellenado con los datos actuales del lead
- [x] Guardar actualiza nombre/web/correo/teléfono en la lista y en el detalle
- [x] Vaciar teléfono desmarca y deshabilita checkboxes de Teléfono y WhatsApp
- [x] Nombre vacío o correo inválido no envían el formulario
- [x] La UI reutiliza `Modal`, `FormField` y tokens `primary`
