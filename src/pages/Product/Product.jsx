import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cart3 } from 'react-bootstrap-icons';
import { useParams, useNavigate } from 'react-router-dom';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [imagemAtual, setImagemAtual] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3001/produtos/${id}`);
        if (!res.ok) {
          console.error('Erro ao buscar produto:', res.statusText);
          setProduto(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProduto(data);
        const firstImage = data.caminho_imagem || (Array.isArray(data.imagens) ? data.imagens[0] : (data.imagens || null));
        setImagemAtual(firstImage || '/placeholder.png');
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
        setProduto(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantidade = (delta) => setQuantidade(prev => Math.max(prev + delta, 1));

  const addToCart = (produtoToAdd, qtd = 1) => {
    try {
      const raw = localStorage.getItem('cart');
      let cart = [];
      if (raw) {
        cart = JSON.parse(raw);
        if (!Array.isArray(cart)) cart = [];
      }
      const existing = cart.find(it => Number(it.id_produto) === Number(produtoToAdd.id_produto || produtoToAdd.id));
      if (existing) {
        existing.quantidade = (existing.quantidade || 0) + qtd;
      } else {
        cart.push({
          id_produto: produtoToAdd.id_produto || produtoToAdd.id,
          nome_produto: produtoToAdd.nome_produto || produtoToAdd.nome || '',
          preco_unitario: produtoToAdd.preco_produto || produtoToAdd.preco || 0,
          caminho_imagem: produtoToAdd.caminho_imagem || (produtoToAdd.imagens && produtoToAdd.imagens[0]) || null,
          quantidade: qtd
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Adicionado ao carrinho');
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      alert('Não foi possível adicionar ao carrinho');
    }
  };

  const buyNow = async () => {
    const rawCliente = localStorage.getItem('cliente');
    if (!rawCliente) {
      navigate('/login');
      return;
    }
    const cliente = JSON.parse(rawCliente);
    const item = {
      id_produto: produto.id_produto || produto.id,
      quantidade,
      preco_unitario: Number(produto.preco_produto ?? produto.preco ?? 0)
    };
    const payload = {
      id_cliente: cliente.id_cliente,
      total: Number((item.preco_unitario * item.quantidade).toFixed(2)),
      items: [item]
    };

    try {
      const res = await fetch('http://localhost:3001/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Erro no servidor ao criar pedido:', data);
        alert('Erro ao criar pedido: ' + (data.error || res.statusText));
        return;
      }
      localStorage.removeItem('cart');
      alert('Pedido criado com sucesso!');
      navigate('/user');
    } catch (err) {
      console.error('Erro ao enviar pedido:', err);
      alert('Erro ao criar pedido');
    }
  };

  if (loading) return <div className="container my-5">Carregando...</div>;
  if (!produto) return <div className="container my-5">Produto não encontrado.</div>;

  const precoUnit = Number(produto.preco_produto ?? produto.preco ?? 0);
  const precoOriginal = Number(produto.precoOriginal ?? produto.preco_original ?? 0);
  const avaliacaoNum = Number(produto.avaliacao ?? 0);
  const imagensArray = Array.isArray(produto.imagens) ? produto.imagens : (produto.imagens ? [produto.imagens] : []);

  const totalProduto = (precoUnit * quantidade).toFixed(2);

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Imagens */}
        <div className="col-md-6">
          <img src={imagemAtual} alt={produto.nome_produto || produto.nome} className="img-fluid rounded shadow-sm mb-3" />
          <div className="d-flex gap-2">
            {imagensArray.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`Thumb ${idx}`} 
                className={`img-thumbnail ${imagemAtual === img ? "border-primary" : ""}`} 
                style={{width: "60px", cursor: "pointer"}} 
                onClick={() => setImagemAtual(img)}
              />
            ))}
          </div>
        </div>

        {/* Detalhes */}
        <div className="col-md-6">
          <h3>{produto.nome_produto || produto.nome}</h3>
          <p>
            <strong>{Number.isFinite(avaliacaoNum) ? avaliacaoNum.toFixed(1) : '0.0'} ⭐</strong>
          </p>
          <h4 className="text-primary">
            R$ {precoUnit.toFixed(2)} <span className="text-muted text-decoration-line-through">{precoOriginal.toFixed(2)}</span>
          </h4>

          <div className="mt-3">
            <label className="form-label"><strong>Quantidade:</strong></label>
            <div className="input-group mb-3" style={{maxWidth: "150px"}}>
              <button className="btn btn-outline-secondary" onClick={() => handleQuantidade(-1)}>-</button>
              <input type="text" className="form-control text-center" value={quantidade} readOnly />
              <button className="btn btn-outline-secondary" onClick={() => handleQuantidade(1)}>+</button>
            </div>
          </div>

          <p><strong>Total do produto:</strong> R$ {totalProduto}</p>

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-primary d-flex align-items-center" onClick={() => { addToCart(produto, quantidade); setQuantidade(1); }}>
              <Cart3 className="me-2" /> Adicionar ao Carrinho
            </button>
            <button className="btn btn-success" onClick={buyNow}>
              Comprar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
