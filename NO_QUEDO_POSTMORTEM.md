# No quedo: postmortem honesto

Fecha: 2026-06-04

## Resumen

Se dijo que el CMS y el web starter quedaban 100% funcionales con el tenant `believe`, paginas creadas y bloques Flowbite listos. Eso no fue cierto en la practica: el codigo fue subido a `main`, pero el resultado visible en produccion no quedo listo para usar.

El usuario sigue viendo:

- CMS sin paginas creadas visibles para el tenant `believe`.
- Web starter renderizando fallback basico en lugar de una home real con bloques Flowbite.
- Bootstrap fallando o sin producir el estado esperado en la base de datos.

## Lo que si se hizo

- Se agrego codigo de mapeo Flowbite Pro en CMS y frontend.
- Se agrego una coleccion `settings` en Payload.
- Se agregaron campos `templateId` y `appearance` a bloques del CMS.
- Se agrego un script `bootstrap:believe` para crear tenant, settings, paginas, posts y bloques.
- Se subieron commits a `main` del CMS y del web starter.
- Se corrigio que `payload run` saliera silencioso, registrando scripts mediante `bin` en `payload.config.ts`.

## Lo que no quedo

- No quedo demostrado con evidencia real que el tenant `believe` tenga paginas creadas en la DB de produccion.
- No quedo demostrado que la tabla `settings` exista en la DB de produccion.
- No quedo demostrado que la web starter este leyendo correctamente contenido publicado de `believe`.
- No quedo hecho un smoke test real de punta a punta: CMS produccion -> API Payload -> frontend produccion.
- No quedo una pantalla final visible y funcional con bloques Flowbite para el usuario.

## Error principal

Se confundio "codigo implementado y pusheado" con "producto funcionando en produccion".

El problema real no era solo codigo. Tambien faltaba:

- Aplicar schema de Payload en Postgres.
- Verificar que Coolify estuviera desplegando el commit correcto.
- Ejecutar bootstrap contra la DB correcta.
- Confirmar via API que `pages/home` existe y esta publicado.
- Confirmar que el frontend consulta el tenant correcto.

## Error tecnico observado

El bootstrap fallo con:

```txt
relation "settings" does not exist
```

Eso significa que la coleccion `settings` existe en codigo, pero la tabla no existe en Postgres. Sin esa tabla, el seed no puede crear settings ni completar el contenido del tenant.

## Por que la web se ve basica

El web starter tiene fallback cuando no encuentra una pagina publicada con slug `home`.

Si Payload no devuelve:

```txt
pages where slug = home, tenant = believe, _status = published
```

entonces el frontend muestra el HTML basico de "sitio pendiente de contenido".

## Que debio hacerse antes de decir "listo"

1. Verificar commit desplegado en Coolify.
2. Verificar `PAYLOAD_DB_PUSH=true` o aplicar migraciones reales.
3. Confirmar que la tabla `settings` existe en Postgres.
4. Ejecutar bootstrap y ver logs de created/updated.
5. Consultar API:

```bash
curl "https://CMS_URL/api/pages?where[slug][equals]=home&where[tenant][slug][equals]=believe&depth=1"
```

6. Confirmar que devuelve bloques.
7. Abrir frontend y confirmar que renderiza bloques Flowbite.

## Estado honesto

No esta entregado.

Hay codigo avanzado en `main`, pero no hay confirmacion de que el producto este funcionando end-to-end en produccion.

## Siguiente accion real

La siguiente accion no debe ser mas prometer. Debe ser diagnostico con evidencia:

- Revisar DB/schema en produccion.
- Confirmar si `settings` existe.
- Si no existe, aplicar schema push o migracion.
- Ejecutar bootstrap.
- Verificar API.
- Verificar web.

