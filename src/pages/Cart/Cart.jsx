import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart(){
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(stored);
  }, []);

  const save = (next) => {
    setItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
  };

  const changeQty = (idx, delta) => {
    const next = [...items];
    next[idx].quantidade = Math.max(1, (next[idx].quantidade || 1) + delta);
    save(next);
  };

  const removeItem = (idx) => {
    const next = items.filter((_, i) => i !== idx);
    save(next);
  };

  const total = items.reduce((s, it) => s + (Number(it.preco_produto || 0) * (it.quantidade || 1)), 0);

  const finalizar = async () => {
    setError(null);
    const cliente = JSON.parse(localStorage.getItem('cliente') || 'null');
    if (!cliente) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      setError('Carrinho vazio');
      return;
    }

    const payload = {
      id_cliente: cliente.id_cliente,
      total: total,
      items: items.map(it => ({ id_produto: it.id_produto, quantidade: it.quantidade, preco_unitario: it.preco_produto }))
    };

    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao finalizar pedido');

      localStorage.removeItem('cart');
      setItems([]);
      navigate('/user');
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4">Meu Carrinho</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {items.length === 0 ? (
        <div className="card p-4">
          <p>Carrinho vazio.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Continuar comprando</button>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {items.map((it, idx) => (
              <div key={it.id_produto} className="card mb-3">
                <div className="row g-0 align-items-center">
                  <div className="col-3">
                    <img src={it.caminho_imagem || 'https://placehold.co/120x90'} alt={it.nome_produto} className="img-fluid" />
                  </div>
                  <div className="col-6">
                    <div className="card-body">
                      <h5 className="card-title">{it.nome_produto}</h5>
                      <p className="card-text">Preço: R$ {Number(it.preco_produto).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="col-3 text-center">
                    <div className="d-flex flex-column align-items-center">
                      <div className="btn-group mb-2" role="group">
                        <button className="btn btn-outline-secondary" onClick={() => changeQty(idx, -1)}>-</button>
                        <button className="btn btn-light" disabled>{it.quantidade}</button>
                        <button className="btn btn-outline-secondary" onClick={() => changeQty(idx, 1)}>+</button>
                      </div>
                      <button className="btn btn-sm btn-danger" onClick={() => removeItem(idx)}>Remover</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <div className="card p-3">
              <h5>Resumo</h5>
              <p>Total: <strong>R$ {total.toFixed(2)}</strong></p>
              <button className="btn btn-success w-100" onClick={finalizar} disabled={loading}>{loading ? 'Enviando...' : 'Finalizar Compra'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
