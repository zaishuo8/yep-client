import React from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet, Text, TouchableWithoutFeedback,
    View,
} from "react-native";

const SCREEN = Dimensions.get('window');
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

interface Props {}

interface ButtonProps {
    text: string,
    onClick?: () => void,
}

interface State {
    modalVisible: boolean,
    position: { pageX: number, pageY: number },
    buttonList: ButtonProps[],
}

export default class Popover extends React.Component<Props, State> {

    state: State = {
        modalVisible: false,
        position: { pageX: 0, pageY: 0 },
        buttonList: [],
    };

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}
            >
                <View style={styles.bg}>
                    <TouchableWithoutFeedback onPress={() => this.hide()}>
                        <View style={styles.touchableBg}/>
                    </TouchableWithoutFeedback>
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        position: 'absolute',
                        top: this.state.position.pageY + 32,
                        left: this.state.position.pageX,
                    }}>
                        <View
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 2,
                                // ios shadow
                                shadowOffset: {width: 0, height: 0,},
                                shadowColor: 'rgba(202, 202, 202, 0.5)',
                                shadowOpacity: 1.0,
                                shadowRadius: 10,
                                // android shadow
                                elevation: 8,
                            }}
                        >
                            {this.state.buttonList.map((button: ButtonProps, index: number) => (
                                <TouchableWithoutFeedback
                                    key={index.toString()}
                                    onPress={() => {
                                        this.hide(() => {button.onClick && button.onClick()});
                                    }}
                                >
                                    <View style={{ padding: 15, }}>
                                        <Text style={{ fontSize: 15, color: '#666666', padding: 0, }}>{button.text}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            ))}
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                top: -5,
                                left: 12,
                                backgroundColor: '#FFFFFF',
                                width: 10,
                                height: 10,
                                transform: [{rotate:'45deg'}],
                                // ios shadow
                                shadowOffset: {width: 0, height: 0,},
                                shadowColor: 'rgba(202, 202, 202, 0.5)',
                                shadowOpacity: 1.0,
                                shadowRadius: 10,
                                // android shadow
                                elevation: 8,
                            }}
                        />
                    </View>
                </View>
            </Modal>
        );
    }

    show = (position: { pageX: number, pageY: number }, buttonList: ButtonProps[] = []) => {
        this.setState({
            modalVisible: true,
            position,
            buttonList,
        });
    };

    hide = (cb?: () => void) => {
        this.setState({
            modalVisible: false
        }, () => {
            cb && cb();
        });
    };
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.57)',
    },
    touchableBg: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
});
