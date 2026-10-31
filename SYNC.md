# Sincronización PRO

`pro-sync.json` registra los archivos comunes y sus SHA-256 al sincronizar Sites y GitHub. Los adaptadores de plataforma quedan fuera. `node scripts/check-pro-sync.mjs` enumera cambios desde la última sincronización.

La comprobación automática compara ambos lados con esa base: propaga cambios de un solo lado, detiene conflictos y valida antes de publicar. Se conserva la privacidad actual de Sites. No se copian datos de usuarios, credenciales, PDF personales ni estado de bases de datos al repositorio.

Las copias JSON siguen disponibles para perfil, historial y sesión AIA. Como prueba piloto autorizada, Flauta PRO permite también conectar GitHub Pages con la cuenta de Sites desde Profesor. La ventana privada /sync requiere aprobación explícita de los perfiles, verifica origen, ventana y un identificador aleatorio por conexión, y usa los endpoints de copia autenticados de Sites. No se cambia la audiencia ni se envían credenciales a GitHub.

La conexión combina registros al guardar y cada 15 segundos, conserva fechas y las versiones más recientes del perfil/sesión, y nunca reemplaza el almacén completo. El progreso local continúa sin red; se reintenta al recuperar conexión mientras la ventana siga abierta. Cerrar, recargar o perder la ventana requiere conectar de nuevo; no es una sincronización permanente en segundo plano. Los PDF, imágenes y grabaciones siguen fuera. Si el inicio de sesión separa las ventanas, cerrar la ventana de conexión y volver a abrirla desde GitHub una vez autenticado.

La tarea horaria sincroniza SOLO código; no debe copiar datos personales, iniciar conexiones en nombre del usuario ni retirar esta función autorizada. Mantener app/sync/page.tsx solo en Sites y lib/platform.ts adaptado a cada plataforma. No ampliar el piloto a otras aplicaciones hasta validar el recorrido real en ambas plataformas y dos dispositivos.

Validación: node --experimental-strip-types --test tests/sync.test.mjs; en GitHub además npm run check && npm test && npm run build:pages. La prueba automatizada comprueba orígenes/ventanas/tokens, fusión, fechas, duplicados, escrituras concurrentes y recuperación tras fallo. La comprobación real de ventanas y sesión debe hacerse aparte.
