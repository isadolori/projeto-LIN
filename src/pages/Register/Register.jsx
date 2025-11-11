import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState(''); 
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const dadosCadastro = {
      nome: `${nome} ${sobrenome}`,
      email: email,
      senha: senha,
      cpf: cpf,
      telefone: telefone,
      cep: cep,
      logradouro: logradouro,
      numero: numero,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      complemento: complemento
    };

    try {
      const response = await fetch('http://localhost:3001/registro-completo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosCadastro),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }
      alert('Cadastro realizado com sucesso!');
      navigate('/login'); 

    } catch (err) {
      console.error('Falha no cadastro:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start mt-5 mb-5">
      {/* Card com largura controlada */}
      <div
        className="card shadow-lg p-4 border-0"
        style={{
          maxWidth: "950px",
          width: "100%",
          borderRadius: "16px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <form>
          {/* Campos obrigatórios */}
          <p className="mb-4 text-muted">* Campos obrigatórios.</p>

          {/* Linha 1: Nome, Sobrenome e Sexo */}
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">* Nome</label>
              <input
                type="text"
                className="form-control"
                placeholder="Digite seu nome"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">* Sobrenome</label>
              <input
                type="text"
                className="form-control"
                placeholder="Digite seu sobrenome"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">* Sexo</label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sexo"
                    id="feminino"
                    value="feminino"
                  />
                  <label className="form-check-label" htmlFor="feminino">
                    Feminino
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="sexo"
                    id="masculino"
                    value="masculino"
                  />
                  <label className="form-check-label" htmlFor="masculino">
                    Masculino
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Linha 2: Data de nascimento e CPF */}
          <div className="row g-3 mt-3">
            <div className="col-md-2">
              <label className="form-label fw-semibold">* Dia</label>
              <select className="form-select">
                <option>01</option>
                <option>02</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">* Mês</label>
              <select className="form-select">
                <option>Janeiro</option>
                <option>Fevereiro</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">* Ano</label>
              <select className="form-select">
                <option>2000</option>
                <option>2001</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">* CPF</label>
              <input type="text" className="form-control" placeholder="000.000.000-00" />
            </div>
          </div>

          {/* Linha 3: Telefone */}
          <div className="row g-3 mt-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">* DDD e número de celular</label>
              <input type="text" className="form-control" placeholder="(85) 99999-9999" />
            </div>
          </div>

          {/* Linha 4: Endereço */}
          <div className="row g-3 mt-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">* CEP</label>
              <input type="text" className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">* Tipo de Endereço</label>
              <select className="form-select">
                <option>Residencial</option>
                <option>Comercial</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">* Endereço</label>
              <input type="text" className="form-control" />
            </div>
          </div>

          {/* Linha 5: Número, Complemento, Bairro */}
          <div className="row g-3 mt-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">* Número</label>
              <input type="text" className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Complemento (opcional)</label>
              <input type="text" className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">* Bairro</label>
              <input type="text" className="form-control" />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">* Cidade</label>
              <input type="text" className="form-control" />
            </div>
          </div>

          {/* Botão */}
          <div className="mt-4 text-end">
            <button type="submit" className="btn btn-primary px-4">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
