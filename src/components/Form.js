import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {isEmpty} from 'lodash';
import UnitRow from "./UnitRow";
import dice from '../static/dice.gif'

const Form = props => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [values, setValues] = useState({});
  const handleSubmit = event => {
    event.preventDefault();
    setLoading(true);
    const requestBody = [];
    Object.keys(values).forEach(value => {
      const unitType = values[value];
      if (unitType.count > 0) {
        requestBody.push({
          name: unitType.name,
          combat: unitType.combat,
          count: unitType.count,
          modifier: unitType.modifier,
        })
      }
    })
    setTimeout(() => fetch("http://localhost:8080/roll/combined", {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(requestBody) // body data type must match "Content-Type" header
    }).then(response => response.json().then(
      parsed => {
        setResult(parsed);
        setLoading(false);
      }
    )), 900);
  };
  useEffect(() => {
    fetch("http://localhost:8080/unittypes")
      .then(res => res.json())
      .then(
        (result) => {
          const fetchedValues = {};
          result.forEach(unitType => fetchedValues[unitType.name] = {
            options: unitType.units.map(unit => ({label: unit.name, value: unit.id, combat: unit.combat})),
            selectedOption: unitType.units.map(unit => ({label: unit.name, value: unit.id, combat: unit.combat}))[0],
            combat: unitType.units[0] ? unitType.units[0].combat : 0,
            modifier: 0,
            name: unitType.name,
            count: 0,
          });
          setValues(fetchedValues);
        },
        (error) => {
          setError(error);
        }
      )
  }, []);
  const getResult = () => {
    let totalHits = 0;
    result.forEach(subResult => totalHits += subResult.hits);
    if (loading) {
      return <img style={{maxHeight: '100px', animation: 'rotation 1s infinite linear'}} src={dice} alt="loading..." />;
    }
    return (
      <div>
        {result.length > 0 && (
          <div>
            <Row>
              <Col>
                <h3>Unit</h3>
              </Col>
              <Col>
                <h3>Rolls</h3>
              </Col>
              <Col>
                <h3>Hits</h3>
              </Col>
            </Row>
            <div className="separator" />
          </div>
        )}
        {result.map(subResult => (
        <Row>
          <Col>
            <h3 style={{textAlign: 'left', lineHeight: '38px'}}>{subResult.unitName}</h3>
          </Col>
          <Col>
            <p style={{fontWeight: 'bold', lineHeight: '38px', marginBottom: 0, fontSize: '18px'}}>{subResult.rolls.join(', ')}</p>
          </Col>
          <Col>
            <p style={{fontWeight: 'bold', lineHeight: '38px', marginBottom: 0, fontSize: '18px'}}>{subResult.hits}</p>
          </Col>
        </Row>
        ))}
        {result.length > 0 && (<div className="separator" />)}
        {result.length > 0 && (<h2>Total hits: {totalHits}</h2>)}
      </div>
    );
  };
  const buttonStyle = {
    width: 200,
    backgroundColor: 'rgba(0,0,10,0.5)',
    color: 'white',
    borderWidth: 2,
    borderRadius: 5,
    fontSize: 20,
  };
  const handleSetValue = (type, prop, value) => {
    const newValues = {
      ...values,
      [type] : {
        ...values[type],
        [prop]: value,
      },
    };
    if (prop === 'selectedOption') {
      newValues[type].combat = value.combat;
    }
    setValues(newValues);
  };
  if (isEmpty(values)) {
    return null;
  }
  const setModifiers = value => {
    const newValues = {...values};
    Object.keys(newValues).forEach(unitType => newValues[unitType].modifier = value);
    setValues(newValues);
  };
  const clear = () => {
    const newValues = {...values};
    Object.keys(newValues).forEach(unitType => {
      newValues[unitType].modifier = 0;
      newValues[unitType].count = 0;
      if (newValues[unitType].options.length > 0) {
        newValues[unitType].selectedOption = newValues[unitType].options[0];
      }
    });
    setValues(newValues);
  };
  return (
    <Container>
      {error && (<div>There was an error!</div>)}
      <form onSubmit={handleSubmit}>
        <div className="separator" />
        <Row>
          <Col><h2>Type</h2></Col>
          <Col><h2>Unit</h2></Col>
          <Col><h2>Combat</h2></Col>
          <Col><h2>Count</h2></Col>
          <Col><h2>Modifier</h2></Col>
        </Row>
        <div className="separator" />
        {Object.keys(values).map(unitType =><UnitRow values={values[unitType]} setValues={handleSetValue} hasCombatInput={['Flagship', 'Space Cannon'].indexOf(values[unitType].name) !== -1} />)}
        <Row style={{marginTop: 50, marginBottom: 30}}>
          <Col><Button style={{...buttonStyle, borderColor: 'orangered'}} type="submit" value="Submit">Roll</Button></Col>
          <Col><Button style={{...buttonStyle, borderColor: 'orange'}} onClick={() => setModifiers(1)}>Add +1 modifier</Button></Col>
          <Col><Button style={{...buttonStyle, borderColor: 'gold'}} onClick={() => setModifiers(0)}>Remove modifiers</Button></Col>
          <Col><Button style={{...buttonStyle, borderColor: 'yellow'}} onClick={() => clear()}>Clear all</Button></Col>
        </Row>
        <div className="separator" />
        {getResult()}
      </form>
    </Container>
  );
};

export default Form;
