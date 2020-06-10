import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/logo.svg';

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          {/* <img src={logo} alt="Logo Ecoleta"/> */}
          <h1 className="logo">RescueA<strong>Friend</strong></h1>
        </header>

        <main>
          <h1>Adote, ajude e conheça novos amiguinhos.</h1>
          <p>Facilitamos pessoas a encontrarem animais que estão precisando de uma ajudinha, de um novo dono ou e de novos amigos.</p>

          <Link to="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre um amiguinho.</strong>
          </Link>
        </main>
      </div>
    </div>
  )
}

export default Home;