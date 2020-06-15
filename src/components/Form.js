import React, {useEffect, useState} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UnitRow from './UnitRow';

const Form = props => {
  const [unitTypes, setUnitTypes] = useState([]);
  const [error, setError] = useState(null);
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    fetch("http://localhost:8080/unittypes")
      .then(res => res.json())
      .then(
        (result) => {
          setUnitTypes(result);
        },
        (error) => {
          setError(error);
        }
      )
  }, []);
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col><h2>Type</h2></Col>
          <Col><h2>Unit</h2></Col>
          <Col><h2>Count</h2></Col>
          <Col><h2>Combat</h2></Col>
          <Col><h2>Modifier</h2></Col>
        </Row>
        {unitTypes.map(unitType =><UnitRow unitType={unitType} />)}
      </form>
    </Container>
  );
};

export default Form;
