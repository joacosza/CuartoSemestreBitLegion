import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="p-8 text-center font-serif bg-ivory">
      <h2 className="text-2xl font-bold text-ink mb-2">404 — Página no encontrada</h2>
      <Link to="/" className="text-maroon">Volver al inicio</Link>
    </div>
  )
}
