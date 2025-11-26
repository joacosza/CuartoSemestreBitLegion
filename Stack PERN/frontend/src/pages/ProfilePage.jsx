import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function ProfilePage(){
  const { user, logout } = useContext(AuthContext)
  if(!user) return <div className="p-6">Iniciá sesión para ver tu perfil</div>

  return (
    <div className="p-8 max-w-lg mx-auto font-serif bg-ivory">
      <h2 className="text-xl font-semibold text-ink">Perfil</h2>
      <p className="mt-2"><strong>Nombre:</strong> {user.name}</p>
      <p className="mt-1"><strong>Email:</strong> {user.email}</p>
      <button onClick={logout} className="mt-4 px-3 py-2 bg-maroon text-white rounded">Cerrar sesión</button>
    </div>
  )
}
