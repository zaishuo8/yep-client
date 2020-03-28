import React from 'react';
import { Modal, View, Text, Animated, Easing, StyleSheet } from 'react-native';

/*
* <Loading ref={this.loading} />
*
* this.loading.show(text: string);
* this.loading.hide();
* */
interface Props {}

interface State {
    loading: boolean,
    loadingText: string,
}

export default class Loading extends React.Component<Props, State>{

    rotate: Animated.Value = new Animated.Value(0);
    animating: boolean = false;

    constructor(props: Props){
        super(props);
        this.state = {
            loading: false,
            loadingText: '加载中...'
        };
        this.rotate = new Animated.Value(0);
        this.animating = false;
    }
    render(){
        let loadingContainerStyle = {};
        let imgStyle = {};
        let textStyle = {};
        if (this.state.loadingText){
            // 有文字
            imgStyle = { marginTop: 28 };
            textStyle = { marginTop: 18 };
        } else {
            // 没有文字
            loadingContainerStyle = { justifyContent: 'center' };
        }
        return (
            <Modal visible={this.state.loading} transparent={true} onRequestClose={() => {}}>
                <View style={styles.container}>
                    <View style={[styles.loadingContainer, loadingContainerStyle]}>
                        <Animated.Image
                            style={[styles.loadingImg, imgStyle, {
                                transform:[{
                                    rotate: this.rotate.interpolate({
                                        inputRange: [0, 360],
                                        outputRange: ['0deg', '360deg']
                                    })
                                }]
                            }]}
                            source={require('../../../asset/images/loading.png')}
                            resizeMode={'contain'}
                        />
                        {this.state.loadingText ? <Text style={[styles.loadingText, textStyle]}>{this.state.loadingText}</Text> : null}
                    </View>
                </View>
            </Modal>
        );
    }
    loadingAnimation(){
        this.rotate.setValue(0);
        this.animating = true;
        Animated.timing(
            this.rotate, {
                toValue: 3600,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start();
    }
    show(text: string){
        this.setState({
            loading: true,
            loadingText: text,
        }, () => {
            if (!this.animating) {
                this.loadingAnimation();
            }
        });
    }
    hide(){
        this.setState({loading: false}, () => {
            this.animating = false;
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        width: 120,
        height: 120,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        alignItems: 'center',
    },
    loadingImg: {
        width: 36,
        height: 36,
    },
    loadingText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
});
