import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const [cliente, setCliente] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem('cliente');
    if (raw) {
      try { setCliente(JSON.parse(raw)); } catch { setCliente(null); }
    } else setCliente(null);

    const cartRaw = localStorage.getItem('cart');
    if (cartRaw) {
      try {
        const cart = JSON.parse(cartRaw);
        const totalQty = Array.isArray(cart) ? cart.reduce((s, it) => s + (it.quantidade || 0), 0) : 0;
        setCartCount(totalQty);
      } catch {
        setCartCount(0);
      }
    } else setCartCount(0);

    // Listen to storage events (in case another tab updates cart)
    const onStorage = () => {
      const cartRaw2 = localStorage.getItem('cart');
      if (cartRaw2) {
        try { const cart = JSON.parse(cartRaw2); setCartCount(Array.isArray(cart) ? cart.reduce((s, it) => s + (it.quantidade || 0), 0) : 0); } catch { setCartCount(0); }
      } else setCartCount(0);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <header className="shadow-sm">
      <div 
        className="container-fluid text-white py-3"
        style={{ background: "linear-gradient(90deg, #0d6efd 0%, #0a0a0a 100%)" }}
      >
        <div className="row align-items-center">
          <div className="col-6 col-md-3 text-center text-md-start mb-2 mb-md-0">
            <Link to="/">
              <img src="/logo.png" alt="Logo" height="45" className="rounded shadow-sm bg-white p-1" />
            </Link>
          </div>

          <div className="col-6 col-md-6 d-flex justify-content-center mb-2 mb-md-0">
            {/* espaço central para título ou futura search */}
            <h5 className="m-0 fw-bold d-none d-md-block">Loja LIN</h5>
          </div>

          <div className="col-12 col-md-3 d-flex justify-content-center justify-content-md-end">
            <div className="d-flex align-items-center gap-2">
              <Link to={'/cart'} className="btn btn-light fw-semibold shadow-sm d-flex align-items-center position-relative">
                <i className="bi bi-cart3 me-2" style={{fontSize: '1.1rem'}}></i>
                Carrinho
                {cartCount > 0 && (
                  <span className="badge bg-danger rounded-pill ms-2" style={{position: 'absolute', top: '-6px', right: '-6px'}}>{cartCount}</span>
                )}
              </Link>

              {cliente ? (
                <Link to={'/user'} className="btn btn-outline-light fw-semibold shadow-sm d-flex align-items-center">
                  <i className="bi bi-person-circle me-2" style={{fontSize: '1.1rem'}}></i>
                  <span className="d-none d-md-inline">{cliente.nome_cliente || 'Perfil'}</span>
                </Link>
              ) : (
                <Link to={'/login'} className="btn btn-outline-light fw-semibold shadow-sm">
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
