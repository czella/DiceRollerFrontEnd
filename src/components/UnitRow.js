import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select'

const UnitRow = props => {
  const {values, setValues, hasCombatInput} = props;
  return (
    <Row>
      <Col>
        <h3>
          {values.name}
        </h3>
      </Col>
      <Col>
        {values.options.length > 1 && (<Select value={values.selectedOption} onChange={selected => setValues(values.name, "selectedOption", selected)} options={values.options}/>)}
      </Col>
      <Col>
        {hasCombatInput && (<input type="number" value={values.combat} onChange={event => setValues(values.name, "combat", event.target.value)} />)}
        {!hasCombatInput && (<p>{values.combat}</p>)}
      </Col>
      <Col>
        <input type="number" value={values.count} onChange={event => setValues(values.name, "count", event.target.value)} />
      </Col>
      <Col>
        <input type="number" value={values.modifier} onChange={event => setValues(values.name, "modifier", event.target.value)} />
      </Col>
    </Row>
  );
};

export default UnitRow;
