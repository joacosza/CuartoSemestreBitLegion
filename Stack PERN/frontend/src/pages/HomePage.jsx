import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage(){
  return (
    <main className="p-8 max-w-5xl mx-auto font-serif bg-ivory min-h-screen">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-ink">Gestor de Tareas</h1>
        <p className="text-sm text-muted mt-1">Organizá tus pendientes con elegancia</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link to='/tareas' className="p-4 border-2 rounded hover:shadow-sm">Ver tareas</Link>
        <Link to='/tareas/nueva' className="p-4 border-2 rounded hover:shadow-sm">Agregar tarea</Link>
        <Link to='/profile' className="p-4 border-2 rounded hover:shadow-sm">Mi perfil</Link>
        <Link to='/about' className="p-4 border-2 rounded hover:shadow-sm">Sobre</Link>
      </section>
    </main>
  )
}
