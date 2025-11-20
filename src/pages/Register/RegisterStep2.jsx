import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RegisterStep2(){
  const location = useLocation();
  const navigate = useNavigate();
  const firstStepData = location.state?.firstStepData || JSON.parse(localStorage.getItem('registerStep1') || 'null');

  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!firstStepData) {
      navigate('/register');
      return;
    }
  }, [firstStepData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!firstStepData?.nome || !cpf || !firstStepData?.email || !firstStepData?.senha || !cep || !logradouro || !numero || !bairro || !cidade || !uf) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      nome: firstStepData.nome,
      cpf,
      email: firstStepData.email,
      senha: firstStepData.senha,
      telefone: firstStepData.telefone,
      cep,
      logradouro,
      numero,
      bairro,
      cidade,
      uf,
      complemento
    };

    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/registro-completo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no servidor');

      try { localStorage.removeItem('registerStep1'); } catch(e) {}
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Erro no registro completo:', err);
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg bg-white p-4" style={{ width: '600px', borderRadius: '12px' }}>
        <h2 className="text-center mb-3 text-primary fw-bold">Cadastro - Passo 2</h2>
        <p className="text-muted small">Endereço</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">CPF</label>
            <input className="form-control" value={cpf} onChange={e => setCpf(e.target.value)} required />
          </div>

          <div className="row">
            <div className="col-4 mb-3">
              <label className="form-label">CEP</label>
              <input className="form-control" value={cep} onChange={e => setCep(e.target.value)} required />
            </div>
            <div className="col-8 mb-3">
              <label className="form-label">Logradouro</label>
              <input className="form-control" value={logradouro} onChange={e => setLogradouro(e.target.value)} required />
            </div>
          </div>

          <div className="row">
            <div className="col-4 mb-3">
              <label className="form-label">Número</label>
              <input className="form-control" value={numero} onChange={e => setNumero(e.target.value)} required />
            </div>
            <div className="col-8 mb-3">
              <label className="form-label">Complemento</label>
              <input className="form-control" value={complemento} onChange={e => setComplemento(e.target.value)} />
            </div>
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Bairro</label>
              <input className="form-control" value={bairro} onChange={e => setBairro(e.target.value)} required />
            </div>
            <div className="col-4 mb-3">
              <label className="form-label">Cidade</label>
              <input className="form-control" value={cidade} onChange={e => setCidade(e.target.value)} required />
            </div>
            <div className="col-2 mb-3">
              <label className="form-label">UF</label>
              <input className="form-control" value={uf} onChange={e => setUf(e.target.value)} required />
            </div>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="d-flex justify-content-between mt-3">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/register')}>Voltar</button>
            <button type="submit" className="btn btn-success" disabled={loading}>{loading ? 'Enviando...' : 'Concluir Cadastro'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
