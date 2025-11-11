import React, { useState } from 'react'; 
// import Button from '../Button/Button.jsx'

function SearchBar({ setSearchTerm }){ 
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(inputValue); 
  };

  return(
    <div className="container mt-3">
      <form id='search-bar' className="d-flex justify-content-center" role="search" onSubmit={handleSubmit}>
        <input 
          type="search" 
          placeholder="Pesquisar..." 
          className="form-control me-2"
          style={{width: "500px"}}
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
        />
        <button type="submit" className="btn btn-primary">Buscar</button> 
      </form>
    </div>
  )
}

export default SearchBar