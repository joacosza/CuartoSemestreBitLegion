import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage(){
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    try{
      await login({ email, password })
      navigate('/tareas')
    }catch{
      alert('Error al iniciar sesión')
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto font-serif bg-ivory">
      <h2 className="text-xl font-bold text-ink mb-4">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Contraseña" className="w-full p-2 border rounded" />
        <button className="w-full py-2 bg-maroon text-white rounded">Entrar</button>
      </form>
      <p className="text-sm mt-3">No tenés cuenta? <Link to="/register" className="text-maroon">Registrate</Link></p>
    </div>
  )
}
