import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select'
import {find} from 'lodash';

const UnitRow = props => {
  const {unitType} = props;
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [count, setCount] = useState(0);
  const [combat, setCombat] = useState(0);
  const [modifier, setModifier] = useState(0);
  useEffect(() => {
    setOptions(unitType.units.map(unit => ({label: unit.name, value: unit.id})));
  }, [unitType])
  const handleSelectChange = selected => {
    setSelectedOption(selected);
    setCombat(find(unitType.units, {name: selected.label}).combat);
  };
  return (
    <Row>
      <Col>
        <h3>
          {unitType.name}
        </h3>
      </Col>
      <Col>
        {unitType.units.length > 1 && (<Select onChange={handleSelectChange} options={options}/>)}
      </Col>
      <Col>
        <input type="number" value={count} onChange={event => setCount(event.target.value)} />
      </Col>
      <Col>
        <input type="number" value={combat} onChange={event => setCombat(event.target.value)} />
      </Col>
      <Col>
        <input type="number" value={modifier} onChange={event => setModifier(event.target.value)} />
      </Col>
    </Row>
  );
};

export default UnitRow;
