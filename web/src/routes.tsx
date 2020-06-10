import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import SubmitDone from './pages/SubmitDone';

const Routes = () => {
  return(
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CreatePoint} path="/create-point" />
      <Route component={SubmitDone} path="/submit-done" />
    </BrowserRouter>
  );
}

export default Routes;