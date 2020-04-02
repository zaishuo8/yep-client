import React from 'react';
import {
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Color} from '../../config/color_yep';
import Icon from '../Icon';

interface Props extends TextInputProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Index(props: Props) {
  const {style, textStyle, ...textInputProps} = props;
  return (
    <View
      style={[
        {
          height: 28,
          borderRadius: 14,
          paddingHorizontal: 10,
          backgroundColor: Color.bgGray,
          flexDirection: 'row',
          alignItems: 'center',
        },
        style,
      ]}>
      <Icon name={'search-gray'} size={20} style={{marginRight: 8}} />
      <TextInput
        style={[
          {
            fontSize: 14,
            flex: 1,
            padding: 0,
            color: Color.fontGray,
            marginRight: 6,
            paddingTop: 1,
          },
          textStyle,
        ]}
        {...textInputProps}
      />
    </View>
  );
}
