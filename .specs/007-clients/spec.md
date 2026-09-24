# Spec: Sección Clientes (leads + actividades)

## Objetivo

Permitir a todos los usuarios autenticados gestionar clientes potenciales: darlos de alta, filtrarlos por estado, registrar canales de contacto (Email / Teléfono / WhatsApp) y mantener un timeline de actividades y notas.

## Requisitos funcionales

- Página en `/dashboard/clientes` accesible para cualquier usuario autenticado
- Alta de lead: nombre obligatorio; web, correo y teléfono opcionales
- Estados: No contactado, Aprobado, Rechazado
- Stats: Total, No contactado, Aprobado, Rechazado (sobre la lista completa)
- Búsqueda por nombre, correo, teléfono o web
- Filtros por estado con pills
- Toggles de canal Email / Teléfono / WhatsApp (deshabilitados si falta el dato)
- Timeline automático al crear, cambiar estado o togglear canal; notas manuales
- Eliminar lead con confirmación
- Vista desktop (tabla) y móvil (cards)
- Persistencia vía API; en desarrollo, MSW

## Fuera de alcance

- Vincular leads con cotizaciones
- Métricas por periodo de tiempo
- Envío real de email / WhatsApp
- Paginación en servidor

## Criterios de aceptación

- [ ] El ítem «Clientes» aparece en el sidebar para todos los autenticados
- [ ] Se puede crear un lead solo con nombre
- [ ] Los stats reflejan conteos de la lista completa
- [ ] Búsqueda y filtros de estado funcionan en cliente
- [ ] Cambiar estado o canal añade un evento al timeline
- [ ] Se puede agregar una nota al timeline
- [ ] Eliminar pide confirmación y quita el lead de la lista
- [ ] La UI usa la paleta y componentes existentes (`Modal`, `FormField`, tokens `primary`/`destructive`)
