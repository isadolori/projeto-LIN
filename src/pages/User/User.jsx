

import React from 'react';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const navigate = useNavigate();
  const cliente = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cliente') || 'null') : null;

  const handleLogout = () => {
    try { localStorage.removeItem('cliente'); } catch(e) {}
    navigate('/');
  };

  if (!cliente) {
    return (
      <div className="container my-5">
        <div className="card p-4">
          <p>Você não está logado.</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Fazer login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card p-4">
        <h4>Perfil</h4>
        <p><strong>Nome:</strong> {cliente.nome_cliente}</p>
        <p><strong>Email:</strong> {cliente.email_cliente}</p>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger" onClick={handleLogout}>Sair</button>
          <button className="btn btn-primary" onClick={() => navigate('/cart')}>Ver Carrinho</button>
        </div>
      </div>
    </div>
  )
}

export default User