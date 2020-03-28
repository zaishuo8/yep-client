import React from 'react';
import {Modal as RNModal, View, Text, TouchableOpacity, StyleSheet, TextInput, Platform, TextStyle} from 'react-native';
import {Color} from "../../../../config/color";

/**
 * props:
 * visible: 是否显示对话框 true false
 * title: 对话框提示
 * options: 操作栏
 *      [ { text: '取消', onPress: ()=>{} }, { text: '确定', onPress: () => {} } ]
 *      options 长度为 1 时，就表示确定；长度为 2 时，左边取消，右边确定；最多只能传 2 个
 * */

export interface Props {
    visible: boolean,
    title: string,
    options: Array<{ text: string, onPress: (inputText?: string) => void }>
    textInput?: boolean,
    textInputPlaceHolder?: string,
}

interface State {
    visible: boolean,
    title: string,
    options: Array<{ text: string, onPress: (inputText?: string) => void }>
    textInput?: boolean,
    textInputPlaceHolder?: string,
    submitTitle?: string,
}

class Modal extends React.Component<Props, State> {
    private inputText?: string;

    constructor(props: Props) {
        super(props);
        const { visible, title, options, textInput, textInputPlaceHolder } = props;
        this.state = {
            visible, title, options, textInput, textInputPlaceHolder
        };
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        const { visible, title, options, textInput, textInputPlaceHolder } = nextProps;
        this.setState({
            visible, title, options, textInput, textInputPlaceHolder
        });
    }

    render() {


        const { visible, title, options, textInput, textInputPlaceHolder, submitTitle } = this.state;
        let modalContainerStyle = [styles.modalContainer];
        if (textInput && Platform.OS === 'ios') {
            // @ts-ignore 输入框键盘遮挡问题
            modalContainerStyle.push( { bottom: 100 } )
        }
        const modalTitleTextStyle = [styles.modalTitleText];
        const modalSubTitleTextStyle: TextStyle[] = [styles.modalSubTitle];
        if (title.length > 12) {
            // @ts-ignore 超过12个字字体变小
            modalTitleTextStyle.push({ fontSize: 14, lineHeight: 20 });
        }
        if (submitTitle && submitTitle.length > 14) {
            modalSubTitleTextStyle.push({ fontSize: 12, lineHeight: 16 });
        }
        return (
            <RNModal
                visible={visible}
                transparent={true}
                // 禁止 Android 返回键关闭 Modal
                onRequestClose={() => {}}
            >
                <View style={styles.container}>
                    <View style={modalContainerStyle}>
                        <View style={styles.modalTitleContainer}>
                            <Text style={modalTitleTextStyle}>{title}</Text>
                            {submitTitle && <Text style={modalSubTitleTextStyle}>{submitTitle}</Text>}
                        </View>
                        {
                            textInput &&
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={textInputPlaceHolder}
                                    onChangeText={text => this.inputText = text}
                                    multiline={true}
                                />
                            </View>
                        }
                        <View style={styles.modalOptionsContainer}>
                            {options.map((option, index) => {
                                // 最多只能两个 options
                                if(index < 2) {
                                    const { text, onPress } = option;
                                    const containerStyle: Array<object> = [ styles.optionContainer ];
                                    const textStyle: Array<object> = [ styles.optionText ];
                                    if(options.length === 1) {
                                        textStyle.push(styles.confirmTextColor);
                                    } else {
                                        if(index === 0) {
                                            textStyle.push(styles.cancelTextColor);
                                        } else {
                                            textStyle.push(styles.confirmTextColor);
                                            containerStyle.push({ borderLeftWidth: 1, borderLeftColor: '#EAEAEA' });
                                        }
                                    }
                                    return (
                                        <TouchableOpacity key={`t_${index}`} style={styles.modalOption} onPress={() => {
                                            this.setState({ visible: false });
                                            onPress(this.inputText);
                                        }}>
                                            <View style={containerStyle}>
                                                <Text style={textStyle}>{text}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }
                            })}
                        </View>
                    </View>
                </View>
            </RNModal>
        );
    }

    // 打开 modal
    show(title: string, options: Array<{ text: string, onPress: (inputText?: string) => void }>, textInput?: boolean, textInputPlaceHolder?: string, submitTitle?: string) {
        this.setState({
            visible: true,
            title, options, textInput, textInputPlaceHolder, submitTitle,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(35,34,41,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: 295,
        backgroundColor: 'background:rgba(255,255,255,1)',
        borderRadius: 5,
    },
    modalTitleContainer: {
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 30,
        paddingHorizontal: 20
    },
    modalTitleText: {
        padding: 0,
        color: '#212121',
        fontSize: 18,
    },
    modalSubTitle: {
        padding: 0,
        color: Color.font2,
        fontSize: 14,
        marginTop: 8,
    },
    modalOptionsContainer: {
        flexDirection: 'row',
        height: 50,
        borderTopColor: '#EAEAEA',
        borderTopWidth: 1,
    },
    modalOption: {
        flex: 1,
    },
    optionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        padding: 0,
        fontSize: 16,
    },
    cancelTextColor: {
        color: '#999999',
    },
    confirmTextColor: {
        color: '#EA0029',
    },
    textInputContainer: {
        marginHorizontal: 18,
        marginBottom: 30,
        height: 112,
        padding: 15,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#DDDDDD',
        borderRadius: 2,
    },
    textInput: {
        height: 82,
        fontSize: 15,
        lineHeight: 21,
        textAlignVertical: 'top',
        padding: 0,
    }
});

export default Modal;
