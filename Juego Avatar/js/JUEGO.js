// ARCHIVO: juego.js (REEMPLAZAR COMPLETO)
// CLASE JUEGO - Sistema POO completo
class Juego {
    constructor() {
        this.personajes = [];
        this.jugador = null;
        this.enemigo = null;
        this.ataqueJugador = "";
        this.ataqueEnemigo = "";
        this.victorias = {
            zuko: false,
            katara: false,
            aang: false,
            toph: false
        };

        // Referencias a elementos DOM
        this.sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque');
        this.sectionSeleccionarPersonaje = document.getElementById('seleccionar-personaje');
        this.sectionReiniciar = document.getElementById('reiniciar');
        this.sectionMensajes = document.getElementById('mensajes');

        this.spanPersonajeJugador = document.getElementById('personaje-jugador');
        this.spanPersonajeEnemigo = document.getElementById('personaje-enemigo');
        this.spanVidasJugador = document.getElementById('vida-jugador');
        this.spanVidasEnemigo = document.getElementById('vida-enemigo');

        this.botonPersonajeJugador = document.getElementById('boton-personaje');
        this.botonPunio = document.getElementById("boton-punio");
        this.botonPatada = document.getElementById("boton-patada");
        this.botonBarrida = document.getElementById("boton-barrida");
        this.botonReiniciar = document.getElementById('boton-reiniciar');
        this.botonReglas = document.getElementById('boton-reglas');
        this.botonCerrarReglas = document.getElementById('cerrar-reglas');
        this.modalReglas = document.getElementById('modal-reglas');
        
        this.personajesContainer = document.getElementById('personajes-container');
    }

    iniciar() {
        // Inicializar personajes desde la nueva clase
        this.personajes = Personaje.crearTodosLosPersonajes();
        this.mostrarPersonajesEnPantalla();
        console.log("Personajes disponibles:", this.personajes.map(p => p.nombre));
        this.configurarEventListeners();
        this.ocultarSecciones();
        
        // Cargar progreso guardado
        this.cargarProgreso();
    }

    configurarEventListeners() {
        this.botonPersonajeJugador.addEventListener('click', () => this.seleccionarPersonajeJugador());
        this.botonPunio.addEventListener("click", () => this.elegirAtaque("Puño 🤜🏻"));
        this.botonPatada.addEventListener("click", () => this.elegirAtaque("Patada 🦵🏻"));
        this.botonBarrida.addEventListener("click", () => this.elegirAtaque("Barrida 🦶🏻"));
        this.botonReiniciar.addEventListener('click', () => this.reiniciar());
        this.botonReglas.addEventListener('click', () => this.mostrarReglas());
        this.botonCerrarReglas.addEventListener('click', () => this.cerrarReglas());

        window.addEventListener('click', (event) => {
            if (event.target === this.modalReglas) {
                this.modalReglas.style.display = 'none';
            }
        });
    }

    ocultarSecciones() {
        this.sectionSeleccionarAtaque.style.display = 'none';
        this.sectionReiniciar.style.display = 'none';
        this.sectionMensajes.style.display = 'none';
    }

    mostrarPersonajesEnPantalla() {
        this.personajesContainer.innerHTML = "";

        this.personajes.forEach(personaje => {
            if (personaje.esPrincipal || personaje.estaDesbloqueado) {
                const divPersonaje = document.createElement('div');
                divPersonaje.classList.add('personaje');
                
                const estaDisponible = personaje.estaDesbloqueado || personaje.esPrincipal;

                divPersonaje.innerHTML = `
                    <img src="${personaje.imagen}" alt="${personaje.nombre}" 
                         onerror="this.style.display='none'">
                    <br>
                    <input type="radio" name="personaje" id="${personaje.nombre.toLowerCase()}" 
                           ${estaDisponible ? '' : 'disabled'}>
                    <label for="${personaje.nombre.toLowerCase()}">
                        ${personaje.nombre}
                        ${!estaDisponible ? `<br><small>🔒 ${personaje.requisitoDesbloqueo}</small>` : ''}
                    </label>
                `;

                this.personajesContainer.appendChild(divPersonaje);
            }
        });
    }

    seleccionarPersonajeJugador() {
        const personajeSeleccionado = document.querySelector('input[name="personaje"]:checked');

        if (!personajeSeleccionado) {
            this.mostrarMensajeError('Por favor, selecciona un personaje☝️');
            return;
        }

        const idPersonaje = personajeSeleccionado.id;
        this.jugador = this.personajes.find(p => p.nombre.toLowerCase() === idPersonaje);

        this.spanPersonajeJugador.innerHTML = this.jugador.nombre;
        this.sectionSeleccionarAtaque.style.display = 'block';
        this.sectionSeleccionarPersonaje.style.display = 'none';

        this.seleccionarPersonajeEnemigo();

        const visualJugador = document.getElementById('jugador-visual');
        visualJugador.innerHTML = `<img src="${this.jugador.imagen}" alt="${this.jugador.nombre}">`;
        visualJugador.classList.remove('aparecer');
        setTimeout(() => {
            visualJugador.classList.add('aparecer');
        }, 100);
    }

    mostrarMensajeError(mensaje) {
        let mensajeError = document.createElement("p");
        mensajeError.innerHTML = mensaje;
        mensajeError.style.color = "red";
        this.sectionSeleccionarPersonaje.appendChild(mensajeError);

        setTimeout(() => {
            this.sectionSeleccionarPersonaje.removeChild(mensajeError);
        }, 2000);
    }

    seleccionarPersonajeEnemigo() {
        const personajesDisponibles = this.personajes.filter(p => p.esPrincipal && p.nombre !== this.jugador.nombre);
        const indiceAleatorio = Math.floor(Math.random() * personajesDisponibles.length);
        this.enemigo = personajesDisponibles[indiceAleatorio];
        this.enemigo.curar(); // Asegurar vida completa

        this.spanPersonajeEnemigo.innerHTML = this.enemigo.nombre;
        this.actualizarVidasEnDOM();

        const visualEnemigo = document.getElementById('enemigo-visual');
        visualEnemigo.innerHTML = `<img src="${this.enemigo.imagen}" alt="${this.enemigo.nombre}">`;
        visualEnemigo.classList.remove('aparecer');
        setTimeout(() => {
            visualEnemigo.classList.add('aparecer');
        }, 100);
    }

    elegirAtaque(ataque) {
        this.ataqueJugador = ataque;
        this.ataqueEnemigo = this.enemigo.atacar();
        this.combate();
    }

    // FUNCIÓN COMBATE CORREGIDA
    combate() {
        this.sectionMensajes.style.display = 'block';

        // Determinar resultado
        let resultado = this.determinarResultado();
        this.crearMensaje(resultado.mensaje);

        // Actualizar vidas
        if (resultado.ganador === "jugador") {
            this.enemigo.recibirDanio();
        } else if (resultado.ganador === "enemigo") {
            this.jugador.recibirDanio();
        }

        this.actualizarVidasEnDOM();
        this.mostrarEmojiResultado(resultado.ganador);
        this.revisarVidas(); // Mover esta llamada al final
    }

    determinarResultado() {
        if (this.ataqueEnemigo === this.ataqueJugador) {
            return { mensaje: "EMPATE", ganador: null };
        } else if (
            (this.ataqueJugador === "Puño 🤜🏻" && this.ataqueEnemigo === "Barrida 🦶🏻") ||
            (this.ataqueJugador === "Patada 🦵🏻" && this.ataqueEnemigo === "Puño 🤜🏻") ||
            (this.ataqueJugador === "Barrida 🦶🏻" && this.ataqueEnemigo === "Patada 🦵🏻")
        ) {
            return { mensaje: "GANASTE", ganador: "jugador" };
        } else {
            return { mensaje: "PERDISTE", ganador: "enemigo" };
        }
    }

    actualizarVidasEnDOM() {
        this.spanVidasJugador.innerHTML = this.jugador.vida;
        this.spanVidasEnemigo.innerHTML = this.enemigo.vida;
    }

    // FUNCIÓN REVISAR VIDAS CORREGIDA
    revisarVidas() {
        if (this.enemigo.vida === 0) {
            this.destacarGanador("jugador");
            this.crearMensajeFinal("🎉 Felicidades, ganaste el juego!");
            this.procesarVictoria();
        } else if (this.jugador.vida === 0) {
            this.destacarGanador("enemigo");
            this.crearMensajeFinal("😢 Perdiste, mejor suerte la próxima vez!");
        }
    }

    crearMensaje(resultado) {
        let mensajes = document.querySelector('#mensajes p');
        mensajes.innerHTML += `<br>Lanzaste ${this.ataqueJugador} vs ${this.ataqueEnemigo}: ${resultado}`;
    }

    crearMensajeFinal(resultadoFinal) {
        let mensajes = document.querySelector('#mensajes p');
        mensajes.innerHTML = resultadoFinal;

        this.botonPunio.disabled = true;
        this.botonPatada.disabled = true;
        this.botonBarrida.disabled = true;

        this.sectionReiniciar.style.display = 'block';
    }

    // FUNCIÓN MOSTRAR EMOJI RESULTADO CORREGIDA
    mostrarEmojiResultado(ganador) {
        const visualJugador = document.getElementById('jugador-visual');
        const visualEnemigo = document.getElementById('enemigo-visual');

        // Limpiar emojis anteriores
        visualJugador.querySelectorAll('.emoji-resultado').forEach(e => e.remove());
        visualEnemigo.querySelectorAll('.emoji-resultado').forEach(e => e.remove());

        // Solo mostrar emoji si hay un ganador (no en empate)
        if (ganador === "jugador") {
            visualJugador.innerHTML += `<div class="emoji-resultado">😄</div>`;
            visualEnemigo.innerHTML += `<div class="emoji-resultado">😢</div>`;
        } else if (ganador === "enemigo") {
            visualEnemigo.innerHTML += `<div class="emoji-resultado">😄</div>`;
            visualJugador.innerHTML += `<div class="emoji-resultado">😢</div>`;
        }
    }

    destacarGanador(ganador) {
        const visualJugador = document.getElementById('jugador-visual');
        const visualEnemigo = document.getElementById('enemigo-visual');

        if (ganador === "jugador") {
            visualJugador.classList.add("ganador-efecto-brillo");
            const emojiJugador = visualJugador.querySelector('.emoji-resultado');
            if (emojiJugador) emojiJugador.classList.add("ganador-emoji");
        } else if (ganador === "enemigo") {
            visualEnemigo.classList.add("ganador-efecto-brillo");
            const emojiEnemigo = visualEnemigo.querySelector('.emoji-resultado');
            if (emojiEnemigo) emojiEnemigo.classList.add("ganador-emoji");
        }
    }

    // NUEVAS FUNCIONES PARA SISTEMA DE DESBLOQUEO
    procesarVictoria() {
        // Registrar victoria
        this.registrarVictoria();
        
        // Verificar y aplicar desbloqueos
        this.verificarDesbloqueos();
    }

    registrarVictoria() {
        if (this.jugador) {
            const nombre = this.jugador.nombre.toLowerCase();
            if (nombre in this.victorias) {
                this.victorias[nombre] = true;
                console.log(`✅ Victoria registrada para: ${this.jugador.nombre}`);
            }
        }
    }

    verificarDesbloqueos() {
        let nuevosDesbloqueos = [];

        // Verificar cada condición de desbloqueo
        if (this.victorias.zuko) {
            const espirituAzul = this.personajes.find(p => p.nombre === 'El Espíritu Azul');
            if (espirituAzul && !espirituAzul.estaDesbloqueado) {
                espirituAzul.desbloquear();
                nuevosDesbloqueos.push('El Espíritu Azul');
            }
        }

        if (this.victorias.katara) {
            const kataraSangre = this.personajes.find(p => p.nombre === 'Katara Sangre Control');
            if (kataraSangre && !kataraSangre.estaDesbloqueado) {
                kataraSangre.desbloquear();
                nuevosDesbloqueos.push('Katara Sangre Control');
            }
        }

        if (this.victorias.aang) {
            const avatarRoku = this.personajes.find(p => p.nombre === 'Avatar Roku');
            if (avatarRoku && !avatarRoku.estaDesbloqueado) {
                avatarRoku.desbloquear();
                nuevosDesbloqueos.push('Avatar Roku');
            }

            const avatarKyoshi = this.personajes.find(p => p.nombre === 'Avatar Kyoshi');
            if (avatarKyoshi && !avatarKyoshi.estaDesbloqueado) {
                avatarKyoshi.desbloquear();
                nuevosDesbloqueos.push('Avatar Kyoshi');
            }
        }

        if (this.victorias.toph) {
            const tophCampeona = this.personajes.find(p => p.nombre === 'Toph Campeona Clandestina');
            if (tophCampeona && !tophCampeona.estaDesbloqueado) {
                tophCampeona.desbloquear();
                nuevosDesbloqueos.push('Toph Campeona Clandestina');
            }
        }

        // Verificar desbloqueo de Sokka Guerrero
        if (this.victorias.zuko && this.victorias.katara && this.victorias.aang && this.victorias.toph) {
            const sokkaGuerrero = this.personajes.find(p => p.nombre === 'Sokka Guerrero de la Espada');
            if (sokkaGuerrero && !sokkaGuerrero.estaDesbloqueado) {
                sokkaGuerrero.desbloquear();
                nuevosDesbloqueos.push('Sokka Guerrero de la Espada');
            }
        }

        // Mostrar mensajes de desbloqueo
        if (nuevosDesbloqueos.length > 0) {
            this.mostrarMensajeDesbloqueo(nuevosDesbloqueos);
            this.mostrarPersonajesEnPantalla(); // Actualizar lista de personajes
            this.guardarProgreso();
        }
    }

    mostrarMensajeDesbloqueo(desbloqueos) {
        const mensaje = document.createElement('div');
        mensaje.style.cssText = `
            background: rgba(0,255,0,0.2);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 10px;
            margin: 10px 0;
            color: #00ff00;
            font-weight: bold;
        `;
        mensaje.innerHTML = `
            <h3>🎊 ¡Nuevos Personajes Desbloqueados!</h3>
            <ul>
                ${desbloqueos.map(personaje => `<li>${personaje}</li>`).join('')}
            </ul>
        `;
        this.sectionMensajes.appendChild(mensaje);
    }

    // SISTEMA DE PERSISTENCIA
    guardarProgreso() {
        const progreso = {
            victorias: this.victorias,
            personajesDesbloqueados: this.personajes.filter(p => p.estaDesbloqueado).map(p => p.nombre),
            fecha: new Date().toISOString()
        };
        localStorage.setItem('avatarJuegoProgreso', JSON.stringify(progreso));
    }

    cargarProgreso() {
        const progresoGuardado = localStorage.getItem('avatarJuegoProgreso');
        if (progresoGuardado) {
            try {
                const progreso = JSON.parse(progresoGuardado);
                this.victorias = progreso.victorias || this.victorias;
                
                // Aplicar desbloqueos guardados
                if (progreso.personajesDesbloqueados) {
                    progreso.personajesDesbloqueados.forEach(nombre => {
                        const personaje = this.personajes.find(p => p.nombre === nombre);
                        if (personaje) {
                            personaje.desbloquear();
                        }
                    });
                }
                
                console.log('💾 Progreso cargado:', progreso);
                this.mostrarPersonajesEnPantalla(); // Actualizar interfaz
            } catch (error) {
                console.error('❌ Error al cargar progreso:', error);
            }
        }
    }

    reiniciar() {
        // Vidas de los personajes
        this.personajes.forEach(personaje => {
            personaje.vida = 3;
        });

        this.jugador = null;
        this.enemigo = null;

        this.spanVidasJugador.innerHTML = "3";
        this.spanVidasEnemigo.innerHTML = "3";

        this.spanPersonajeJugador.innerHTML = "";
        this.spanPersonajeEnemigo.innerHTML = "";

        let mensajes = document.querySelector('#mensajes p');
        mensajes.innerHTML = "";

        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
        });

        // Eliminar efectos visuales de ganador
        const visualJugador = document.getElementById('jugador-visual');
        const visualEnemigo = document.getElementById('enemigo-visual');
        visualJugador.classList.remove("ganador-efecto-brillo");
        visualEnemigo.classList.remove("ganador-efecto-brillo");

        // Quitar emojis animados
        visualJugador.querySelectorAll('.emoji-resultado').forEach(e => e.remove());
        visualEnemigo.querySelectorAll('.emoji-resultado').forEach(e => e.remove());

        this.botonPunio.disabled = false;
        this.botonPatada.disabled = false;
        this.botonBarrida.disabled = false;

        this.sectionSeleccionarPersonaje.style.display = 'block';
        this.sectionSeleccionarAtaque.style.display = 'none';
        this.sectionReiniciar.style.display = 'none';
        this.sectionMensajes.style.display = 'none';
    }

    mostrarReglas() {
        this.modalReglas.style.display = 'flex';
    }

    cerrarReglas() {
        this.modalReglas.style.display = 'none';
    }
}