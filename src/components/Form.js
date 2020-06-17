import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {isEmpty} from 'lodash';
import UnitRowContainer from '../containers/UnitRowContainer';
import { useLoader } from '../hooks/useLoader';

const Form = props => {
  const [unitTypes, setUnitTypes] = useState([]);
  const [error, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [result, setResult] = useState([]);
  const [resultBuffer, setResultBuffer] = useState([]);
  const [values, setValues] = useState({});
  const [hasModifier, setHasModifier] = useState(false);
  const [isLoading, increaseLoader, decreaseLoader] = useLoader();
  const handleSubmit = (event) => {
    // setResultBuffer([]);
    event.preventDefault();
    // setShouldFetch(true);
    console.log(getUrls());
    Promise.all(getUrls().map(url =>
    fetch(url)
    ))
    .then(res => {
     const responses = res.map(response => response.json())
     return Promise.all(responses)
    })
    .then(responses => console.log(responses)
    )
  };
  useEffect(() => {
    increaseLoader();
    fetch("http://localhost:8080/unittypes")
      .then(res => res.json())
      .then(
        (result) => {
          decreaseLoader();
          setUnitTypes(result);
          const fetchedValues = {};
          result.forEach(unitType => fetchedValues[unitType.name] = {
            options: unitType.units.map(unit => ({label: unit.name, value: unit.id, combat: unit.combat})),
            selectedOption: unitType.units.map(unit => ({label: unit.name, value: unit.id}))[0],
            combat: unitType.units[0] ? unitType.units[0].combat : 0,
            modifier: 0,
            name: unitType.name,
            count: 0,
          });
          console.log(fetchedValues, 'fetched');
          setValues(fetchedValues);
        },
        (error) => {
          decreaseLoader();
          setError(error);
        }
      )
  }, []);
  useEffect(() => {
    if (!isLoading) {
      setResult(resultBuffer);
      setShouldFetch(false);
    }
  }, [isLoading]);
  const getResult = () => {
    if (!isLoading) {
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
    }
  };
  const addToResult = newResult => {
    resultBuffer.push(newResult);
  };
  const button = {
    width: 150,
  };
  const handleSetValue = (type, prop, value) => {
    setValues({
      ...values,
      [type] : {
        ...values[type],
        [prop]: value,
      },
    })
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
          {console.log(values)}
        </Row>
        {unitTypes.map(unitType =><UnitRowContainer values={values[unitType.name]} setValues={handleSetValue} addToResult={addToResult} shouldFetch={shouldFetch} unitType={unitType} increaseLoader={increaseLoader} decreaseLoader={decreaseLoader} hasModifier={hasModifier} />)}
        <Row>
          <Col><Button style={button} type="submit" value="Submit">Roll</Button></Col>
          <Col><Button onClick={() => setHasModifier(true)}>Add +1 modifier</Button></Col>
          <Col><Button onClick={() => setHasModifier(false)}>Remove modifiers</Button></Col>
        </Row>
        {getResult()}
      </form>
    </Container>
  );
};

export default Form;
