import React from 'react'
import SearchBar from "../SearchBar/SearchBar";
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="shadow-sm">
      {/* Topo com gradiente e conteúdo principal */}
      <div 
        className="container-fluid text-white py-3"
        style={{
          background: "linear-gradient(90deg, #0d6efd 0%, #0a0a0a 100%)"
        }}
      >
        <div className="row align-items-center">
          
          {/* Logo */}
          <div className="col-12 col-md-3 text-center text-md-start mb-2 mb-md-0">
            <img 
              src="/logo.png" 
              alt="Logo" 
              height="45" 
              className="rounded shadow-sm bg-white p-1"
              
            />
          </div>

          {/* Barra de pesquisa 
          <div className="col-12 col-md-6 d-flex justify-content-center mb-2 mb-md-0">
            <div className="w-100" style={{ maxWidth: 600 }}>
              <SearchBar />
            </div>
          </div>
          */}

          {/* Login */}
          <div className="col-12 col-md-3 d-flex justify-content-center justify-content-md-end">
            <div className="d-flex align-items-center gap-3">
              <i 
                className="bi bi-person-circle" 
                style={{ fontSize: "2rem", cursor: "pointer", transition: "0.2s" }}
                onMouseOver={e => e.currentTarget.style.color = "#cfe2ff"}
                onMouseOut={e => e.currentTarget.style.color = "white"}
              ></i>
              <Link to={'/login'} className="btn btn-light fw-semibold shadow-sm">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar inferior 
      <nav 
        className="navbar navbar-expand-lg navbar-light bg-white border-top border-bottom"
      >
        <div className="container justify-content-center navbar-nav py-2">
          <a className="nav-link px-4 fw-semibold text-dark" href="#">Feminino</a>
          <a className="nav-link px-4 fw-semibold text-dark" href="#">Masculino</a>
          <a className="nav-link px-4 fw-semibold text-dark" href="#">Infantil</a>
        </div>
      </nav>
      */}
      
    </header>
  );
}

export default Header;
