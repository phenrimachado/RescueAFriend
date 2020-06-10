import React from 'react';
import RNPickerSelect from 'react-native-picker-select';

const InputSelect = () => {
  return (
    <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={[
            { label: 'DF', value: 'DF' },
            { label: 'Brasília', value: 'Brasília' },
        ]}
    />
  )
}

export default InputSelect;