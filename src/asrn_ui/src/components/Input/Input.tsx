import React, {ReactElement} from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextStyle,
    Platform
} from 'react-native';

/**
 * props:
 * defaultValue: 默认值
 * value: 值（受控）
 * placeholder: 提示
 * auth: 验证码输入框（验证码输入框禁止修改 textStyle, 因为【获取验证码】按钮的样式固定）
 * style: 控制 container 的 margin
 * textStyle: 文字样式（尽量使用默认样式）
 * onChangeText: (text) => {} 输入框值变化后的回调，text: 当前输入框文字内容
 * authOnPress: () => {} 点击验证按钮回调，text: 当前输入框文字内容
 * authDisable: 验证码按钮是否可点击
 * label?: 输入框前面的提示文字
 * tip?: 输入框下方的提示文字
 * tipTextStyle?: tip 文字的样式
 *
 * todo: labelWidth?: label 的宽度 number '%'
 * */

export interface Props{
    defaultValue?: string,
    value?: string,
    placeholder?: string,
    auth?: boolean,
    style?: { margin?: number, marginTop?: number, marginBottom?: number, marginLeft?: number, marginRight?: number },
    textStyle?: object,
    onChangeText?: (text: string) => void,
    authOnPress?: () => void,
    authDisable?: boolean | undefined,
    keyboardType?: 'numeric' | 'default',
    label?: string,
    tip?: string,
    tipTextStyle?: TextStyle,
    editable?: boolean
}

interface State {
    counting: boolean,  // 是否在倒计时
    seconds: number     // 倒计时秒数
}

class Input extends React.Component<Props, State> {

    private setIntervalId: number | undefined;

    state: State = {
        counting: false,
        seconds: 59,
    };

    authOnpress = () => {
        if(!this.state.counting && !this.props.authDisable) {
            this.props.authOnPress && this.props.authOnPress();
            this.setState({
                counting: true,
                seconds: 59,
            }, () => {
                this.setIntervalId = setInterval(() => {
                    if(this.state.seconds > 0) {
                        this.setState((prevState) => ({ seconds: prevState.seconds - 1 }));
                    } else {
                        this.setState(() => ({ counting: false }));
                        this.setIntervalId && clearInterval(this.setIntervalId);
                    }

                }, 1000);
            });
        }
    };

    renderTextInput = () => {
        let { defaultValue, value, onChangeText, placeholder, auth, style, textStyle, authDisable, keyboardType, label, tip, editable } = this.props;
        // style: 能定制 container 的 margin
        // textStyle: 能定制 text 的 style
        if(auth) textStyle = {}; // auth 输入框禁止修改 textStyle, 因为【获取验证码】按钮的样式固定
        const AuthContainer: React.ReactType = !this.state.counting && !authDisable ? TouchableOpacity : View;

        const becauseofLabel = label ? { flex: 1 } : {};
        return (
            <View style={becauseofLabel} >
                <View style={[styles.container, style]}>
                    <TextInput
                        editable={editable === undefined ? true : editable}
                        style={[styles.input, textStyle]}
                        underlineColorAndroid="transparent"
                        defaultValue={defaultValue}
                        value={value}
                        placeholder={placeholder}
                        placeholderTextColor={'#B1B1B1'}
                        onChangeText={onChangeText}
                        keyboardType={keyboardType}
                    />
                    {
                        auth &&
                        <AuthContainer
                            style={(this.state.counting || authDisable) ? [styles.authContainer, styles.disableAuthContainer] : styles.authContainer }
                            onPress={this.authOnpress}
                        >
                            <Text style={(this.state.counting || authDisable) ? [styles.auth, styles.disableAuth] : styles.auth }>
                                {this.state.counting ? `${this.state.seconds}s` : '获取验证码'}
                            </Text>
                        </AuthContainer>
                    }
                </View>
                {tip && <Text style={styles.tipText}>{tip}</Text>}
            </View>
        );
    };

    render() {
        let { defaultValue, value, onChangeText, placeholder, auth, style, textStyle, authDisable, keyboardType, label, tip, editable } = this.props;
        // style: 能定制 container 的 margin
        // textStyle: 能定制 text 的 style
        if(auth) textStyle = {}; // auth 输入框禁止修改 textStyle, 因为【获取验证码】按钮的样式固定
        const AuthContainer: React.ReactType = !this.state.counting && !authDisable ? TouchableOpacity : View;

        return (
            <View style={[{flexDirection: 'row'}, style]}>
                {label && <Text style={styles.labelText}>{label}</Text>}
                <View style={{flex: 1}} >
                    <View style={[styles.container]}>
                        <TextInput
                            editable={editable === undefined ? true : editable}
                            style={[styles.input, textStyle]}
                            underlineColorAndroid="transparent"
                            defaultValue={defaultValue}
                            value={value}
                            placeholder={placeholder}
                            placeholderTextColor={'#B1B1B1'}
                            onChangeText={onChangeText}
                            keyboardType={keyboardType}
                        />
                        {
                            auth &&
                            <AuthContainer
                                style={(this.state.counting || authDisable) ? [styles.authContainer, styles.disableAuthContainer] : styles.authContainer }
                                onPress={this.authOnpress}
                            >
                                <Text style={(this.state.counting || authDisable) ? [styles.auth, styles.disableAuth] : styles.auth }>
                                    {this.state.counting ? `${this.state.seconds}s` : '获取验证码'}
                                </Text>
                            </AuthContainer>
                        }
                    </View>
                    {tip && <Text style={styles.tipText}>{tip}</Text>}
                </View>
            </View>
        )
    }

    componentWillUnmount(): void {
        this.setIntervalId && clearInterval(this.setIntervalId);
    }
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        paddingBottom: 12,
        paddingTop: 13,
    },
    input: {
        padding: 0,
        height: 22,
        lineHeight: 22,
        fontSize: 16,
        color: '#212121',
        top: Platform.OS === 'ios' ? -2 : 0,
    },
    authContainer: {
        width: 82,
        height: 36,
        borderWidth: 1,
        borderColor: 'rgba(153,153,153,1)',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 6,
        right: 0,
    },
    auth: {
        fontSize: 13,
        color: '#666666',
        padding: 0,
    },
    disableAuthContainer: {
        backgroundColor: '#F5F5F5',
        borderWidth: 0,
    },
    disableAuth: {
        color: '#999999'
    },
    labelText: {
        marginTop: 13,
        padding: 0,
        height: 22,
        lineHeight: 22,
        fontSize: 16,
        color: '#666666',
        width: 74,
        marginRight: 15,
    },
    tipText: {
        color: '#B1B1B1',
        fontSize: 11,
        marginTop: 10,
    },
});

export default Input;
