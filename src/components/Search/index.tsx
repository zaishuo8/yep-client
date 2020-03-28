import React from 'react';
import {TextInput, View, ViewStyle} from 'react-native';
import {Color} from '../../config/color_yep';
import Icon from '../Icon';

interface Props {
  style?: ViewStyle;
}

export default function Index(props: Props) {
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
        props.style,
      ]}>
      <Icon name={'search-gray'} size={20} style={{marginRight: 8}} />
      <TextInput
        style={{
          fontSize: 14,
          flex: 1,
          padding: 0,
          color: Color.fontGray,
          marginRight: 6,
        }}
        placeholder={'搜索圈子'}
      />
    </View>
  );
}
