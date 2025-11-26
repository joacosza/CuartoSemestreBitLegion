import React, { useState, useContext, useEffect } from 'react'
import { TareasContext } from '../context/TareasContext'
import { useNavigate, useParams } from 'react-router-dom'

export default function TareaFormPage(){
  const { crear, editar, obtener } = useContext(TareasContext)
  const navigate = useNavigate()
  const { id } = useParams()
  const [tarea, setTarea] = useState({titulo:'', descripcion:''})

  useEffect(()=>{
    if(id){
      const found = obtener(id)
      if(found) setTarea(found)
    }
  }, [id])

  async function submit(e){
    e.preventDefault()
    if(id) await editar(id, tarea)
    else await crear(tarea)
    navigate('/tareas')
  }

  return (
    <div className="p-8 max-w-md mx-auto font-serif bg-ivory">
      <h2 className="text-lg font-semibold text-ink mb-3">{id ? 'Editar tarea' : 'Nueva tarea'}</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={tarea.titulo} onChange={e=>setTarea({...tarea, titulo:e.target.value})} placeholder="Título" className="w-full p-2 border rounded" />
        <textarea value={tarea.descripcion} onChange={e=>setTarea({...tarea, descripcion:e.target.value})} placeholder="Descripción" className="w-full p-2 border rounded" />
        <button className="w-full py-2 bg-maroon text-white rounded">{id ? 'Guardar' : 'Crear'}</button>
      </form>
    </div>
  )
}
