import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select'

const UnitRow = props => {
  const {values, setValues, hasCombatInput} = props;
  const numberInputStyle = {
    width: 60,
    borderColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,10,0.5)',
    color: 'white',
    height: 38,
  };
  return (
    <Row>
      <Col>
        <h3 style={{textAlign: 'left', lineHeight: '38px'}}>
          {values.name}
        </h3>
      </Col>
      <Col>
        {values.options.length > 1 && (<Select styles={{
          singleValue: (provided) => ({
            color: 'white',
          }),
          control: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(0,0,10,0.5)',
          }),
          menu: (provided) => ({
            ...provided,
            color: 'black',
          }),
          multiValue: (provided) => ({
            ...provided,
            background: 'orange',
          })
        }} value={values.selectedOption} onChange={selected => setValues(values.name, "selectedOption", selected)} options={values.options}/>)}
      </Col>
      <Col>
        {hasCombatInput && (<input style={numberInputStyle} type="number" value={values.combat} onChange={event => setValues(values.name, "combat", event.target.value)} />)}
        {!hasCombatInput && (<p style={{fontWeight: 'bold', lineHeight: '38px', marginBottom: 0, fontSize: '18px'}}>{values.combat}</p>)}
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
