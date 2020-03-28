import 'react-native-gesture-handler';

import React from 'react';
import {
  View,
  Platform,
  TextStyle,
  TouchableOpacity,
  Text,
  StyleSheet, ViewStyle,
} from 'react-native';
import {afterIPhoneX} from '../../utils/deviceUtil';
import {Color} from '../../config/color_yep';
import Icon from '../Icon';

interface Props {
  title?: string;
  titleStyle?: TextStyle;
  leftTitle?: string;
  leftTitleStyle?: TextStyle;
  rightTitle?: string;
  rightTitleStyle?: TextStyle;
  onLeftPress?: () => void;
  headerStyle?: ViewStyle;
}

function Index(props: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: Color.bgPrimary,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: Color.splitLine1,
        },
        props.headerStyle,
      ]}>
      <View
        style={{height: afterIPhoneX() ? 44 : Platform.OS === 'ios' ? 20 : 10}}
      />
      <View
        style={{
          height: 44,
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
          onPress={() => {
            props.onLeftPress && props.onLeftPress();
          }}>
          {props.leftTitle ? (
            <Text style={[styles.defaultLeftText, props.leftTitleStyle]}>
              {props.leftTitle || ''}
            </Text>
          ) : (
            <Icon name={'arrow-left-black'} size={16} />
          )}
        </TouchableOpacity>
        <Text style={[styles.defaultTitleText, props.titleStyle]}>
          {props.title || ''}
        </Text>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          <Text style={[styles.defaultRightText, props.rightTitleStyle]}>
            {props.rightTitle || ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  defaultTitleText: {
    height: 24,
    lineHeight: 24,
    fontSize: 18,
    color: Color.primary,
  },
  defaultLeftText: {
    height: 20,
    lineHeight: 20,
    fontSize: 16,
    color: Color.primary,
  },
  defaultRightText: {
    height: 20,
    lineHeight: 20,
    fontSize: 16,
    color: Color.primary,
  },
});

export default Index;
