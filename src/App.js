import React from 'react';
import './App.css';
import DiceRoller from './components/DiceRoller';
import Form from './components/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
        <DiceRoller />
        <Form />
    </div>
  );
}

export default App;
