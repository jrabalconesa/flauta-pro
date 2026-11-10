# Sincronización PRO

`pro-sync.json` registra los archivos comunes y sus SHA-256 al sincronizar Sites y GitHub. Los adaptadores de plataforma quedan fuera. `node scripts/check-pro-sync.mjs` enumera cambios desde la última sincronización.

La comprobación automática compara ambos lados con esa base: propaga cambios de un solo lado, detiene conflictos y valida antes de publicar. Se conserva la privacidad actual de Sites. No se copian datos de usuarios, credenciales, PDF personales ni estado de bases de datos al repositorio.

Las copias JSON siguen disponibles para perfil, historial y sesión AIA. Como prueba piloto autorizada, Flauta PRO permite también conectar GitHub Pages con la cuenta de Sites desde Profesor. La ventana privada /sync requiere aprobación explícita de los perfiles, verifica origen, ventana y un identificador aleatorio por conexión, y usa los endpoints de copia autenticados de Sites. No se cambia la audiencia ni se envían credenciales a GitHub.

La conexión combina registros al guardar y cada 15 segundos, conserva fechas y las versiones más recientes del perfil/sesión, y nunca reemplaza el almacén completo. El progreso local continúa sin red; se reintenta al recuperar conexión mientras la ventana siga abierta. Cerrar, recargar o perder la ventana requiere conectar de nuevo; no es una sincronización permanente en segundo plano. Los PDF, imágenes y grabaciones siguen fuera. Si el inicio de sesión separa las ventanas, cerrar la ventana de conexión y volver a abrirla desde GitHub una vez autenticado.

La tarea horaria sincroniza SOLO código; no debe copiar datos personales, iniciar conexiones en nombre del usuario ni retirar esta función autorizada. Mantener app/sync/page.tsx solo en Sites y lib/platform.ts adaptado a cada plataforma. No ampliar el piloto a otras aplicaciones hasta validar el recorrido real en ambas plataformas y dos dispositivos.

Validación: node --experimental-strip-types --test tests/sync.test.mjs; en GitHub además npm run check && npm test && npm run build:pages. La prueba automatizada comprueba orígenes/ventanas/tokens, fusión, fechas, duplicados, escrituras concurrentes y recuperación tras fallo. La comprobación real de ventanas y sesión debe hacerse aparte.

## Código revisado en noviembre de 2026

La base contiene únicamente código común. `app/repertoire-library.tsx` es un adaptador: el catálogo personal completo y los nuevos documentos y audios permanecen en Sites privado; Pages abre esa biblioteca mediante un enlace. Las prácticas didácticas revisadas se ejecutan en ambas plataformas. `lib/platform.ts` conserva las rutas cloud/local y las grabaciones permanecen fuera de las copias JSON.

Las copias de versión 2 admiten varios perfiles y conservan los perfiles e instrumentos adicionales al importar una copia anterior o incompleta. El piloto de conexión sigue limitado a un único perfil principal en cada extremo; rechaza copias con otros usuarios antes del intercambio y verifica que los perfiles siguen siendo los aprobados. No se inicia ninguna conexión desde la tarea de código. La prueba real en dos dispositivos continúa pendiente.

El repertorio completo aún no está certificado musicalmente. Las piezas revisadas se identifican como tales sin certificar los MP3 históricos.

## Sincronización del 10 de noviembre de 2026

Se incorpora Marcha de los Santos, adaptación de estudio en SOL con cinco notas, y notación ligada para sonidos de 2,5 pulsos. Sites conserva la ficha PDF, los 19 MusicXML, 19 MIDI y 57 MP3 revisados. Pages incorpora la práctica y sus descargas generadas localmente. Las 26 bases comunes coinciden; no se copian los adaptadores privados ni datos personales. Validación: 51 pruebas Sites, 35 pruebas Pages, comprobación de tipos, compilaciones y verificación de 19 MusicXML/57 MP3. La práctica y su partitura se comprobaron también en Sites publicado en ordenador. Siguen pendientes la revisión musical completa, el iPad real y el piloto en dos dispositivos.
