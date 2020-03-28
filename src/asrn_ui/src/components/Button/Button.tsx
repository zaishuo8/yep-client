/**
 * props:
 * type(颜色): primary(红底白字)、default(白底黑字)、 也支持传一个自定义颜色
 * disable: 禁用 (致灰)
 * size: 大小 s l
 * width: primary(充满)、auto(根据文字自适应)、[number](自定义宽度)
 * style: 样式，只能控制 container 的 margin 或者 flex: number 容器宽度
 * icon: 文字左边的图标 <Image/>
 * onPress: 点击回调函数 () => {}
 * */
import {Color} from "../../../../config/color";

export interface Props {
    type?: 'primary' | 'default' | 'normal' | string,
    disable?: boolean,
    size?: 's' | 'l' | 'xs',
    width?: 'primary' | 'auto' | number,
    style?: { marginTop?: number, marginBottom?: number, marginLeft?: number, marginRight?: number, margin?: number, flex?: number, marginVertical?: number, marginHorizontal?: number },
    icon?: ReactElement,
    onPress?: () => void,
    children: string,
    color?: string,
}

interface State {}

import React, {ReactElement} from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';

class Button extends React.Component<Props, State> {

    setTimeoutId: number = 0;

    private setStyleFromProps = (props: Props): { containerStyle: object, textStyle: object } => {
        const { type, disable, size, width } = props;
        const containerStyle = { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' };
        const textStyle = { padding: 0 };
        switch(type) {
            case 'primary':
                Object.assign(containerStyle, { backgroundColor: Color.primary });
                Object.assign(textStyle, { color: '#FFFFFF' });
                break;
            case 'normal':
                Object.assign(containerStyle, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Color.primary });
                Object.assign(textStyle, { color: Color.primary });
                break;
            /*case "normal":
                Object.assign(containerStyle, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EA0029' });
                Object.assign(textStyle, { color: '#EA0029' });
                break;*/
            /*case undefined:
                Object.assign(containerStyle, { backgroundColor: '#EA0029' });
                Object.assign(textStyle, { color: '#FFFFFF' });
                break;*/
            default:
                Object.assign(containerStyle, { backgroundColor: type });
                Object.assign(textStyle, { color: '#FFFFFF' });
        }
        if(disable) {
            Object.assign(containerStyle, { backgroundColor: '#EEEEEE' });
            Object.assign(textStyle, { color: '#999999' });
        }
        switch(size) {
            case 'xs':
                Object.assign(containerStyle, { height: 30, borderRadius: 6 });
                Object.assign(textStyle, { fontSize: 13 });
                break;
            case 's':
                Object.assign(containerStyle, { height: 36, borderRadius: 8 });
                Object.assign(textStyle, { fontSize: 15 });
                break;
            case 'l':
                Object.assign(containerStyle, { height: 44, borderRadius: 10 });
                Object.assign(textStyle, { fontSize: 17 });
                break;
            default:
                Object.assign(containerStyle, { height: 47, borderRadius: 12 });
                Object.assign(textStyle, { fontSize: 16 });
        }
        switch(width) {
            case 'primary' || undefined:
                break;
            case 'auto':
                Object.assign(containerStyle, { alignSelf: 'flex-start', paddingHorizontal: 12 });
                break;
            default:
                Object.assign(containerStyle, { width });
        }
        return { containerStyle, textStyle };
    };

    render() {
        const { containerStyle, textStyle } = this.setStyleFromProps(this.props);
        const { style, children, onPress, disable, icon } = this.props;
        const Container: React.ReactType = (disable || !onPress) ? View : TouchableOpacity;
        return (
            <Container style={style} onPress={this.onPress}>
                <View style={[ containerStyle ]}>
                    {icon}{icon && <View style={{width: 10}}/>}
                    <Text style={textStyle}>{children}</Text>
                </View>
            </Container>
        );
    }

    onPress = () => {
        this.setTimeoutId && clearTimeout(this.setTimeoutId);
        this.setTimeoutId = setTimeout(() => {
            this.props.onPress && this.props.onPress();
        }, 300);
    };

    componentWillUnmount(): void {
        this.setTimeoutId && clearTimeout(this.setTimeoutId);
    }
}

const styles = StyleSheet.create({});

export default Button;
