import React from 'react';
import {
  Image,
  ImageResizeMode,
  ImageStyle,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {Color} from '../../config/color_yep';

const iconNameSource = {
  ['account-black']: require('../../asset/icon/account-black.png'),
  ['account-fill-black']: require('../../asset/icon/account-fill-black.png'),
  ['add-black']: require('../../asset/icon/add-black.png'),
  ['add-fill-black']: require('../../asset/icon/add-fill-black.png'),
  ['favorites-black']: require('../../asset/icon/favorites-black.png'),
  ['favorites-fill-black']: require('../../asset/icon/favorites-fill-black.png'),
  ['home-black']: require('../../asset/icon/home-black.png'),
  ['home-fill-black']: require('../../asset/icon/home-fill-black.png'),
  ['message-black']: require('../../asset/icon/message-black.png'),
  ['message-fill-black']: require('../../asset/icon/message-fill-black.png'),
  ['add-without-circle-gray']: require('../../asset/icon/add-without-circle-gray.png'),
  ['play-gray']: require('../../asset/icon/play-gray.png'),
  ['community-black']: require('../../asset/icon/community-black.png'),
  ['location-black']: require('../../asset/icon/location-black.png'),
  ['arrow-left-black']: require('../../asset/icon/arrow-left-black.png'),
  ['search-gray']: require('../../asset/icon/search-gray.png'),
  ['hook-blue']: require('../../asset/icon/hook-blue.png'),
  ['location-blue']: require('../../asset/icon/location-blue.png'),
  ['location-fill-blue']: require('../../asset/icon/location-fill-blue.png'),
  ['plus-blue']: require('../../asset/icon/plus-blue.png'),
  ['more-black']: require('../../asset/icon/more-black.png'),
  ['collection-black']: require('../../asset/icon/collection-black.png'),
  ['collection-fill-yellow']: require('../../asset/icon/collection-fill-yellow.png'),
  ['favorites-fill-red']: require('../../asset/icon/favorites-fill-red.png'),
  ['comment-black']: require('../../asset/icon/comment-black.png'),
};

interface Props {
  name: string;
  style?: ImageStyle;
  resizeMode?: ImageResizeMode;
  size?: number;
  badgeNum?: number;
}

function Icon(props: Props) {
  const style: ImageStyle[] = [];
  if (props.size) style.push({width: props.size, height: props.size});
  if (props.style) style.push(props.style);

  let badgeNumText = '';
  if (props.badgeNum && props.badgeNum > 0) {
    badgeNumText = props.badgeNum > 99 ? '···' : props.badgeNum.toString();
  }

  const conStyle: ViewStyle = {
    position: 'absolute',
    backgroundColor: Color.remind1,
    borderRadius: 8,
    height: 16,
    justifyContent: 'center',
    paddingHorizontal: 5,
    minWidth: 16,
    top: -6,
    right: -10,
  };

  if (badgeNumText && badgeNumText.length === 3) {
    // 安卓 bug 99+ 不能把容器撑开，文字会换行。。。
    conStyle.width = 28;
  }
  if (badgeNumText && badgeNumText.length === 2) {
    // 安卓 bug 99 不能把容器撑开，文字会换行。。。
    conStyle.width = 22;
  }
  return (
    <View style={style}>
      <Image
        // @ts-ignore
        source={iconNameSource[props.name]}
        style={style}
        resizeMode={props.resizeMode || 'contain'}
      />
      {!!badgeNumText && (
        <View style={conStyle}>
          <Text
            style={{
              color: 'white',
              fontSize: 10,
              paddingTop: 2,
              lineHeight: 10,
            }}>
            {badgeNumText}
          </Text>
        </View>
      )}
    </View>
  );
}

export default Icon;
