import React from 'react'

export default function AboutPage(){
  return (
    <div className="p-8 max-w-3xl mx-auto font-serif bg-ivory">
      <h2 className="text-2xl font-semibold text-ink mb-2">Sobre este proyecto</h2>
      <p className="text-muted">Pequeño gestor de tareas pensado para organización personal</p>
      <ul className="list-disc pl-5 mt-3">
        <li>Frontend: React + Vite</li>
        <li>Backend: Node + Express</li>
        <li>DB: PostgreSQL</li>
      </ul>
    </div>
  )
}
