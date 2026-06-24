# Rediseño Estructural y Animación 3D del iPhone en la Sección Manifiesto

El objetivo es transformar la sección del Manifiesto actual en un layout dividido (dos columnas), retirando la marca de agua tipográfica y agregando un elaborado iPhone en puro CSS con perspectiva 3D, sombras realistas y un feed de Instagram con scroll automático infinito.

## User Review Required

> [!IMPORTANT]
> - **Contenido del Feed:** Voy a generar estructuras simuladas de publicaciones de Instagram (cabecera con avatar, foto principal cuadrada, e íconos de "Me gusta/Comentario" debajo). Estas piezas utilizarán colores de la marca (#DE075D y grises) como *placeholders* hasta que decidas reemplazarlas por imágenes reales. ¿Estás de acuerdo con este enfoque temporal?
> - **Entrada Animada:** Crearé una nueva clase `.scroll-reveal-right` para que el iPhone emerja desde la derecha de forma suave y sofisticada a medida que se hace scroll, diferenciándose del texto que emergerá desde abajo.

## Proposed Changes

### 1. `index.html`

Se reemplazará la estructura actual de la sección `#manifiesto` por una nueva cuadrícula (`.manifiesto-grid`).
- **[DELETE]** El `div.watermark-bg` con la palabra COMUNICACIÓN.
- **[MODIFY]** El contenedor de texto (`.manifiesto-content`), que ahora incluirá las clases para alinearse a la izquierda.
- **[NEW]** Se añadirá el bloque `.manifiesto-visual` en la columna derecha, que contendrá la estructura HTML pura del iPhone: bordes (`.iphone-mockup`), la "isla dinámica" (`.iphone-notch`), la pantalla (`.iphone-screen`), la sombra base (`.iphone-shadow`) y el carrusel infinito del feed de Instagram (`.ig-feed` con múltiples `.ig-post`).

### 2. `style.css`

Se eliminarán los estilos asociados a la antigua marca de agua y los centrados absolutos, y se inyectarán las siguientes propiedades:

- **Layout Grid**: CSS Grid para distribuir 1fr y 1fr en escritorio, alineado verticalmente al centro.
- **Columna Izquierda (Texto)**: `text-align: left; max-width: 500px;` para que no invada la pantalla.
- **Columna Derecha (iPhone CSS)**:
  - Construcción del teléfono mediante bordes gruesos (`border: 14px solid #111`), esquinas muy redondeadas (`border-radius: 45px`) y la isla dinámica en la parte superior.
  - Transformación 3D: `transform: perspective(1500px) rotateY(-20deg) rotateX(10deg) rotateZ(5deg); transform-style: preserve-3d;`
  - Sombra arrojada: Un div en la base con `filter: blur(25px);` y un degradado oscuro que se proyecte en el suelo.
- **Feed Animado**: Se creará una secuencia de bloques `.ig-post` dentro de un contenedor `.ig-feed` con una animación de fotogramas clave `@keyframes scrollFeed` que mueva el bloque en el eje Y de 0% a -50% (creando un loop perfecto e infinito simulando el scroll).
- **Animaciones de entrada**: Configuración de `transform: translateX(100px); opacity: 0;` en estado inicial, pasando a su posición original al recibir la clase de interjección del Observer.
- **Responsive (Mobile)**: El grid pasará a 1 columna. Los textos se mantendrán a la izquierda y el teléfono se centrará debajo, reduciendo su escala con `transform: scale(0.8)` o reduciendo sus medidas absolutas para que quepa bien sin generar *scroll* horizontal, y asegurando con márgenes que no choque con la sección "Todo para construir marcas".

### 3. `script.js`

- **[MODIFY]** Se ajustará el `IntersectionObserver` que actualmente gestiona la clase `.scroll-reveal`. Agregaremos soporte para la nueva clase `.scroll-reveal-right` que controlará el deslizamiento del iPhone desde el lado derecho, asegurando que se integre con la lógica de intersección ya existente en el sitio.

---

## Verification Plan

### Manual Verification
1. Hacer scroll en la página hasta la sección del manifiesto y observar que el texto (izquierda) y el teléfono (derecha) se revelan fluidamente en la pantalla.
2. Confirmar que no exista la palabra gigante "COMUNICACIÓN" en el fondo.
3. Verificar que el teléfono mantenga una correcta inclinación 3D, con sus sombras respetando la perspectiva y que el contenido del teléfono suba de forma ininterrumpida.
4. Abrir la consola de desarrollador en modo dispositivo móvil y comprobar que el texto quede primero (arriba) alineado a la izquierda, y el teléfono quede centrado abajo, sin desbordar la pantalla en ancho y sin pisarse con la sección inferior.
