import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {isEmpty} from 'lodash';
import UnitRow from "./UnitRow";

const Form = props => {
  const [error, setError] = useState(null);
  const [result, setResult] = useState([]);
  const [values, setValues] = useState({});
  const handleSubmit = (event) => {
    event.preventDefault();
    Promise.all(getUrls().map(url =>
    fetch(url)
    ))
    .then(res => {
     const responses = res.map(response => response.json())
     return Promise.all(responses)
    })
    .then(responses => setResult(responses)
    )
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
    return (
      <div>
        {result.map(subResult => (
        <Row>
          <Col>
            <h3>{subResult.unitName}</h3>
          </Col>
          <Col>
            <p>Rolls: {subResult.rolls.join(', ')}</p>
          </Col>
          <Col>
            <p>Hits: {subResult.hits}</p>
          </Col>
        </Row>
        ))}
        {result.length > 0 && (<h2>Total hits: {totalHits}</h2>)}
      </div>
    );
  };
  const button = {
    width: 150,
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
  const getParams = type => {
    let params = '';
    if (values[type].selectedOption) {
      params += `id=${values[type].selectedOption.value}&`
    }
    if (values[type].count !== 1) {
      params += `count=${values[type].count}&`
    }
    if (values[type].modifier !== 0) {
      params += `modifier=${values[type].modifier}&`
    }
    if (['Space Cannon', 'Flagship'].indexOf(type) !== -1) {
      params += `combat=${values[type].combat}&`
    }
    return params
  };
  const getUrls = () => {
    const urls = [];
    Object.keys(values).forEach(unittype => {
      if (values[unittype].count > 0) {
        urls.push(`http://localhost:8080/roll/${unittype.replace(/\s/g, '').toLowerCase()}?${getParams(unittype)}`)
      }
    });
    return urls;
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
        <Row>
          <Col><h2>Type</h2></Col>
          <Col><h2>Unit</h2></Col>
          <Col><h2>Combat</h2></Col>
          <Col><h2>Count</h2></Col>
          <Col><h2>Modifier</h2></Col>
        </Row>
        {Object.keys(values).map(unitType =><UnitRow values={values[unitType]} setValues={handleSetValue} hasCombatInput={['Flagship', 'Space Cannon'].indexOf(values[unitType].name) !== -1} />)}
        <Row>
          <Col><Button style={button} type="submit" value="Submit">Roll</Button></Col>
          <Col><Button onClick={() => setModifiers(1)}>Add +1 modifier</Button></Col>
          <Col><Button onClick={() => setModifiers(0)}>Remove modifiers</Button></Col>
          <Col><Button onClick={() => clear()}>Clear all</Button></Col>
        </Row>
        {getResult()}
      </form>
    </Container>
  );
};

export default Form;
