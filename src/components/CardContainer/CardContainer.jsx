import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";

const CardContainer = ({ searchTerm }) => { 
  const [produtos, setProdutos] = useState([]);
  
  useEffect(() => {
    const url = searchTerm 
      ? `http://localhost:3001/produtos?q=${encodeURIComponent(searchTerm)}`
      : 'http://localhost:3001/produtos';
      
    fetch(url) 
      .then(async response => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }
        return response.json();
      })
      .then(data => {
        // garante que o estado seja sempre um array
        const lista = Array.isArray(data) ? data : (Array.isArray(data.produtos) ? data.produtos : []);
        setProdutos(lista);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
        setProdutos([]);
      });
  }, [searchTerm]); 

  const addToCart = (produto) => {
    try {
      const key = 'cart';
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      const id = produto.id_produto ?? produto.id;
      const existing = current.find(i => (i.id_produto ?? i.id) === id);
      if (existing) {
        existing.quantidade = (existing.quantidade || 1) + 1;
      } else {
        current.push({
          id_produto: id,
          nome_produto: produto.nome_produto || produto.nome,
          preco_produto: Number(produto.preco_produto ?? produto.preco) || 0,
          caminho_imagem: produto.caminho_imagem || produto.imagens?.[0] || null,
          quantidade: 1
        });
      }
      localStorage.setItem(key, JSON.stringify(current));
      // opcional: notificar usuário
      console.log('Adicionado ao carrinho:', produto.nome_produto || produto.nome);
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
    }
  };

  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Produtos Exclusivos</h2>
          <p className="fst-italic text-muted">“Seu look, sua atitude.”</p>
        </div>
        <div className="row g-4">
          {produtos.map((item) => {
            const id = item.id_produto ?? item.id ?? Math.random();
            const precoNum = Number(item.preco_produto ?? item.preco) || 0;
            return (
            <div key={id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{
                  borderRadius: "16px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src={item.caminho_imagem || item.imagens?.[0] || "https://placehold.co/400x240"} 
                  className="card-img-top"
                  alt={item.nome_produto ?? item.nome}
                  style={{
                    objectFit: "cover",
                    height: "240px",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                  }}
                />

                <div className="card-body text-center">
                  <h5 className="card-title fw-semibold text-dark">{item.nome_produto ?? item.nome}</h5>
                  <p className="text-primary fw-bold fs-5 mb-3">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(precoNum)}
                  </p>
                  
                  <div className="d-grid gap-2">
                    <button type="button" className="btn btn-primary w-100 fw-semibold" onClick={() => addToCart(item)}>Adicionar ao Carrinho</button>
                    <Link to={`/product-details/${id}`} className="btn btn-outline-primary w-100 fw-semibold">Ver Detalhes</Link>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
};

export default CardContainer;