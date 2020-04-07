import 'react-native-get-random-values'; // react-native 中使用 uuid 需要的依赖
import {v4 as uuidv4} from 'uuid';
import AliyunOSS from 'aliyun-oss-react-native';
import {ossConfig} from '../../config_secret';
import {env} from '../../api/config';
import {Media, SingleMediaDisplay} from '../MdeiaList';
import React, {RefObject} from 'react';
import {View, Text} from 'react-native';
import {Color} from '../../config/color_yep';
import store from '../../../src/store';
import {EndUploadingType, StartUploadingType} from '../../store/oss/reducers';
import emitter, {CustomEvent} from '../Fbemitter';

const {endPoint, sts, bucket} = ossConfig;

export enum OSSEvent {
  UploadProgress = 'uploadProgress',
}

const configuration = {
  maxRetryCount: 3,
  timeoutIntervalForRequest: 30,
  timeoutIntervalForResource: 24 * 60 * 60,
};

// @ts-ignore
if (env !== 'prod') {
  AliyunOSS.enableDevMode();
}

AliyunOSS.initWithServerSTS(sts, endPoint, configuration);

export default AliyunOSS;

export async function uploadOSS(medias: Media[]) {
  if (medias && medias.length > 0 && !store.getState().oss.uploading) {
    // 通知 redux 显示上传
    store.dispatch({
      type: StartUploadingType,
      cover: {
        url: medias[0].url,
        type: medias[0].type,
      },
    });
    // 监听进度，更新进度 UI
    let count = 1;
    AliyunOSS.addEventListener(OSSEvent.UploadProgress, p => {
      const currentRate = p.currentSize / p.totalSize;
      if (currentRate === 1 && count < medias.length) count++;
      const totalRate = currentRate * (count / medias.length);
      emitter.emit(CustomEvent.OssProgress, totalRate);
    });
    // 开始遍历上传
    for (const media of medias) {
      try {
        const path = media.url;
        const suffix = path.split('.')[1];
        const remoteFileName = `${uuidv4()}.${suffix}`;
        media.url = remoteFileName;
        await AliyunOSS.asyncUpload(bucket, remoteFileName, path);
      } catch (e) {
        console.error(e);
        store.dispatch({type: EndUploadingType});
      }
    }
    console.log(medias);
    return medias;
  }
}

class OssProgressComponent extends React.PureComponent<{
  cover: Media;
}> {
  progressRef: RefObject<View> = React.createRef();

  progressTo = (rate: number) => {
    this.progressRef.current &&
      this.progressRef.current.setNativeProps({
        style: {width: `${rate * 100}%`},
      });
  };

  render() {
    return (
      <View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <SingleMediaDisplay media={this.props.cover} />
          <Text
            style={{
              marginLeft: 10,
              height: 18,
              lineHeight: 18,
              fontSize: 14,
              color: Color.fontGray,
            }}>
            正在发送
          </Text>
        </View>
        <View
          style={{
            height: 2,
            backgroundColor: Color.statusBlue3,
          }}>
          <View
            ref={this.progressRef}
            style={{
              height: 2,
              backgroundColor: Color.statusBlue2,
              width: '0%',
            }}
          />
        </View>
      </View>
    );
  }

  componentDidMount(): void {
    // @ts-ignore
    this.listener = emitter.addListener(CustomEvent.OssProgress, rate => {
      if (rate < 1) {
        this.progressTo(rate);
      } else {
        // 上传完了置空 oss store
        store.dispatch({type: EndUploadingType});
      }
    });
  }

  componentWillUnmount(): void {
    // @ts-ignore
    this.listener && this.listener.remove();
  }
}

export {OssProgressComponent};
