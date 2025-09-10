import React from 'react'
import Navbar from '../Components/Navbar'
import Header from '../Components/Header'

const Home = () => {
  return (
    <div className='min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center flex flex-col'>
      {/* Navbar stays at the top */ }
      <Navbar/>
      
    {/* Header takes full space and centers itself */}
      <div className='flex-1 flex items-center justify-center'>
        <Header/>
        </div>
    </div>
  )
}

export default Home