import React, {ReactElement} from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

/**
 * props:
 * ref
 *
 * function
 * show: (value, duration, { icon }) => {} 弹出提示，value: 提示文字或组件；duration: 提示持续时间；icon: 文字左边的图像(Image)
 * */

export interface Props {}

interface State {
    value: ReactElement | string | undefined | null,
    visible: boolean,
    icon: ReactElement | undefined
}

class Toast extends React.Component<any, State> {

    private hiddenTimeoutId?: number;

    constructor(props: any) {
        super(props);
        this.state = {
            value: null,
            visible: false,
            icon: undefined
        };
    }

    public show(value: ReactElement | string, duration: number, options?: { icon: ReactElement }): void;
    public show(value: ReactElement | string, options?: { icon: ReactElement }): void;
    public show(value: ReactElement | string, ...args: any[]): void {
        let duration = 2000;
        let icon = undefined;
        if(args.length === 1) {
            const param: any = args[0];
            if(typeof param === "number") {
                duration = param;
            } else {
                icon = param.icon;
            }
        } else if(args.length === 2) {
            duration = args[0];
            icon = args[1];
        }
        this.setState({
            value, visible: true, icon
        });
        this.hiddenTimeoutId && clearTimeout(this.hiddenTimeoutId);
        this.hiddenTimeoutId = setTimeout(()=>{ this.setState({ visible: false }); }, duration);
    }

    render() {
        return (
            this.state.visible ?
                typeof this.state.value === 'string' ?
                    <View style={[ styles.container, styles.containerPosition ]}>
                        {this.state.icon}
                        {this.state.icon && <View style={{ width: 8 }}/>}
                        <Text style={styles.text}>{this.state.value}</Text>
                    </View>
                    :
                    <View style={styles.containerPosition}>{this.state.value}</View>
                :
                null
        );
    }

    componentWillUnmount(): void {
        this.hiddenTimeoutId && clearTimeout(this.hiddenTimeoutId);
    }
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 24,
        paddingRight: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#232229',
        flexDirection: 'row'
    },
    containerPosition: {
        position: 'absolute',
        top: SCREEN_HEIGHT / 2 - 30,
        alignSelf: 'center',
        borderRadius: 4,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 15,
        padding: 0,
    }
});

export default Toast;
