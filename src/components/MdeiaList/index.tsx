import React from 'react';
import {View, Image, TouchableWithoutFeedback, ImageProps} from 'react-native';
import {Color} from '../../config/color_yep';
import Icon from '../Icon';
import Video from 'react-native-video';
import {resizeOssImgSize} from "../../utils/mediaUtil";

export enum MediaType {
  Image = '1',
  Video = '2',
}

export interface Media {
  type: MediaType;
  url: string;
}

interface Props {
  mediaList: Media[];
  containerWidth: number;
  showAdd?: boolean; // 是否显示添加按钮
  onAddPress?: () => void; // 点击添加按钮
}

function getImageParams(containerWidth: number) {
  const imgRowNum = 3;
  const interval = 10;
  const containerPadding = 15;
  return {
    imgRowNum,
    interval,
    containerPadding,
    imgWidth:
      (containerWidth - containerPadding * 2 - (imgRowNum - 1) * interval) /
      imgRowNum,
  };
}

export default function Index(props: Props) {
  const {mediaList, containerWidth} = props;

  const {imgRowNum, interval, imgWidth, containerPadding} = getImageParams(
    containerWidth,
  );

  return (
    <View
      style={{
        width: containerWidth,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: containerPadding,
      }}>
      {mediaList.map((media, index) => {
        let {type, url} = media;

        const style = {
          width: imgWidth,
          height: imgWidth,
          marginRight: (index + 1) % imgRowNum === 0 ? 0 : interval,
          marginTop: index > imgRowNum - 1 ? interval : 0,
        };
        if (type === MediaType.Image) {
          return (
            <Image
              key={index.toString()}
              source={{uri: url}}
              style={style}
              resizeMode={'cover'}
            />
          );
        } else {
          return (
            <View key={index.toString()} style={style}>
              <Video
                style={{width: imgWidth, height: imgWidth}}
                source={{uri: url}} // Can be a URL or a local file.
                resizeMode={'cover'}
                muted={true}
                // ref={(ref) => {
                //   this.player = ref
                // }}                                      // Store reference
                // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                // onError={this.videoError}               // Callback when video cannot be loaded
              />
              <View
                style={{
                  position: 'absolute',
                  width: imgWidth,
                  height: imgWidth,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name={'play-gray'} size={imgWidth / 3} />
              </View>
            </View>
          );
        }
      })}
      {props.showAdd && (
        <TouchableWithoutFeedback
          onPress={() => {
            props.onAddPress && props.onAddPress();
          }}>
          <View
            style={{
              width: imgWidth,
              height: imgWidth,
              backgroundColor: Color.bgGray,
              marginTop: mediaList.length >= imgRowNum ? interval : 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name={'add-without-circle-gray'} size={40} />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

interface SingleMediaDisplayProps {
  media: Media;
  size?: number;
  resize?: number;
}

const defaultSingleSize = 30;

export function SingleMediaDisplay(
  singleMediaDisplayProps: SingleMediaDisplayProps,
) {
  const {media, size, resize} = singleMediaDisplayProps;
  let {url, type} = media;
  if (type === MediaType.Image) {
    if (resize) {
      url = resizeOssImgSize(url, {size: resize});
    }
    return (
      <Image
        source={{uri: url}}
        style={{
          width: size || defaultSingleSize,
          height: size || defaultSingleSize,
        }}
        resizeMode={'cover'}
      />
    );
  } else {
    return (
      <Video
        style={{
          width: size || defaultSingleSize,
          height: size || defaultSingleSize,
        }}
        source={{uri: url}} // Can be a URL or a local file.
        resizeMode={'cover'}
        muted={true}
      />
    );
  }
}
