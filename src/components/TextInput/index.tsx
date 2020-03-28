import 'react-native-gesture-handler';

import React from 'react';
import {View, TextInput, TextInputProps} from 'react-native';
import {Color} from '../../config/color_yep';

function Index(props: TextInputProps) {
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 15,
        height: 125,
        backgroundColor: Color.bgPrimary,
      }}>
      <TextInput
        style={{
          fontSize: 16,
          flex: 1,
          lineHeight: 24,
          alignItems: 'flex-start',
          textAlignVertical: 'top',
          padding: 0,
          color: Color.primary,
        }}
        {...props}
      />
    </View>
  );
}

export default Index;
