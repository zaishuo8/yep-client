/**
 * props:
 * width: 宽度，默认充满父容器
 * height: 不填默认 4
 * progress: 进度，[0, 1] 之间的数，默认 0
 * tintColor: 背景色，默认 #CACACA
 * trackColor: 轨道色，默认 #309C26
 * */


export interface Props {
    width?: number,
    height?: number,
    progress?: number,
    tintColor?: string,
    trackColor?: string,
    style?: {
        position?: 'absolute', top?: number, bottom?: number, left?: number, right?: number,
        margin?: number, marginTop?: number, marginBottom?: number, marginLeft?: number, marginRight?: number, marginVertical?: number, marginHorizontal?: number
    }
}

interface State {}

import React, {RefObject} from 'react';
import { StyleSheet, View } from 'react-native';

class Progress extends React.Component<Props, State> {

    private progress: RefObject<View>;

    constructor(props: Props) {
        super(props);
        this.progress = React.createRef();
    }

    progressTo(progress: number): void {
        this.progress && this.progress.current && this.progress.current.setNativeProps({ style: { width: `${progress * 100}%` } });
    }

    render() {
        let { width, height, progress, tintColor, trackColor, style } = this.props;
        if (progress && progress > 1) progress = 1;
        height = height || 4;
        const containerStyle: Array<object> = [{
            height, backgroundColor: tintColor || '#CACACA',
            borderRadius: height / 2
        }];
        const trackStyle = {
            height,
            backgroundColor: trackColor || '#309C26',
            borderRadius: height / 2,
            width: progress ? `${progress * 100}%` : 0
        };
        if(width) {
            containerStyle.push({ width });
        }
        return (
            <View style={[containerStyle, style]}>
                <View ref={this.progress} style={trackStyle}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({});

export default Progress;
