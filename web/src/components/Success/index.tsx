import React from 'react'
import { Link } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'

import './styles.css'

const Success = () => {
  return (
    <div id="modal">
      <Link to="/" className="success">
        <FiCheckCircle />
        <h1>Cadastro concluído!</h1>
      </Link>
    </div>
  )
}

export default Success
