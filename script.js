document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DEL PRELOADER ---
    const preloader = document.getElementById('preloader');
    
    // Limpia el estado al salir o recargar para asegurar que se ejecute obligatoriamente en F5
    window.addEventListener('beforeunload', () => {
        sessionStorage.removeItem('preloaderShown');
    });

    if (preloader) {
        if (!sessionStorage.getItem('preloaderShown')) {
            sessionStorage.setItem('preloaderShown', 'true');
            const preloaderText = preloader.querySelector('.preloader-text');
            
            setTimeout(() => {
                // 1. Entra el texto
                preloaderText.classList.add('step-1');
                
                setTimeout(() => {
                    // 2. Sale el texto hacia arriba
                    preloaderText.classList.add('step-2');
                    
                    setTimeout(() => {
                        // 3. Se divide el fondo
                        preloader.classList.add('split');
                        document.body.classList.add('start-hero-animation'); // Activa la animación del hero
                        
                        setTimeout(() => {
                            // 4. Se oculta por completo
                            preloader.classList.add('hidden');
                        }, 800);
                    }, 800);
                }, 2000);
            }, 100);
        } else {
            // Ya se mostró en esta sesión, ocultarlo inmediatamente
            preloader.classList.add('hidden');
            document.body.classList.add('start-hero-animation');
        }
    } else {
        document.body.classList.add('start-hero-animation');
    }

    // --- LÓGICA DEL MENÚ MÓVIL ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('a');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open', mainNav.classList.contains('active'));
            
            // Alternar icono de hamburguesa a cruz
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons(); // Refrescar iconos
        });

        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
                const icon = menuToggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    const mainTitle = document.querySelector('.hero h1');
    
    if (mainTitle) {
        const text = mainTitle.innerText;
        mainTitle.innerHTML = '';
        
        const words = text.split(' ');
        
        words.forEach((word, index) => {
            // Contenedor estricto con overflow:hidden
            const container = document.createElement('span');
            container.classList.add('word-container');
            
            if (index >= 4) {
                container.classList.add('highlight');
            }

            // Limpieza de caracteres especiales para coincidencia robusta
            const cleanWord = word.toLowerCase().replace(/[^a-zñáéíóú]/g, '');

            if (cleanWord === 'marcas') {
                // Instanciamos el contenedor del Rotador (Máscara)
                const rotatorContainer = document.createElement('span');
                rotatorContainer.classList.add('word', 'word-rotator');
                rotatorContainer.style.transitionDelay = `${index * 0.1}s`;

                // Añadimos el fantasma para mantener el ancho estable del layout
                const ghost = document.createElement('span');
                ghost.classList.add('rotator-ghost');
                ghost.innerText = 'empresas'; // Word de ancho máximo para reservar el espacio
                rotatorContainer.appendChild(ghost);

                // Instanciamos la lista vertical
                const listContainer = document.createElement('span');
                listContainer.classList.add('rotator-list');

                // Lista de palabras con la primera duplicada al final para bucle invisible
                const rotatingWords = ['marcas', 'empresas', 'negocios', 'marcas'];

                rotatingWords.forEach((rotWord) => {
                    const wordSpan = document.createElement('span');
                    wordSpan.classList.add('rotator-word');
                    wordSpan.innerText = rotWord;
                    listContainer.appendChild(wordSpan);
                });

                rotatorContainer.appendChild(listContainer);
                container.appendChild(rotatorContainer);
                mainTitle.appendChild(container);
            } else {
                // Palabra normal
                const wordSpan = document.createElement('span');
                wordSpan.classList.add('word');
                wordSpan.innerText = word;
                
                // Delay escalonado
                wordSpan.style.transitionDelay = `${index * 0.1}s`;
                
                container.appendChild(wordSpan);
                mainTitle.appendChild(container);
            }
        });

        // Intersection Observer Estricto
        const observerOptions = {
            threshold: 0.5
        };

        const h1Observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const words = entry.target.querySelectorAll('.word');
                if (entry.isIntersecting) {
                    // Al entrar: se añade la clase .active
                    words.forEach(w => w.classList.add('active'));
                } else {
                    // Al salir: se quita la clase .active para que bajen rápido
                    words.forEach(w => w.classList.remove('active'));
                }
            });
        }, observerOptions);

        h1Observer.observe(mainTitle);
    }

    // Animación de revelación al hacer scroll (Scroll Reveal)
    const observerOptions = {
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translate(0) scale(1)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    document.querySelectorAll('.scroll-reveal-right').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(100px) scale(0.9)';
        el.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    // ── SCROLL SCRUB: SECUENCIA DE FRAMES ──────────────────────────────────────
    const scrubSection = document.querySelector('.scroll-scrub-section');
    const canvas = document.getElementById('scrubCanvas');
    const ctx = canvas?.getContext('2d');
    const progressBar = document.querySelector('.scroll-scrub-progress-bar');

    // Skip scroll scrub on mobile
    if (window.innerWidth <= 768) {
        // canvas already hidden via CSS, just disable JS
    } else {

    const TOTAL_FRAMES = 300;
    const FRAME_BASE = 'asset/img/Secuencia posteo/SC-01_';

    const frames = [];
    let framesLoaded = 0;
    let currentFrameIdx = -1;
    let animating = false;
    let imgNaturalW = 0;
    let imgNaturalH = 0;

    function padNum(n) {
        return String(999 + n);
    }

    function resizeCanvas() {
        if (!canvas) return;
        const container = canvas.parentElement;
        const containerW = container.clientWidth;
        const containerH = container.clientHeight;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.round(containerW * dpr);
        canvas.height = Math.round(containerH * dpr);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    function drawFrame(index) {
        if (!ctx || !frames[index]) return;
        if (index === currentFrameIdx) return;
        currentFrameIdx = index;

        const img = frames[index];
        if (!img.complete || !img.naturalWidth) return;

        if (!imgNaturalW) {
            imgNaturalW = img.naturalWidth;
            imgNaturalH = img.naturalHeight;
            resizeCanvas();
        }

        const container = canvas.parentElement;
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        const scale = Math.min(cw / iw, ch / ih);
        const destW = iw * scale;
        const destH = ih * scale;
        const destX = (cw - destW) / 2;
        const destY = ch - destH;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, iw, ih, destX, destY, destW, destH);
    }

    function updateScrub() {
        if (!scrubSection) { animating = false; return; }

        const rect = scrubSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionHeight = scrubSection.offsetHeight;
        const scrollable = sectionHeight - windowHeight;

        const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
        }

        const frameIndex = Math.round(progress * (TOTAL_FRAMES - 1));
        drawFrame(frameIndex);

        // Text-reveal
        const textWrappers = scrubSection.querySelectorAll('.text-reveal-wrapper > *');
        textWrappers.forEach((el, i) => {
            const textProgress = Math.min(1, Math.max(0, (progress - 0.05 - i * 0.1) / 0.3));
            el.style.transform = `translateY(${(1 - textProgress) * 40}px)`;
            el.style.opacity = textProgress;
        });

        animating = false;
    }

    function onScrubScroll() {
        if (!animating) {
            animating = true;
            requestAnimationFrame(updateScrub);
        }
    }

    // Preload frames in batches
        let loadIdx = 0;
    function loadNextBatch() {
        const batchSize = 20;
        let loaded = 0;
        while (loadIdx < TOTAL_FRAMES && loaded < batchSize) {
            const img = new Image();
            img.src = FRAME_BASE + padNum(loadIdx + 1) + '.webp';
            img.onload = () => {
                framesLoaded++;
                if (framesLoaded === 1) {
                    imgNaturalW = img.naturalWidth;
                    imgNaturalH = img.naturalHeight;
                    resizeCanvas();
                    drawFrame(0);
                }
            };
            frames.push(img);
            loadIdx++;
            loaded++;
        }
        if (loadIdx < TOTAL_FRAMES) {
            setTimeout(loadNextBatch, 50);
        }
    }
    loadNextBatch();

    window.addEventListener('scroll', onScrubScroll, { passive: true });
    window.addEventListener('resize', () => {
        resizeCanvas();
        onScrubScroll();
    }, { passive: true });

    updateScrub();
    }

    // --- BASE DE DATOS LOCAL PARA MODALES DINÁMICOS ---
    const modalData = {
        // Proyectos
        'dia-de-compras': {
            tag: 'Ecosistema Digital & Campaña',
            title: 'Día de Compras',
            gradient: 'linear-gradient(135deg, #DE075D 0%, #7B0035 100%)',
            icon: 'shopping-bag',
            client: 'Grupo Comercial Uruguayo',
            services: 'Campaña integral de comunicación, diseño de landing page, gestión de pauta en Meta Ads y WhatsApp marketing.',
            team: 'Pigmento Team (Estrategia, Diseño & Copywriting)',
            date: 'Octubre 2025',
            desc: `
                <p><strong>El Desafío:</strong> El comercio minorista local enfrentaba una fuerte competencia de plataformas online extranjeras. La asociación de comerciantes necesitaba una acción rápida y coordinada para motivar a los vecinos a comprar en su zona, revalorizando el trato cercano y el impacto positivo en la comunidad.</p>
                
                <h3>Nuestra Estrategia</h3>
                <p>En Pigmento creímos que la solución no pasaba únicamente por gritar descuentos. Diseñamos un relato basado en la <strong>identidad y pertenencia</strong>: "El barrio crece cuando compramos en el barrio". Establecimos un ecosistema de comunicación integrado en tres niveles:</p>
                <ul>
                    <li><strong>Campaña Creativa:</strong> Concepto "Día de Compras" con piezas de vía pública, afiches físicos para comercios y plantillas digitales de alta identidad.</li>
                    <li><strong>Ecosistema Digital:</strong> Creación de una landing page optimizada donde el vecino podía escanear un código QR en el comercio adherido y participar instantáneamente en sorteos de órdenes de compra.</li>
                    <li><strong>Optimización de Conversión:</strong> Automatización de WhatsApp Business para responder al instante con las bases y condiciones e incentivar la segunda compra.</li>
                </ul>
                
                <h3>Resultados Impactantes</h3>
                <p>La pauta digital en Meta Ads y las activaciones físicas lograron una tasa de conversión superior a las expectativas del cliente:</p>
                <ul>
                    <li><strong>+120 comercios</strong> adheridos activamente en toda la zona.</li>
                    <li><strong>+15.000 registros</strong> únicos de cupones digitales en la landing page durante el fin de semana del evento.</li>
                    <li><strong>+45% de aumento</strong> en la tasa de consultas por WhatsApp de los comercios locales.</li>
                    <li>Consistencia visual del 100% que generó recordación y felicitaciones formales de la Cámara de Comercio.</li>
                </ul>
            `
        },

        'ecosistema-alpha': {
            tag: 'Estrategia & Comunicación',
            title: 'Ecosistema Alpha',
            gradient: 'linear-gradient(135deg, #4F4F4F 0%, #2A2A2A 100%)',
            icon: 'compass',
            client: 'Alpha Consultores Globales',
            services: 'Diagnóstico de comunicación institucional, manual de marca corporativa, desarrollo de narrativa y arquitectura web.',
            team: 'Pigmento Team (Estrategia, UX Writing & Desarrollo)',
            date: 'Marzo 2026',
            desc: `
                <p><strong>El Desafío:</strong> Una consultora de negocios con presencia regional presentaba una comunicación sumamente técnica, fría y dispersa en sus canales. Los clientes potenciales no lograban discernir claramente el alcance real de sus servicios ni la propuesta de valor diferencial respecto a las consultoras multinacionales.</p>
                
                <h3>Nuestra Estrategia</h3>
                <p>Pigmento comenzó por un <strong>diagnóstico profundo</strong>. Entendimos que no se trataba de rediseñar un logotipo, sino de ordenar y estructurar la narrativa interna y externa para generar dirección y sentido comercial:</p>
                <ul>
                    <li><strong>Narrativa e Identidad:</strong> Creamos una guía de tono e identidad verbal, sustituyendo el vocabulario excesivamente burocrático por un lenguaje de acción centrado en el cliente y en la co-creación de soluciones.</li>
                    <li><strong>Estructuración de Servicios:</strong> Agrupamos más de 20 servicios complejos en 4 grandes pilares comerciales comprensibles y profesionales.</li>
                    <li><strong>Ecosistema Digital:</strong> Desarrollamos su nueva plataforma institucional, enfocándose en un recorrido de conversión claro (UX Writing) y una carga ultra veloz para dispositivos móviles.</li>
                </ul>
                
                <h3>Resultados Reales</h3>
                <p>El orden estratégico dio paso a una mejora comercial tangible desde el lanzamiento del nuevo ecosistema corporativo:</p>
                <ul>
                    <li><strong>+65% de incremento</strong> en el tiempo de permanencia de los usuarios en la sección "Nuestra metodología".</li>
                    <li>Aumento del <strong>35% en leads calificados</strong> (empresas con perfil ideal) capturados a través del formulario de propuesta comercial.</li>
                    <li>El equipo de ventas reporta un cierre de negocios más rápido, utilizando el sitio web como una herramienta interactiva de presentación de autoridad.</li>
                </ul>
            `
        },
        
        // Artículos
        'publicar-no-comunicar': {
            tag: 'Artículo • Comunicación',
            title: 'Publicar no es lo mismo que comunicar',
            gradient: 'linear-gradient(135deg, #DE075D 0%, #E50066 100%)',
            icon: 'message-square',
            client: 'Pigmento Editorial',
            services: 'Análisis de estrategia de contenidos y posicionamiento de marca.',
            team: 'Redacción Pigmento',
            date: '15 de Mayo, 2026',
            desc: `
                <p>Hoy en día existe una presión asfixiante sobre las marcas: estar en todos lados, publicar tres Reels diarios, enviar Newsletters semanales y subirse a cada tendencia efímera del algoritmo. Esta hiperactividad digital genera una ilusión reconfortante de que "estamos haciendo cosas". Pero la realidad suele ser diferente.</p>
                
                <p>Muchos feeds de Instagram están llenos de publicaciones impecables que, en el fondo, no dicen absolutamente nada. Son piezas visuales vacías de intención estratégica. Aquí radica la gran diferencia:</p>
                
                <h3>El Ruido vs. La Intención</h3>
                <p><strong>Publicar</strong> es un acto técnico de subir contenido al servidor. Es empujar bits hacia una pantalla. <strong>Comunicar</strong>, en cambio, es un proceso estratégico que conecta un mensaje claro con un público específico, con un propósito definido y a través del canal idóneo.</p>
                <p>Cuando publicás por cumplir, diluís tu identidad de marca. Confundís a tu audiencia. Gastás energía y recursos creativos sin rumbo comercial. En Pigmento creemos que cada pieza debe tener un <strong>para qué</strong>:</p>
                <ul>
                    <li>¿Este contenido refuerza la propuesta de valor única de mi marca?</li>
                    <li>¿Le está hablando al cliente ideal en el tono de voz correcto?</li>
                    <li>¿Trabaja activamente para lograr un objetivo de negocio (educar, capturar leads, vender, fidelizar)?</li>
                </ul>
                
                <h3>El Enfoque Pigmento</h3>
                <p>Nuestra recomendación es simple pero requiere valentía comercial: <strong>hacer menos, pero hacerlo con sentido y con intencionalidad</strong>. Es preferible realizar tres publicaciones semanales de alta densidad de valor, con un diseño pulido que represente fielmente tu ADN y copies que inicien conversaciones reales, que publicar diariamente plantillas genéricas de Canva que la gente deslizará sin registrar.</p>
                <p>No se trata de alimentar al algoritmo. Se trata de <strong>construir marcas memorables y ordenadas</strong> que las personas elijan no por cansancio, sino por convicción.</p>
            `
        },
        'diseno-intencion': {
            tag: 'Artículo • Diseño con Criterio',
            title: 'Por qué el diseño no empieza en una computadora',
            gradient: 'linear-gradient(135deg, #2F2F2F 0%, #4F4F4F 100%)',
            icon: 'palette',
            client: 'Pigmento Editorial',
            services: 'Reflexiones sobre procesos creativos y diseño gráfico estratégico.',
            team: 'Área de Diseño Pigmento',
            date: '10 de Mayo, 2026',
            desc: `
                <p>Hay un error común que cometen tanto los diseñadores principiantes como los clientes impacientes: abrir inmediatamente Illustrator o Figma apenas surge una idea. Pareciera que colocar vectores en una mesa de trabajo digital acelerará el proceso creativo. En realidad, suele sabotearlo.</p>
                
                <p>Cuando te sentás frente a la pantalla en blanco sin un rumbo claro, la computadora te limita. Te limita a las herramientas que dominás, a las fuentes que tenés instaladas y a los recursos rápidos que encontrás en internet. El diseño verdaderamente premium e intencional no se ejecuta con clics de mouse; se gesta con <strong>pensamiento crítico e investigación</strong>.</p>
                
                <h3>La Etapa Cero: Entender y Bocetar</h3>
                <p>En Pigmento, nuestro proceso creativo inicia lejos de la pantalla:</p>
                <ul>
                    <li><strong>Diagnóstico profundo:</strong> Entendemos el negocio del cliente, sus debilidades, su competencia y la psicología de su consumidor.</li>
                    <li><strong>Definición del Concepto Rector:</strong> ¿Qué debe transmitir visualmente esta marca? ¿Es cercanía, disrupción, rigor técnico, lujo o minimalismo?</li>
                    <li><strong>Bocetado a mano y mapas de ideas:</strong> Dibujar con lápiz y papel libera la mente. Nos permite fallar rápido, explorar proporciones asimétricas y conectar conceptos verbales con metáforas visuales de forma fluida y orgánica.</li>
                </ul>
                
                <h3>La Computadora es Solo una Herramienta</h3>
                <p>Una tipografía fuerte o una paleta de color vibrante no son estéticas azarosas. En Pigmento, cada decisión tiene fundamentos estratégicos. El color magenta de nuestro sistema, por ejemplo, fue elegido científicamente por su altísima vibración cromática y su capacidad para energizar mensajes corporativos en ambientes saturados de grises.</p>
                <p>Cuando finalmente abrimos la computadora, el diseño ya está prácticamente resuelto en el papel. El software de diseño es simplemente un <strong>traductor técnico</strong> para pulir, espaciar (kerning editorial), vectorizar y dar terminaciones hiperprofesionales a una idea que ya tiene solidez intelectual.</p>
                <p>Diseñar con intención es asegurarnos de que <strong>cada elemento visual en pantalla sepa justificar su existencia</strong> al servicio de los objetivos comerciales y de marca de nuestros clientes.</p>
            `
        },
        'web-landing-ecosistema': {
            tag: 'Artículo • Desarrollo Web',
            title: '¿Web, Landing o Ecosistema Digital?',
            gradient: 'linear-gradient(135deg, #DE075D 0%, #2F2F2F 100%)',
            icon: 'layout',
            client: 'Pigmento Editorial',
            services: 'Consultoría y planeación de infraestructura web.',
            team: 'Área Tecnológica Pigmento',
            date: '05 de Mayo, 2026',
            desc: `
                <p>Cuando una empresa decide mejorar su presencia en internet, la solicitud por defecto suele ser: "necesito una página web". Sin embargo, esta frase genérica puede englobar soluciones técnicas y arquitecturas de información abismalmente diferentes.</p>
                
                <p>Elegir la estructura incorrecta suele traducirse en frustración: una landing page excesivamente larga que confunde al visitante, o un sitio institucional pesado de 15 páginas donde los usuarios jamás encuentran el formulario de contacto. Miremos cómo identificar la herramienta adecuada según tus metas actuales:</p>
                
                <h3>1. La Landing Page (Página de Aterrizaje)</h3>
                <p>Es una página única, hiper-enfocada y libre de menús de navegación distractores. Tiene <strong>un único objetivo de conversión</strong> (ej: registrarse a un evento, comprar un producto único o descargar una guía).</p>
                <p><strong>Cuándo usarla:</strong> Si vas a realizar una campaña publicitaria de pago (Meta Ads, Google Ads) centrada en un producto o servicio muy específico. Cada elemento de la landing trabaja para convencer al usuario de realizar esa sola acción.</p>
                
                <h3>2. El Sitio Web Institucional</h3>
                <p>Es un mapa estructurado de múltiples páginas (Inicio, Nosotros, Servicios, Contacto). Su objetivo es <strong>validar confianza, estructurar la oferta completa y educar</strong> al usuario sobre la solidez de la marca.</p>
                <p><strong>Cuándo usarlo:</strong> Cuando tu empresa ya cuenta con tracción y los clientes potenciales te buscan orgánicamente para validar quién sos, qué hacés y con qué seriedad trabajás antes de entablar un contacto comercial.</p>
                
                <h3>3. El Ecosistema Digital</h3>
                <p>Es la integración armoniosa de tu sitio institucional con landings de campaña, herramientas de analítica avanzada (Tag Manager, GA4), integraciones directas con CRM, catálogos en WhatsApp, píxeles de conversión y automatizaciones de correo.</p>
                <p><strong>Cuándo usarlo:</strong> Si buscás que internet sea un motor de crecimiento comercial predecible y medible para tu negocio en constante evolución, conectando tus campañas de publicidad de forma directa con tus flujos de venta internos.</p>
                
                <p>En Pigmento no desarrollamos por el simple hecho de programar código. <strong>Diseñamos la arquitectura de información que tu negocio necesita hoy</strong>, asegurando un rendimiento veloz, un UX Writing claro y el sentido comercial necesario para que tu inversión digital rinda frutos.</p>
            `
        },
        // Servicios Fieles a INDEX.rtf
        'estrategia-comunicacion': {
            tag: 'Servicio • Estrategia',
            title: 'Estrategia de comunicación',
            gradient: 'linear-gradient(135deg, #DE075D 0%, #E50066 100%)',
            icon: 'compass',
            client: 'Empresas e Instituciones',
            services: 'Auditoría de marca, diagnóstico estratégico, posicionamiento, manual de tono y narrativa estratégica.',
            team: 'Dirección de Estrategia & Copywriting',
            date: 'Servicio Activo',
            desc: `
                <p><strong>El Desafío:</strong> Muchas marcas comunican de forma reactiva y desorganizada, publicando sin dirección. La falta de foco estratégico desorienta al público y diluye la inversión comercial.</p>
                
                <h3>Nuestro Enfoque</h3>
                <p>En Pigmento ordenamos el mensaje de tu marca para que cada canal trabaje con sentido, coherencia y un rumbo comercial claro. Planificamos desde la intención:</p>
                <ul>
                    <li><strong>Diagnóstico profundo:</strong> Analizamos la comunicación actual del negocio frente a su competencia y oportunidades de mercado.</li>
                    <li><strong>Manual de Identidad Verbal:</strong> Definimos un tono, una voz y una narrativa consistentes para humanizar la marca y posicionarla con autoridad.</li>
                    <li><strong>Estrategia de Canales:</strong> Trazamos la hoja de ruta de contenidos y mensajes idóneos para conectar con tu cliente ideal de manera efectiva.</li>
                </ul>
                
                <h3>Entregables Clave</h3>
                <ul>
                    <li>Auditoría y Diagnóstico de Comunicación.</li>
                    <li>Manual de Tono, Voz y Mensajes Clave.</li>
                    <li>Planificación Anual Integrada y Estrategia de Medios.</li>
                </ul>
            `
        },
        'identidad-visual-diseno': {
            tag: 'Servicio • Diseño con Criterio',
            title: 'Identidad visual y diseño gráfico',
            gradient: 'linear-gradient(135deg, #2F2F2F 0%, #1A1A1A 100%)',
            icon: 'palette',
            client: 'Marcas con Proyección',
            services: 'Diseño de logotipos, sistemas de identidad, manual de marca, diseño de empaques (packaging) y dirección de arte.',
            team: 'Dirección de Arte & Diseño Visual',
            date: 'Servicio Activo',
            desc: `
                <p><strong>El Desafío:</strong> El diseño genérico invisibiliza tu marca. Un logotipo suelto no basta; sin un sistema visual coherente y profesional, la marca pierde recordación y consistencia.</p>
                
                <h3>Nuestro Enfoque</h3>
                <p>Diseñamos sistemas visuales pensados para que tu marca sea reconocible al instante, transmitiendo profesionalismo, solidez y diferenciación real:</p>
                <ul>
                    <li><strong>Investigación Conceptual:</strong> Bocetamos ideas con criterio y sustento estratégico antes de encender una computadora.</li>
                    <li><strong>Sistema de Marca:</strong> Creamos una arquitectura gráfica completa: tipografías corporativas, colores institucionales y recursos visuales propios.</li>
                    <li><strong>Diseño de Soportes:</strong> Traducimos la identidad a piezas clave como papelería, folletos, empaques o presentaciones institucionales.</li>
                </ul>
                
                <h3>Entregables Clave</h3>
                <ul>
                    <li>Logotipo Principal, Variantes y Reducciones.</li>
                    <li>Manual Completo de Normas Visuales y Aplicaciones.</li>
                    <li>Diseño de Packaging o Papelería Corporativa Premium.</li>
                </ul>
            `
        },
        'redes-sociales': {
            tag: 'Servicio • Redes & Contenido',
            title: 'Redes sociales',
            gradient: 'linear-gradient(135deg, #DE075D 0%, #7B0035 100%)',
            icon: 'instagram',
            client: 'Presencia de Marca Activa',
            services: 'Estrategia de contenidos, diseño de cuadrículas, copywriting estratégico, filmación de Reels y reportes mensuales.',
            team: 'Social Media Manager & Diseñadores Gráficos',
            date: 'Servicio Activo',
            desc: `
                <p><strong>El Desafío:</strong> Estar por estar no sirve de nada. Publicar plantillas genéricas sin intención satura a la audiencia y daña la imagen institucional sin aportar valor comercial.</p>
                
                <h3>Nuestro Enfoque</h3>
                <p>Planificamos contenidos con intención, tono, diseño y objetivos claros. Hacemos menos, pero con alta calidad estética y densidad de valor:</p>
                <ul>
                    <li><strong>Planificación Mensual:</strong> Diseñamos pilares de contenido enfocados en educar, fidelizar, divertir e incentivar la conversión.</li>
                    <li><strong>Copywriting de Impacto:</strong> Escribimos textos pulidos que inician conversaciones reales con tu cliente ideal.</li>
                    <li><strong>Dirección de Arte Digital:</strong> Diseñamos carruseles limpios, portadas elegantes y grabamos videos interactivos que destacan en el feed.</li>
                </ul>
                
                <h3>Entregables Clave</h3>
                <ul>
                    <li>Calendario de Contenidos Mensual.</li>
                    <li>Diseño Gráfico de Posts, Reels e Historias.</li>
                    <li>Monitoreo Mensual y Análisis Táctico de Resultados.</li>
                </ul>
            `
        },
        'meta-ads-pauta': {
            tag: 'Servicio • Publicidad Digital',
            title: 'Meta Ads y pauta digital',
            gradient: 'linear-gradient(135deg, #4F4F4F 0%, #2A2A2A 100%)',
            icon: 'target',
            client: 'Marcas con Foco Comercial',
            services: 'Embudos de venta, segmentación de públicos, diseño de anuncios, redacción publicitaria e informes de ROI.',
            team: 'Media Buyer & Especialistas en Pauta',
            date: 'Servicio Activo',
            desc: `
                <p><strong>El Desafío:</strong> Invertir dinero en anuncios de forma azarosa suele generar un tráfico de baja calidad y ningún lead calificado. Los presupuestos se evaporan sin conversiones claras.</p>
                
                <h3>Nuestro Enfoque</h3>
                <p>Creamos campañas digitales con segmentación, seguimiento y optimización estricta de las métricas que impactan directamente en tu negocio:</p>
                <ul>
                    <li><strong>Estrategia de Embudos:</strong> Diseñamos campañas para cada etapa del usuario (descubrimiento, consideración, conversión y retención).</li>
                    <li><strong>Optimización Creativa:</strong> Probamos diferentes creativos, videos e ideas publicitarias para encontrar los anuncios más rentables.</li>
                    <li><strong>Métricas de Negocio:</strong> Nos enfocamos en el Costo de Adquisición (CAC) y el Retorno sobre la Inversion Publicitaria (ROAS).</li>
                </ul>
                
                <h3>Entregables Clave</h3>
                <ul>
                    <li>Configuración de Píxeles de Conversión y Cuenta Publicitaria.</li>
                    <li>Creación de Públicos Similares y Campañas de Retargeting.</li>
                    <li>Reporte de Resultados Mensual con Foco en Ventas/Contactos.</li>
                </ul>
            `
        },
        'campanas-publicitarias': {
            tag: 'Servicio • Campañas Creativas',
            title: 'Campañas publicitarias',
            gradient: 'linear-gradient(135deg, #DE075D 0%, #4F4F4F 100%)',
            icon: 'megaphone',
            client: 'Lanzamientos y Posicionamiento',
            services: 'Concepto creativo rector, guiones para spots, diseño de piezas 360 y adaptaciones multimedios.',
            team: 'Redactores Creativos, Directores de Arte & Copywriters',
            date: 'Servicio Activo',
            desc: `
                <p><strong>El Desafío:</strong> Los lanzamientos genéricos pasan desapercibidos en la marea del consumo actual. Las marcas necesitan conceptos potentes que rompan con el ruido ambiental.</p>
                
                <h3>Nuestro Enfoque</h3>
                <p>Desarrollamos conceptos creativos que emocionan, asombran y logran una altísima recordación de marca. Traducimos la estrategia a una idea potente:</p>
                <ul>
                    <li><strong>Idea Rectora Única:</strong> Creamos el concepto eje ("The Big Idea") sobre el cual girarán todas las piezas de comunicación.</li>
                    <li><strong>Campaña 360°:</strong> Diseñamos un sistema que funciona de forma integrada tanto en redes, web, vía pública, radio, TV o prensa.</li>
                    <li><strong>Narrativa Persuasiva:</strong> Redactamos guiones con fuerza emocional que cautivan al usuario y lo llaman a la acción.</li>
                </ul>
                
                <h3>Entregables Clave</h3>
                <ul>
                    <li>Dossier Creativo y Guiones Literarios/Técnicos.</li>
                    <li>Diseño de Arte y Piezas Gráficas Maestras.</li>
                    <li>Dirección Creativa durante la Producción y Lanzamiento.</li>
                </ul>
            `
        },
        'desarrollo-web': {
            tag: 'Servicio • Ecosistemas Web',
            title: 'Desarrollo web',
            gradient: 'linear-gradient(135deg, #2F2F2F 0%, #DE075D 100%)',
            icon: 'code',
            client: 'Presencia Digital Profesional',
            services: 'Diseño UX/UI, maquetación adaptativa, optimización de velocidad de carga, SEO técnico y conversión comercial.',
            team: 'UX/UI Designers & Programadores Frontend',
            date: 'Servicio Activo',
            desc: `
                <p><strong>El Desafío:</strong> Una web desordenada, confusa o que carga lento espanta a los clientes potenciales y destruye la credibilidad construida por la marca.</p>
                
                <h3>Nuestro Enfoque</h3>
                <p>Ordenamos la información y diseñamos sitios pensados para comunicar, convencer, convertir y posicionar con la máxima velocidad:</p>
                <ul>
                    <li><strong>Diseño de Experiencia (UX/UI):</strong> Creamos flujos de navegación limpios y claros donde el usuario encuentra lo que busca en tres clics.</li>
                    <li><strong>Maquetación Responsiva:</strong> Construimos webs optimizadas con precisión milimétrica para celulares, tablets y escritorios.</li>
                    <li><strong>Criterio Comercial:</strong> Redactamos copys persuasivos (UX Writing) y colocamos llamados a la acción (CTAs) estratégicos de alta conversión.</li>
                </ul>
                
                <h3>Entregables Clave</h3>
                <ul>
                    <li>Diseño UX/UI en Wireframes Interactivos de Alta Fidelidad.</li>
                    <li>Desarrollo de Sitio Corporativo o Landing Page Autoadministrable.</li>
                    <li>Optimización de Velocidad de Carga e Integración de Analítica.</li>
                </ul>
            `
        },
        'proyectos-integrales': {
            tag: 'Servicio • Consultoría 360°',
            title: 'Proyectos integrales',
            gradient: 'linear-gradient(135deg, #4F4F4F 0%, #1A1A1A 100%)',
            icon: 'layers',
            client: 'Transformación de Marca',
            services: 'Auditoría integral, reposicionamiento, diseño de identidad visual, desarrollo web institucional, redes sociales y campañas.',
            team: 'Pigmento Global Team (Estrategas, Diseñadores, Copywriters & Devs)',
            date: 'Servicio Activo',
            desc: `
                <p><strong>El Desafío:</strong> La desconexión entre marketing, diseño y web produce una marca fragmentada e incoherente, debilitando los resultados y desaprovechando oportunidades.</p>
                
                <h3>Nuestro Enfoque</h3>
                <p>Acompañamos procesos completos. Actuamos como un departamento de comunicación externo e integrado para ordenar todo el ecosistema de tu marca:</p>
                <ul>
                    <li><strong>Alineación Total:</strong> Integramos bajo un mismo propósito y criterio el diseño visual, el sitio web, las redes y las campañas.</li>
                    <li><strong>Gestión Profesional:</strong> Ahorrás tiempo al centralizar la interlocución en un único equipo multidisciplinario altamente calificado.</li>
                    <li><strong>Resultados Medibles:</strong> Conectamos la comunicación directamente con el crecimiento y la reputación comercial a largo plazo.</li>
                </ul>
                
                <h3>Entregables Clave</h3>
                <ul>
                    <li>Estrategia 360 de Reposicionamiento y Comunicación.</li>
                    <li>Ecosistema de Marca Unificado (Identidad, Web y Redes Sociales).</li>
                    <li>Consultoría Directiva Mensual y Monitoreo de ROI.</li>
                </ul>
            `
        }
    };

    // --- LÓGICA DEL MODAL DINÁMICO INMERSIVO ---
    const modal = document.getElementById('dynamic-modal');
    const modalContentTarget = document.getElementById('modal-content-target');
    const modalCloseBtn = modal?.querySelector('.modal-close-btn');
    const modalBackdrop = modal?.querySelector('.modal-backdrop');

    function openModal(id) {
        if (!modal || !modalContentTarget || !modalData[id]) return;

        const data = modalData[id];
        
        // Generar contenido dinámico
        modalContentTarget.innerHTML = `
            <div class="modal-visual-col">
                <div class="modal-hero-gradient" style="background: ${data.gradient};">
                    <i data-lucide="${data.icon}"></i>
                </div>
                <div class="modal-meta-card">
                    <div class="meta-group">
                        <h5>Cliente</h5>
                        <p>${data.client}</p>
                    </div>
                    <div class="meta-group">
                        <h5>Servicio / Entregables</h5>
                        <p>${data.services}</p>
                    </div>
                    <div class="meta-group">
                        <h5>Equipo involucrado</h5>
                        <p>${data.team}</p>
                    </div>
                    <div class="meta-group">
                        <h5>Fecha del Proyecto</h5>
                        <p>${data.date}</p>
                    </div>
                </div>
            </div>
            <div class="modal-desc-col">
                <span class="modal-tag">${data.tag}</span>
                <h2>${data.title}</h2>
                <div class="modal-body-text">
                    ${data.desc}
                </div>
                <div class="modal-action-row">
                    <a href="https://wa.me/59899123456" class="btn btn-solid btn-modal-cta">Quiero algo parecido para mi marca</a>
                </div>
            </div>
        `;

        // Re-crear iconos lucide inyectados
        lucide.createIcons();

        // Lock scroll & show
        document.body.classList.add('modal-open');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Escucha al CTA dentro del modal para cerrarlo y desplazar
        const modalCta = modalContentTarget.querySelector('.btn-modal-cta');
        if (modalCta) {
            modalCta.addEventListener('click', (e) => {
                closeModal();
                // Dejar que el comportamiento nativo de anclaje haga scroll tras cerrar
            });
        }
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        modal.setAttribute('aria-hidden', 'true');
    }

    // Interceptar clicks para proyectos, artículos y servicios
    document.addEventListener('click', (e) => {
        const projectBtn = e.target.closest('.btn-project-detail') || e.target.closest('.portfolio-item');
        if (projectBtn) {
            // Si el click fue en un botón interno del modal, evitar reabrir
            if (e.target.closest('.btn-modal-cta')) return;
            e.preventDefault();
            const projectId = projectBtn.getAttribute('data-project') || projectBtn.getAttribute('data-project-id');
            if (projectId) openModal(projectId);
            return;
        }

        const serviceBtn = e.target.closest('.btn-service-detail') || e.target.closest('.service-card');
        if (serviceBtn) {
            // Evitar interceptar clicks en botones internos de CTAs
            if (e.target.closest('.btn-modal-cta')) return;
            e.preventDefault();
            const serviceId = serviceBtn.getAttribute('data-service') || serviceBtn.getAttribute('data-service-id');
            if (serviceId) openModal(serviceId);
            return;
        }
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });



    // ── NUEVA LÓGICA: ABANICO SIMÉTRICO CON PROFUNDIDAD ──────────────────────
    const identidadWrapper = document.querySelector('.identidad-scroll-wrapper');
    const chamMain         = document.querySelector('.cham-main');
    const chamVariants     = document.querySelectorAll('.cham-variant');
    const animCards        = document.querySelectorAll('.anim-card');

    let mobileCardTargets = [];

    if (identidadWrapper && chamMain) {
        let targetProgress = 0;
        let smoothedProgress = 0;
        let animFrameId = null;

        function cacheMobileCardPositions() {
            const row = document.querySelector('.identidad-cards-row');
            const cards = document.querySelectorAll('.identidad-cards-row .about-item');
            if (cards.length !== 4 || !row) { mobileCardTargets = [0, 0, 0, 0]; return; }
            const prev = row.style.transform;
            row.style.transform = 'none';
            void row.offsetHeight;
            const vw = window.innerWidth;
            const targets = [];
            for (let i = 0; i < 4; i++) {
                const r = cards[i].getBoundingClientRect();
                targets[i] = vw / 2 - (r.left + r.width / 2);
            }
            row.style.transform = prev;
            mobileCardTargets = targets;
        }

        // ── Configuración de offsets por breakpoint para Desktop ─────────────
        function getFanConfig() {
            return {
                nearOffset : 178, // 148 * 1.20 ~ 178px
                farOffset  : 326, // 272 * 1.20 ~ 326px
                nearScale  : 0.80,
                farScale   : 0.63,
            };
        }

        function getVariantTargets(cfg, dir) {
            switch (dir) {
                case 'left-far':   return { tx: -cfg.farOffset,  sc: cfg.farScale  };
                case 'left-near':  return { tx: -cfg.nearOffset, sc: cfg.nearScale };
                case 'right-near': return { tx:  cfg.nearOffset, sc: cfg.nearScale };
                case 'right-far':  return { tx:  cfg.farOffset,  sc: cfg.farScale  };
                default:           return { tx: 0, sc: 1 };
            }
        }

        function lerp(a, b, t) {
            return a + (b - a) * Math.min(1, Math.max(0, t));
        }

        function easeOut(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function subProgress(progress, start, end) {
            if (progress <= start) return 0;
            if (progress >= end)   return 1;
            return (progress - start) / (end - start);
        }

        // ── Renderizado de estados responsivo con progreso suavizado ──────────
        function renderStates(progress) {
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                // --- LÓGICA MÓVIL: CAMALEÓN FIJO + CARDS AUTO-SLIDER ---
                // Camaleón principal siempre visible, variantes ocultas
                chamMain.style.opacity = '1';
                chamMain.style.transform = `translate3d(-50%, -50%, 0) scale(1)`;

                chamVariants.forEach((el) => {
                    el.style.opacity = '0';
                    el.style.transform = `translate3d(-50%, -50%, 0) scale(0.9)`;
                });
            } else {
                // --- LÓGICA ESCRITORIO (Control original intacto) ---

                // Limpiar estilos inline de móvil en camaleón principal
                chamMain.style.opacity = '';
                chamMain.style.transform = '';

                // Abanico simétrico con profundidad en eje X
                const cfg = getFanConfig();
                const progressA = easeOut(subProgress(progress, 0, 0.50));

                chamVariants.forEach((el) => {
                    const dir = el.getAttribute('data-dir');
                    const { tx, sc } = getVariantTargets(cfg, dir);

                    const currentTx = lerp(0, tx, progressA);
                    const currentSc = lerp(1, sc, progressA);
                    const currentOp = lerp(0, 1, progressA);

                    el.style.transform = `translateX(${currentTx}px) scale(${currentSc})`;
                    el.style.opacity   = currentOp;
                });

                // Resetear transformaciones del contenedor de carrusel móvil
                const cardsRow = document.querySelector('.identidad-cards-row');
                if (cardsRow) {
                    cardsRow.style.transform = '';
                }

                // Animación de entrada escalonada en vertical para tarjetas
                if (animCards.length > 0) {
                    animCards.forEach((card, index) => {
                        const staggerStart = 0.65 + index * 0.04;
                        const staggerEnd   = staggerStart + 0.18;
                        const pCard = easeOut(subProgress(progress, staggerStart, staggerEnd));

                        card.style.opacity   = pCard;
                        card.style.transform = `translateY(${lerp(30, 0, pCard)}px)`;
                        card.classList.remove('active'); // Limpiar estado activo de móvil
                    });
                }
            }
        }

        // ── Loop de Animación con requestAnimationFrame ──────────────────────
        function updateAnimation() {
            const diff = targetProgress - smoothedProgress;
            // Easing / amortiguación súper fluida
            if (Math.abs(diff) > 0.0001) {
                smoothedProgress = smoothedProgress + diff * 0.08; // Multiplicador calibrado para bumping/lag idóneo
                renderStates(smoothedProgress);
                animFrameId = requestAnimationFrame(updateAnimation);
            } else {
                smoothedProgress = targetProgress;
                renderStates(smoothedProgress);
                animFrameId = null;
            }
        }

        // ── Handler principal de scroll (unificado desktop/mobile) ───────────
        function onScroll() {
            const rect         = identidadWrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const totalScrollable = rect.height - windowHeight;
            const preStart     = Math.max(0, windowHeight * 0.10 - rect.top);
            const scrolled     = -rect.top + preStart;

            if (totalScrollable > 0) {
                targetProgress = Math.min(1, Math.max(0, scrolled / totalScrollable));
            } else {
                targetProgress = 0;
            }

            if (!animFrameId) {
                animFrameId = requestAnimationFrame(updateAnimation);
            }
        }

        // ── Recalcular en resize y scroll ────────────────────────────────────
        window.addEventListener('resize', () => {
            cacheMobileCardPositions();
            onScroll();
            if (animFrameId) {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
            }
            smoothedProgress = targetProgress;
            renderStates(targetProgress);
        }, { passive: true });
        
        window.addEventListener('scroll', onScroll, { passive: true });

        cacheMobileCardPositions();

        // Disparar una vez al cargar para establecer el estado inicial correcto
        onScroll();

        // Estado inicial para mobile: asegurar Main + Card 1 visibles
        if (window.innerWidth <= 768) {
            targetProgress = 0.06;
            smoothedProgress = 0.06;
            renderStates(smoothedProgress);
        }
    }

    // ── AUTO SLIDER: CARDS DE IDENTIDAD (MÓVIL) ──
    (function() {
        const cardsRow = document.querySelector('.identidad-cards-row');
        const cardElements = document.querySelectorAll('.identidad-cards-row .about-item');
        if (!cardsRow || cardElements.length !== 4) return;

        let currentIdx = 0;
        let autoTimer = null;
        let touchPaused = false;

        function goToCard(idx) {
            currentIdx = ((idx % cardElements.length) + cardElements.length) % cardElements.length;
            const tx = mobileCardTargets[currentIdx];
            if (tx !== undefined) {
                cardsRow.style.transform = `translateX(${tx}px)`;
            }
            cardElements.forEach((card, i) => {
                card.classList.toggle('active', i === currentIdx);
            });
        }

        function advanceCard() {
            if (touchPaused) return;
            goToCard(currentIdx + 1);
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoTimer = setInterval(advanceCard, 3500);
        }

        function stopAutoSlide() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        function pauseOnTouch() {
            touchPaused = true;
            stopAutoSlide();
        }

        function resumeOnTouch() {
            touchPaused = false;
            startAutoSlide();
        }

        cardsRow.addEventListener('touchstart', pauseOnTouch, { passive: true });
        cardsRow.addEventListener('touchend', resumeOnTouch, { passive: true });

        if (window.innerWidth <= 768) {
            goToCard(0);
            startAutoSlide();
        }
    })();

    // ── AUTO SLIDER: SERVICIOS DESTACADOS ──
    (function() {
        const wrapper = document.querySelector('.services-carousel-wrapper');
        const track = document.querySelector('.services-carousel');
        if (!wrapper || !track) return;

        const cards = track.querySelectorAll('.service-card');
        if (cards.length < 2) return;

        cards.forEach(c => track.appendChild(c.cloneNode(true)));

        const isMobile = window.innerWidth <= 768;
        let speed = isMobile ? 0.4 : 0.6;
        let paused = false;
        let rafId = null;
        let resumeTimer = null;

        function scroll() {
            if (!paused) {
                wrapper.scrollLeft += speed;
                if (wrapper.scrollLeft >= track.scrollWidth / 2) {
                    wrapper.scrollLeft = 0;
                }
                rafId = requestAnimationFrame(scroll);
            } else {
                rafId = null;
            }
        }

        function startScroll() {
            if (rafId) return;
            rafId = requestAnimationFrame(scroll);
        }

        function stopScroll() {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        function pauseScroll() {
            paused = true;
            stopScroll();
            if (resumeTimer) {
                clearTimeout(resumeTimer);
                resumeTimer = null;
            }
        }

        function resumeScroll() {
            if (resumeTimer) clearTimeout(resumeTimer);
            resumeTimer = setTimeout(() => {
                paused = false;
                startScroll();
                resumeTimer = null;
            }, isMobile ? 600 : 200);
        }

        wrapper.addEventListener('mouseenter', pauseScroll);
        wrapper.addEventListener('mouseleave', resumeScroll);
        wrapper.addEventListener('touchstart', pauseScroll, { passive: true });
        wrapper.addEventListener('touchend', resumeScroll, { passive: true });

        startScroll();
    })();

    // ── CONTROL DE VIDEO SCRUB MÓVIL ──
    (function() {
        const scrubVideo = document.querySelector('.scrub-mobile-video');
        if (!scrubVideo) return;
        let hasPlayed = false;

        // 1) Kickstart con primer toque del usuario (requerido en iOS)
        function kickstartVideo() {
            if (!hasPlayed && scrubVideo.paused) {
                scrubVideo.play().catch(() => {});
                hasPlayed = true;
            }
            document.removeEventListener('touchstart', kickstartVideo);
            document.removeEventListener('click', kickstartVideo);
        }
        document.addEventListener('touchstart', kickstartVideo, { passive: true });
        document.addEventListener('click', kickstartVideo);

        // 2) Pausar al salir de vista, reanudar al entrar
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (scrubVideo.paused && hasPlayed) {
                        scrubVideo.play().catch(() => {});
                    }
                } else if (hasPlayed) {
                    scrubVideo.pause();
                }
            });
        }, { threshold: 0.2 });
        videoObserver.observe(scrubVideo);
    })();

    // ── SOMOS ROTATOR ──
    (function() {
        const words = document.querySelectorAll('.somos-word');
        if (words.length < 2) return;
        let current = 0;

        setInterval(() => {
            words[current].classList.remove('active');
            current = (current + 1) % words.length;
            words[current].classList.add('active');
        }, 2200);
    })();

    // ── TESTIMONIOS VIDEO PLAYER ──
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.testimonio-card');
        if (!card) return;
        const video = card.querySelector('.testimonio-video');
        if (!video) return;
        if (video.paused) {
            video.play();
            card.classList.add('playing');
        } else {
            video.pause();
            card.classList.remove('playing');
        }
    });

});
