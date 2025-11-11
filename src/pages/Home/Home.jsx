import React, { useState } from 'react'; 
import Header from '../../components/Header/Header.jsx'
import Body from '../../components/Body/Body.jsx' 
// import CardContainer from '../../components/CardContainer/CardContainer.jsx'

function Home() {
  const [searchTerm, setSearchTerm] = useState(''); 

  return (
    <>
    
    <Header/>
    
    <Body 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
    />
    </>
  )
}

export default Home