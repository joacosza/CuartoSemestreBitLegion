// ARCHIVO: personajes.js (REEMPLAZAR COMPLETO)
// CLASE PERSONAJE - Sistema POO completo
class Personaje {
    constructor(nombre, imagen, elemento, descripcion = '') {
        this.nombre = nombre;
        this.imagen = imagen;
        this.elemento = elemento;
        this.descripcion = descripcion;
        this.vida = 3;
        this.vidaMaxima = 3;
        this.estaDesbloqueado = false;
        this.esPrincipal = false;
        this.requisitoDesbloqueo = '';
        this.ataques = [
            { nombre: 'Puño', emoji: '🤜🏻', id: 'boton-punio' },
            { nombre: 'Patada', emoji: '🦵🏻', id: 'boton-patada' },
            { nombre: 'Barrida', emoji: '🦶🏻', id: 'boton-barrida' }
        ];
    }

    // Método para atacar
    atacar() {
        const ataques = ["Puño 🤜🏻", "Patada 🦵🏻", "Barrida 🦶🏻"];
        return ataques[Math.floor(Math.random() * ataques.length)];
    }

    recibirDanio() {
        this.vida = Math.max(0, this.vida - 1);
        return this.vida;
    }

    curar() {
        this.vida = this.vidaMaxima;
    }

    estaVivo() {
        return this.vida > 0;
    }

    desbloquear() {
        this.estaDesbloqueado = true;
        return this;
    }

    establecerComoPrincipal() {
        this.esPrincipal = true;
        return this;
    }

    establecerRequisito(requisito) {
        this.requisitoDesbloqueo = requisito;
        return this;
    }

    obtenerInfo() {
        return {
            nombre: this.nombre,
            elemento: this.elemento,
            vida: this.vida,
            vidaMaxima: this.vidaMaxima,
            estaDesbloqueado: this.estaDesbloqueado,
            esPrincipal: this.esPrincipal,
            requisitoDesbloqueo: this.requisitoDesbloqueo,
            descripcion: this.descripcion
        };
    }

    // Método estático para crear TODOS los personajes
    static crearTodosLosPersonajes() {
        const personajes = [];
        
        // PERSONAJES PRINCIPALES (siempre disponibles)
        personajes.push(
            new Personaje('Zuko', './img/Zuko.png', 'Fuego 🔥', 
                'Príncipe del Fuego Nacional en busca de redención')
                .establecerComoPrincipal(),

            new Personaje('Katara', './img/Katara.png', 'Agua 💧', 
                'Maestra del Agua del Tribu Agua del Sur')
                .establecerComoPrincipal(),

            new Personaje('Aang', './img/Aang.png', 'Aire 🌪', 
                'El Avatar, último maestro del aire')
                .establecerComoPrincipal(),

            new Personaje('Toph', './img/Toph.jpg', 'Tierra 🗻', 
                'Maestra de la Tierra que inventó el Metalbending')
                .establecerComoPrincipal()
        );

        // PERSONAJES DESBLOQUEABLES (usando los que tienes en img/)
        personajes.push(
            new Personaje('El Espíritu Azul', './img/El Espíritu Azul.jpg', 'Sombra 🌙', 
                'Guerrero misterioso que aparece en la noche')
                .establecerRequisito('Gana una partida con Zuko'),

            new Personaje('Katara Sangre Control', './img/Katara sangre control.jpg', 'Sangre 🩸', 
                'Versión oscura que domina técnicas prohibidas')
                .establecerRequisito('Gana una partida con Katara'),

            new Personaje('Avatar Roku', './img/Avatar Roku.jpg', 'Fuego 🔥', 
                'Avatar anterior a Aang, maestro del fuego')
                .establecerRequisito('Gana una partida con Aang'),

            new Personaje('Avatar Kyoshi', './img/Avatar Kyoshi.jpg', 'Tierra 🗻', 
                'Legendaria Avatar, fundadora de Kyoshi')
                .establecerRequisito('Gana una partida con Aang'),

            new Personaje('Toph', './img/Toph.jpg', 'Tierra 🗻', 
                'Versión legendaria con técnicas avanzadas')
                .establecerRequisito('Gana una partida con Toph'),

            new Personaje('Sokka', './img/Sokka.jpg', 'Espada ⚔️', 
                'Maestro de armas y estratega militar')
                .establecerRequisito('Gana partidas con TODOS')
        );

        return personajes;
    }
}

// Variable global para compatibilidad
let avatares = [];

// Función de inicialización para compatibilidad
function inicializarPersonajes() {
    avatares = Personaje.crearTodosLosPersonajes();
    console.log("Avatares inicializados:", avatares);
    return avatares;
}