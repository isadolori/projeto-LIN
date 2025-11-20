import React, { useState } from 'react'; 
import Body from '../../components/Body/Body.jsx' 

function Home() {
  const [searchTerm, setSearchTerm] = useState(''); 

  return (
    <>
      <Body 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
      />
    </>
  )
}

export default Home