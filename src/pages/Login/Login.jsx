import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !senha) {
      setError('Preencha email e senha.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro no login');
      }

      const cliente = data.cliente || null;
      if (cliente) {
        localStorage.setItem('cliente', JSON.stringify(cliente));
      }

      navigate('/');
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: '100vh' }}>
      <div 
        className="card shadow-lg bg-white p-4" 
        style={{ width: '380px', borderRadius: '15px' }}
      >
        <h2 className="text-center mb-4 text-primary fw-bold">Acessar conta</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-floating mb-3">
            <input 
              type="email" 
              className="form-control" 
              id="inputEmail" 
              placeholder="name@example.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <label htmlFor="inputEmail">Email</label>
          </div>

          {/* Senha */}
          <div className="form-floating mb-2">
            <input 
              type="password" 
              className="form-control" 
              id="inputSenha" 
              placeholder="Senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
            <label htmlFor="inputSenha">Senha</label>
          </div>

          {/* Esqueceu senha
          <div className="text-end mb-3">
            <a href="#" className="text-decoration-none small text-primary">
              Esqueceu sua senha?
            </a>
          </div>
          */}

          {/* Lembrar de mim */}
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="check" />
            <label className="form-check-label small" htmlFor="check">
              Lembrar de mim
            </label>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {/* Botão */}
          <button 
            type="submit" 
            className="btn btn-primary w-100 fw-semibold shadow-sm"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Registrar */}
          <div className="text-center mt-4">
            <small>
              Não tem conta?{' '}
              <Link to="/register" className="text-decoration-none fw-semibold text-primary">
                Registre-se
              </Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
