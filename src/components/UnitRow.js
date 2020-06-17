import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select'

const UnitRow = props => {
  const {values, setValues, hasCombatInput} = props;
  const numberInputStyle = {
    width: 60,
  };
  return (
    <Row>
      <Col>
        <h3 style={{textAlign: 'left'}}>
          {values.name}
        </h3>
      </Col>
      <Col>
        {values.options.length > 1 && (<Select value={values.selectedOption} onChange={selected => setValues(values.name, "selectedOption", selected)} options={values.options}/>)}
      </Col>
      <Col>
        {hasCombatInput && (<input style={numberInputStyle} type="number" value={values.combat} onChange={event => setValues(values.name, "combat", event.target.value)} />)}
        {!hasCombatInput && (<p style={{fontWeight: 'bold'}}>{values.combat}</p>)}
      </Col>
      <Col>
        <input style={numberInputStyle}  type="number" value={values.count} onChange={event => setValues(values.name, "count", event.target.value)} />
      </Col>
      <Col>
        <input style={numberInputStyle}  type="number" value={values.modifier} onChange={event => setValues(values.name, "modifier", event.target.value)} />
      </Col>
    </Row>
  );
};

export default UnitRow;
