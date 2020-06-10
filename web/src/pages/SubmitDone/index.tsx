import React  from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { useHistory } from 'react-router-dom'; 

import './styles.css';

const SubmitDone = () => {

  const history = useHistory();

  return(
    <div id="page-submit-done">
      <div className="content">
        <FiCheckCircle />
        <strong>
          Amiguinho cadastrado com sucesso.
        </strong>
      </div>
      <button type="submit" onClick={() => history.push('/')}>Voltar para Home</button>
    </div>
  );
}

export default SubmitDone;