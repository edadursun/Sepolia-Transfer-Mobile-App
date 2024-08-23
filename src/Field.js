import React from 'react';
import {TextInput} from 'react-native';

const Field = props => {
  return (
    <TextInput
      {...props}
      style={{borderRadius: 100, color:"#4d031f", paddingHorizontal: 10, width: '78%',height: '8%', backgroundColor: 'rgb(220,220, 220)', marginVertical: 15}}
      placeholderTextColor={"#4d031f"}></TextInput>
  );
};

export default Field;