import React from 'react';
import {
  ImageProps,
  ImageResizeMode,
  StyleSheet,
  Image,
  ImageStyle, ImageSourcePropType,
} from 'react-native';
import {Color} from '../../config/color_yep';
import {resizeOssImgSize} from '../../utils/mediaUtil';

const defaultAvatar = require('../../asset/images/avatar_default.jpg');

// @ts-ignore
interface Props extends ImageProps {
  // @ts-ignore 不需要source参数
  source?: ImageSourcePropType;
  uri?: string;
  size?: number;
  resizeMode?: ImageResizeMode;
}

function Index(props: Props) {
  const {uri, size, resizeMode, ...restImageProps} = props;
  const style: ImageStyle[] = [
    {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color.splitLine1,
    },
  ];
  if (size) {
    style.push({
      width: size,
      height: size,
      borderRadius: size / 2,
    });
  }
  return (
    <Image
      style={style}
      source={uri ? {uri: resizeOssImgSize(uri)} : defaultAvatar}
      resizeMode={resizeMode || 'cover'}
      {...restImageProps}
    />
  );
}

export default Index;
