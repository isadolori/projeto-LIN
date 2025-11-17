import React from 'react';
// import Card from '../Card/Card'
import CardCarousel from '../CardCarousel/CardCarousel'
import CardContainer from '../CardContainer/CardContainer'
import SearchBar from '../SearchBar/SearchBar';
import BannerPromocaoDia from '../Promocao/BannerPromocaoDia'

const Body = ({ searchTerm, setSearchTerm }) => {

  return (
    
    <>

    <BannerPromocaoDia/>
    
    <SearchBar setSearchTerm={setSearchTerm} /> 
     
    <CardContainer searchTerm={searchTerm} />
    
   

    </>
  )
}

export default Body