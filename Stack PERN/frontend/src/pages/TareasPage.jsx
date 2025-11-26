import React, { useContext } from 'react'
import { TareasContext } from '../context/TareasContext'
import CardTareas from '../components/CardTareas'
import { Link } from 'react-router-dom'

export default function TareasPage(){
  const { tareas } = useContext(TareasContext)
  if(!tareas) return <div className="p-6">Cargando...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto font-serif bg-ivory">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-ink">Mis tareas</h2>
        <Link to="/tareas/nueva" className="text-sm text-maroon">+ Nueva</Link>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {tareas.length === 0 ? <p className="text-muted">No hay tareas</p> : tareas.map(t => <CardTareas key={t.id} tarea={t} />)}
      </div>
    </div>
  )
}
