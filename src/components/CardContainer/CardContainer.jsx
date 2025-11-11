import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";

const CardContainer = ({ searchTerm }) => { 
  const [produtos, setProdutos] = useState([]);
  
  useEffect(() => {
    const url = searchTerm 
      ? `http://localhost:3001/produtos?q=${encodeURIComponent(searchTerm)}`
      : 'http://localhost:3001/produtos';
      
    fetch(url) 
      .then(response => response.json())
      .then(data => {
        setProdutos(data);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
      });
  }, [searchTerm]); 

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
          {produtos.map((item) => (
            <div key={item.id_produto} className="col-12 col-sm-6 col-md-4 col-lg-3">
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
                  src={item.caminho_imagem || "https://placehold.co/400g"} 
                  className="card-img-top"
                  alt={item.nome_produto}
                  style={{
                    objectFit: "cover",
                    height: "240px",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                  }}
                />

                <div className="card-body text-center">
                  <h5 className="card-title fw-semibold text-dark">{item.nome_produto}</h5>
                  <p className="text-primary fw-bold fs-5 mb-3">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(item.preco_produto)}
                  </p>
                  
                  <Link to={'/product-details'} className="btn btn-outline-primary w-100 fw-semibold">Ver Detalhes</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardContainer;