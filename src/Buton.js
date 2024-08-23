import { View, Text,TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

export default function Buton({bgColor, btnLabel,textColor,Press,marginV, widthv, marginL, disabledButon}) {
  return (
    <TouchableOpacity
    onPress={Press}
    disabled={disabledButon}
      style={{
        backgroundColor: bgColor,
        borderRadius: 20,
        alignItems: 'center',
        marginLeft: marginL,
        width: widthv,
        paddingVertical: 10,
        marginVertical: marginV,        
      }}>
      <Text style={{color: textColor, fontSize: 24, fontWeight: '200'}}>
        {btnLabel}
      </Text>
    </TouchableOpacity>
  )
}