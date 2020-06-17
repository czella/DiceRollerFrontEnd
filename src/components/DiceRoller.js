import React, {useEffect, useState} from 'react';

const DiceRoller = (props) => {
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch("http://localhost:8080/units")
      .then(res => res.json())
      .then(
        (result) => {
          setUnits(result);
        },
        (error) => {
          setError(error);
        }
      )
  }, []);
  return (
    <div>
      <h1>Dice Roller</h1>
    </div>
  );
};

export default DiceRoller;
