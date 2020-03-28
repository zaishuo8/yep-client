import React, {RefObject} from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    Platform,
    InteractionManager, ViewStyle, Keyboard,
} from 'react-native';
import { afterIPhoneX } from '../../util/deviceUtil';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const ANDROID_STATUS_BAR_HEIGHT = 24;
/**
 * 动画状态
 */
const ANIMATE_STATUS = {
    /**
     * 空闲
     */
    IDLE: 0,
    /**
     * “显示”动画过程中
     */
    SHOWING: 1,
    /**
     * “隐藏”动画过程中
     */
    HIDDING: 2,
};

/*Popup.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    homeIndicatorStyle: View.propTypes.style,
};

Popup.defaultProps = {
    visible: false,
};*/

export interface Props {
    visible: boolean,
    onClose?: () => void,
    homeIndicatorStyle?: ViewStyle
}

interface State {
    visible: boolean,
    popupAnimatedValue: Animated.Value,
    WindowHeight: Animated.Value,
    animatedBottom: Animated.Value,
}

class Popup extends React.Component<Props, State> {

    // private _contentHeight = WINDOW_HEIGHT - (Platform.OS === 'android' ? ANDROID_STATUS_BAR_HEIGHT : 0);
    private _contentHeight = WINDOW_HEIGHT;
    private _layouted = false;
    private _onceLayouted = false;
    private _animateStatus = ANIMATE_STATUS.IDLE;
    private _backdropAnimatedValue: Animated.Value;
    private _showActionStashed = false;
    private _hideActionStashed = false;
    private _showAnimation: any;
    private _hideAnimation: any;
    private _interactionHandler: any;
    private contentContainer: RefObject<View> = React.createRef();

    constructor(props: Props) {
        super(props);

        this.state = {
            visible: props.visible,
            popupAnimatedValue: new Animated.Value(0),
            WindowHeight: new Animated.Value(WINDOW_HEIGHT),
            animatedBottom: new Animated.Value(-WINDOW_HEIGHT),
        };
        this._backdropAnimatedValue = new Animated.Value(props.visible ? 1 : 0);

        if (this.state.visible) {
            // 如果初始状态 visible 为 true，则暂存“显示”操作，等 layout 完成后执行“显示”操作
            this._showActionStashed = true;
        }

        this._handleLayout = this._handleLayout.bind(this);
        this._handleRequestClose = this._handleRequestClose.bind(this);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.visible !== this.props.visible) {
            if (nextProps.visible) {
                this.setState({
                    visible: true,
                });
                this._show();
            } else {
                this._hide(() => {
                    this.setState({
                        visible: false,
                    });
                });
            }
        }
    }

    _adjustPosition() {
        if (this._animateStatus === ANIMATE_STATUS.IDLE) {
            this.state.popupAnimatedValue.setValue(-this._contentHeight);
        }
    }

    _show() {
        if (!this._layouted) {
            // 如果还没有 layout，则暂存“显示”操作，等 layout 完成后执行“显示”操作
            this._hideActionStashed = false;
            this._showActionStashed = true;
            return;
        }
        if (this._animateStatus === ANIMATE_STATUS.SHOWING) {
            // 防止重复动画
            return;
        }
        this._hideAnimation && this._hideAnimation.stop();
        this._animateStatus = ANIMATE_STATUS.SHOWING;
        // 注册动画，方便调度
        this._interactionHandler && InteractionManager.clearInteractionHandle(this._interactionHandler);
        this._interactionHandler = InteractionManager.createInteractionHandle();
        Animated.timing(
            this._backdropAnimatedValue,
            {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }
        ).start();
        this._showAnimation = Animated.timing(
            /*this.state.popupAnimatedValue,
            {
                toValue: -this._contentHeight,
                duration: 300,
                useNativeDriver: Platform.OS !== 'ios' ? true : false,
            }*/
            this.state.animatedBottom,
            {
                toValue: 0,
                duration: 300,
                // useNativeDriver: Platform.OS !== 'ios' ? true : false,
            }
        );
        this._showAnimation.start(() => {
            // 动画结束
            this._animateStatus = ANIMATE_STATUS.IDLE;
            this._interactionHandler && InteractionManager.clearInteractionHandle(this._interactionHandler);
        });
    }

    _hide(updateState: any) {
        if (!this._layouted) {
            // 如果还没有 layout，则暂存“隐藏”操作，等 layout 完成后执行“隐藏”操作
            this._showActionStashed = false;
            this._hideActionStashed = true;
            return;
        }
        if (this._animateStatus === ANIMATE_STATUS.HIDDING) {
            // 防止重复动画
            return;
        }
        this._showAnimation && this._showAnimation.stop();
        this._animateStatus = ANIMATE_STATUS.HIDDING;
        // 注册动画，方便调度
        this._interactionHandler && InteractionManager.clearInteractionHandle(this._interactionHandler);
        this._interactionHandler = InteractionManager.createInteractionHandle();
        Animated.timing(
            this._backdropAnimatedValue,
            {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }
        ).start();
        this._hideAnimation = Animated.timing(
            /*this.state.popupAnimatedValue,
            {
                toValue: 0,
                duration: 300,
                useNativeDriver: Platform.OS !== 'ios' ? true : false,
            }*/
            this.state.animatedBottom,
            {
                toValue: -WINDOW_HEIGHT,
                duration: 300,
                // useNativeDriver: Platform.OS !== 'ios' ? true : false,
            }
        );
        this._hideAnimation.start(() => {
            // 动画结束
            if (this._animateStatus !== ANIMATE_STATUS.SHOWING) {
                updateState();
                this._layouted = false;
            }
            this._animateStatus = ANIMATE_STATUS.IDLE;
            this._interactionHandler && InteractionManager.clearInteractionHandle(this._interactionHandler);
        });
    }

    _dismiss() {
        const { onClose } = this.props;
        onClose && onClose();
    }

    _handleLayout(e: any) {
        const isContentHeightChanged = this._contentHeight !== e.nativeEvent.layout.height;
        this._contentHeight = e.nativeEvent.layout.height;
        if (this._layouted && !isContentHeightChanged) { return; }
        if (isContentHeightChanged && this.state.visible && this._onceLayouted) {
            // 如果高度变化、弹出框为显示状态且已经 layout 过一次，则调整弹出框位置
            this._adjustPosition();
        }
        this._layouted = true;
        this._onceLayouted = true;
        // 消费暂存的操作
        if (this._showActionStashed) {
            this._show();
            this._showActionStashed = false;
        }
        if (this._hideActionStashed) {
            this._hide(() => {
                this.setState({
                    visible: false,
                });
            });
            this._showActionStashed = true;
        }
    }

    _handleRequestClose() {
        this.props.onClose && this.props.onClose();
    }

    render() {
        const { children, homeIndicatorStyle } = this.props;
        return (
            <Modal transparent={true} visible={this.state.visible} onRequestClose={this._handleRequestClose}>
                {/* popover 的背景，点击后关闭 popover */}
                <Animated.View
                    style={[
                        styles.backdrop,
                        { opacity: this._backdropAnimatedValue }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.backdropWrapper}
                        activeOpacity={1}
                        onPress={() => this._dismiss()}
                    >
                        <Animated.View
                            ref={this.contentContainer}
                            style={[
                                styles.container,
                                {bottom: this.state.animatedBottom},
                                // {transform: [{translateY: this.state.popupAnimatedValue}]}
                                // {transform: [{translateY: -672}]}
                                // {top: WINDOW_HEIGHT - 642}
                            ]}
                            onLayout={this._handleLayout}
                        >
                            {/* 一个没有绑定 press 事件的 Touchable* 可以阻止事件冒泡 */}
                            <TouchableOpacity activeOpacity={1}>
                                {children}
                            </TouchableOpacity>
                            {/* iPhoneX 下巴占位 */}
                            {afterIPhoneX() ? <View style={[styles.homeIndicator, homeIndicatorStyle]} /> : null}
                        </Animated.View>
                    </TouchableOpacity>
                </Animated.View>
            </Modal>
        );
    }

    componentDidMount(): void {
        if (Platform.OS === 'android') {
            // @ts-ignore
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
                this.keyboardShow(e);
            });
            // @ts-ignore
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                this.keyboardHide();
            })
        }
    }

    keyboardShow = (e: {endCoordinates: {height: number}}) => {
        const keyboardHeight = e.endCoordinates.height;
        this.contentContainer.current && this.contentContainer.current.setNativeProps({ style: {
                transform: [{translateY: keyboardHeight}]
            }})
    }

    keyboardHide = () => {
        this.contentContainer.current && this.contentContainer.current.setNativeProps({ style: {
                transform: [{translateY: 0}]
            }})
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        // top: WINDOW_HEIGHT - (Platform.OS === 'android' ? ANDROID_STATUS_BAR_HEIGHT : 0),
        // top: WINDOW_HEIGHT,
        left: 0,
        right: 0,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    backdropWrapper: {
        flex: 1,
    },
    homeIndicator: {
        height: 34,
        backgroundColor: '#FFFFFF',
    },
});

export default Popup;
