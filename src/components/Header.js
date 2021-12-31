import React from 'react'
import logo from '../assets/images/logo.png'

function Header() {
  return (
    <header className='flex-evenly'>
      <img src={logo} alt='logo' style={{ maxWidth: '80vw' }} />
    </header>
  )
}

export default Header
