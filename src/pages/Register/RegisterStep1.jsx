import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterStep1(){
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [error, setError] = useState(null);

  const handleNext = (e) => {
    e.preventDefault();
    setError(null);
    if (!nome || !email || !senha || !confirmaSenha) {
      setError('Preencha os campos obrigatórios.');
      return;
    }
    if (senha !== confirmaSenha) {
      setError('As senhas não conferem.');
      return;
    }

    const firstStepData = {
      nome: `${nome} ${sobrenome}`.trim(),
      email,
      senha,
      telefone
    };

    // navigate to step 2 carrying the first-step data
    navigate('/register/address', { state: { firstStepData } });
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg bg-white p-4" style={{ width: '480px', borderRadius: '12px' }}>
        <h2 className="text-center mb-3 text-primary fw-bold">Cadastro - Passo 1</h2>
        <p className="text-muted small">Informações pessoais</p>

        <form onSubmit={handleNext}>
          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Nome</label>
              <input className="form-control" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Sobrenome</label>
              <input className="form-control" value={sobrenome} onChange={e => setSobrenome(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Telefone</label>
            <input className="form-control" value={telefone} onChange={e => setTelefone(e.target.value)} />
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Senha</label>
              <input type="password" className="form-control" value={senha} onChange={e => setSenha(e.target.value)} required />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Confirmar senha</label>
              <input type="password" className="form-control" value={confirmaSenha} onChange={e => setConfirmaSenha(e.target.value)} required />
            </div>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="d-flex justify-content-between mt-3">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Próximo</button>
          </div>
        </form>
      </div>
    </div>
  );
}
