import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage(){
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({name:'', email:'', password:''})

  async function submit(e){
    e.preventDefault()
    try{
      await register(form)
      navigate('/login')
    }catch{
      alert('Error al registrarse')
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto font-serif bg-ivory">
      <h2 className="text-xl font-bold text-ink mb-4">Crear cuenta</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Nombre" className="w-full p-2 border rounded" />
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
        <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} type="password" placeholder="Contraseña" className="w-full p-2 border rounded" />
        <button className="w-full py-2 bg-maroon text-white rounded">Registrarse</button>
      </form>
    </div>
  )
}
