import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cart3 } from 'react-bootstrap-icons';

const produto = {
  id: 1,
  nome: "Camisa azul",
  avaliacao: 4.7,
  votos: 19314,
  preco: 154.37,
  precoOriginal: 237.49,
  desconto: 34,
  cores: ["Sortidos"],
  imagens: [
    "https://placehold.co/400?text=Imagem+1",
    "https://placehold.co/400?text=Imagem+2",
    "https://placehold.co/400?text=Imagem+3"
  ]
};

export default function Product() {
  const [imagemAtual, setImagemAtual] = useState(produto.imagens[0]);
  const [quantidade, setQuantidade] = useState(1);
  const [carrinhoItens, setCarrinhoItens] = useState(0); // total de itens no carrinho
  const [carrinhoTotal, setCarrinhoTotal] = useState(0); // total em R$ do carrinho

  const handleQuantidade = (delta) => {
    setQuantidade(prev => Math.max(prev + delta, 1));
  };

  const adicionarCarrinho = () => {
    setCarrinhoItens(prev => prev + quantidade);
    setCarrinhoTotal(prev => prev + produto.preco * quantidade);
    setQuantidade(1); // resetar quantidade após adicionar
  };

  const totalProduto = (produto.preco * quantidade).toFixed(2);

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Imagens */}
        <div className="col-md-6">
          <img src={imagemAtual} alt={produto.nome} className="img-fluid rounded shadow-sm mb-3" />
          <div className="d-flex gap-2">
            {produto.imagens.map((img, idx) => (
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
          <h3>{produto.nome}</h3>
          <p>
            <strong>{produto.avaliacao} ⭐</strong> ({produto.votos} avaliações)
          </p>
          <h4 className="text-primary">
            R$ {produto.preco.toFixed(2)} <span className="text-muted text-decoration-line-through">{produto.precoOriginal.toFixed(2)}</span> <span className="text-success">{produto.desconto}% OFF</span>
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
          <p><strong>Itens no carrinho:</strong> {carrinhoItens}</p>
          <p><strong>Total no carrinho:</strong> R$ {carrinhoTotal.toFixed(2)}</p>

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-primary d-flex align-items-center" onClick={adicionarCarrinho}>
              <Cart3 className="me-2" /> Adicionar ao Carrinho
            </button>
            <button className="btn btn-success">
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
