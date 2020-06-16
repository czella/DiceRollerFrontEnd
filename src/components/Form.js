import React, {useEffect, useState} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UnitRowContainer from '../containers/UnitRowContainer';
import { useLoader } from '../hooks/useLoader';

const Form = props => {
  const [unitTypes, setUnitTypes] = useState([]);
  const [error, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [result, setResult] = useState([]);
  const [resultBuffer, setResultBuffer] = useState([]);
  const [isLoading, increaseLoader, decreaseLoader] = useLoader();
  const handleSubmit = (event) => {
    setResultBuffer([]);
    event.preventDefault();
    setShouldFetch(true);
  };
  useEffect(() => {
    increaseLoader();
    fetch("http://localhost:8080/unittypes")
      .then(res => res.json())
      .then(
        (result) => {
          decreaseLoader();
          setUnitTypes(result);
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
          <h2>Total hits: {totalHits}</h2>
        </div>
      );
    }
  };
  const addToResult = newResult => {
    resultBuffer.push(newResult);
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
        {unitTypes.map(unitType =><UnitRowContainer addToResult={addToResult} shouldFetch={shouldFetch} unitType={unitType} increaseLoader={increaseLoader} decreaseLoader={decreaseLoader} />)}
        <input type="submit" value="Submit" />
        {getResult()}
      </form>
    </Container>
  );
};

export default Form;
