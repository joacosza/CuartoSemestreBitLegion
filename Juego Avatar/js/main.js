// ARCHIVO: main.js (ACTUALIZAR)
// ARCHIVO PRINCIPAL - INICIALIZACIÓN DEL JUEGO

// Variable global para la instancia del juego
let juegoAvatar;

// Función para inicializar el juego completo
function inicializarJuego() {
    console.log("🎮 Iniciando Avatar: La Leyenda de Aang");
    
    // Crear instancia del juego
    juegoAvatar = new Juego();
    
    // Iniciar el juego
    juegoAvatar.iniciar();
    
    console.log("✅ Juego inicializado correctamente");
}

// Iniciar el juego cuando la página esté completamente cargada
window.addEventListener('load', inicializarJuego);

// Funciones auxiliares globales si las necesitas
function reiniciarJuegoCompleto() {
    if (juegoAvatar) {
        juegoAvatar.reiniciar();
    }
}

// Función para obtener información del juego (útil para debugging)
function obtenerEstadoJuego() {
    if (juegoAvatar) {
        return {
            jugador: juegoAvatar.jugador?.nombre || 'No seleccionado',
            enemigo: juegoAvatar.enemigo?.nombre || 'No seleccionado',
            vidasJugador: juegoAvatar.jugador?.vida || 0,
            vidasEnemigo: juegoAvatar.enemigo?.vida || 0,
            personajesDisponibles: juegoAvatar.personajes.length
        };
    }
    return null;
}

// Función para mostrar estadísticas en consola (opcional)
function mostrarEstadisticas() {
    console.log("📊 Estado actual del juego:", obtenerEstadoJuego());
    if (juegoAvatar) {
        console.log("👥 Personajes disponibles:", juegoAvatar.personajes.length);
        console.log("🎯 Personajes:", juegoAvatar.personajes.map(p => p.nombre));
    }
}

// Función para desbloquear todos los personajes (debug)
function desbloquearTodo() {
    if (juegoAvatar) {
        juegoAvatar.personajes.forEach(p => p.desbloquear());
        juegoAvatar.mostrarPersonajesEnPantalla();
        console.log("🔓 Todos los personajes desbloqueados");
    }
}