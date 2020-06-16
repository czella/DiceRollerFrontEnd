import React, { useEffect, useState } from 'react';
import {find} from 'lodash';
import UnitRow from '../components/UnitRow';

const UnitRowContainer = props => {
  const {addToResult, unitType, shouldFetch, increaseLoader, decreaseLoader, hasModifier, values, setValues} = props;
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [count, setCount] = useState(0);
  const [combat, setCombat] = useState(0);
  const [modifier, setModifier] = useState(0);
  useEffect(() => {
    setOptions(unitType.units.map(unit => ({label: unit.name, value: unit.id})));
  }, [unitType])
  useEffect(() => {
    setSelectedOption(options[0]);
  }, [options])
  useEffect(() => {
    if (selectedOption) {
      setCombat(find(unitType.units, {name: selectedOption.label}).combat);
    }
  }, [selectedOption])
  useEffect(() => {
    setModifier(hasModifier ? 1 : 0);
  }, [hasModifier]);
  const handleSelectChange = selected => {
    setSelectedOption(selected);
  };
  const getParams = () => {
    let params = '';
    if (selectedOption) {
      params += `id=${selectedOption.value}&`
    }
    if (count !== 1) {
      params += `count=${count}&`
    }
    if (modifier !== 0) {
      params += `modifier=${modifier}&`
    }
    return params
  };
  console.log(values);
  useEffect(() => {
    if (shouldFetch && count != 0 && combat !== 0) {
      increaseLoader();
      fetch(`http://localhost:8080/roll/${unitType.name.replace(/\s/g, '').toLowerCase()}?${getParams()}`)
        .then(res => res.json())
        .then(
          (result) => {
            addToResult(result);
            decreaseLoader();
          },
          (error) => {
            decreaseLoader();
          }
        )
    };
  }, [shouldFetch]);
  return (
    <UnitRow values={values} setValues={setValues} unitType={unitType} handleSelectChange={handleSelectChange} selectedOption={selectedOption} options={options} combat={combat} setCombat={setCombat} count={count} setCount={setCount} modifier={modifier} setModifier={setModifier} hasCombatInput={['Flagship', 'Space Cannon'].indexOf(unitType.name) !== -1} />
  );
};

export default UnitRowContainer;
