import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select'

const UnitRow = props => {
  const {unitType, handleSelectChange, selectedOption, options, combat, setCombat, count, setCount, modifier, setModifier, hasCombatInput} = props;

  return (
    <Row>
      <Col>
        <h3>
          {unitType.name}
        </h3>
      </Col>
      <Col>
        {unitType.units.length > 1 && (<Select value={selectedOption} onChange={handleSelectChange} options={options}/>)}
      </Col>
      <Col>
        {hasCombatInput && (<input type="number" value={combat} onChange={event => setCombat(event.target.value)} />)}
        {!hasCombatInput && (<p>{combat}</p>)}
      </Col>
      <Col>
        <input type="number" value={count} onChange={event => setCount(event.target.value)} />
      </Col>
      <Col>
        <input type="number" value={modifier} onChange={event => setModifier(event.target.value)} />
      </Col>
    </Row>
  );
};

export default UnitRow;
