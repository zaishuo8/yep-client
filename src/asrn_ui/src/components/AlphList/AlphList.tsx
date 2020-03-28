import React, {RefObject} from 'react';
import { View, Text, TouchableWithoutFeedback, PanResponder, Platform, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// import FontSize from '../../const/FontSize';
// import Color from '../../const/Color';
// import styleUtil from '../../util/styleUtil';

/*AlphList.propTypes = {
    list: PropTypes.array,
    defaultValue: PropTypes.string,
    onValueChange: PropTypes.func,
};*/

interface Props {
    list: string[],
    defaultValue: string,
    onValueChange: (value: string, index: number) => void,
}

interface State {
    iconShow: boolean,
}

export default class AlphList extends React.Component<Props, State> {

    private selectedIndex: number;
    private moving: boolean;
    private _gestureStartIndex: number = 0;
    private _panResponder: any;
    private _floatIcon: RefObject<View> = React.createRef();
    private _floatText: RefObject<TextInput> = React.createRef();

    constructor(props: Props){
        super(props);
        this.state = {
            iconShow: false
        };
        this.selectedIndex = this._getIndexFromValue(this.props.defaultValue, this.props.list);
        this.moving = false;  // 用于标注 panResponder 是否在 moving
    }
    setSelectedValue(value: string){
        if (!this.moving){
            this._changeSelectedIndex(this._getIndexFromValue(value, this.props.list));
        }
    }
    componentWillMount(){
        // @ts-ignore
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            /*
            * 设置不捕获手势监听，onPressIn 优先执行，设置好当前的 selectedIndex; 但是 pressIn 后, move 之前, onPanResponderGrant 不会触发
            * 在手势开始回调中记录当前 selectedIndex 到 this._gestureStartIndex
            * 在手势滑动时通过滑动距离和 this._gestureStartIndex 计算实时选中值
            * */
            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。
                this._gestureStartIndex = this.selectedIndex;
                if (!this.state.iconShow){
                    this.setState({iconShow: true});
                }
                this.moving = true;
            },
            /*
            * 手指在索引栏移动时通过垂直方向上的移动距离来计算当前选中值
            * 在 ios 中，evt.nativeEvent.locationY 是触点距离 刚开始移动的那一刻的触点的 textContainer 的距离
            * 在 android 中，evt.nativeEvent.locationY 一直是首次触点距离其 textContainer 的距离，不会随着滑动变化
            * gestureState.dy 为滑动距离
            * */
            onPanResponderMove: (evt, gestureState) => {
                // 移动手指，选中索引变化
                let list = this.props.list;
                let index;
                if (Platform.OS === 'ios') {
                    index = this._getIndexFromY(evt.nativeEvent.locationY) + this._gestureStartIndex;
                } else {
                    index = this._getIndexFromY(gestureState.dy) + this._gestureStartIndex;
                }
                if (index < 0) {index = 0;}
                if (index > list.length - 1) {index = list.length - 1;}
                if (index !== this.selectedIndex) {
                    this._changeSelectedIndex(index);
                    this.props.onValueChange && this.props.onValueChange(this.props.list[index], index);
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // 手指离开屏幕
                if (this.state.iconShow){
                    this.setState({iconShow: false});
                }
                this.moving = false;
            },
        });
    }
    render(){
        return (
            <View style={styles.alphlistContainer}>
                <View>
                    <View
                        {...this._panResponder.panHandlers}
                    >
                        {this.props.list.map((item, index)=>{
                            const selectedContainerStyle = this.selectedIndex === index ? {backgroundColor: primary} : null;
                            const selectedTextStyle = this.selectedIndex === index ? {color: g5} : null;
                            return (
                                <TouchableWithoutFeedback key={index} onPressIn={this._onPressIn.bind(this, index)} onPressOut={this._onPressOut.bind(this)} onLongPress={this._onLongPress.bind(this)}>
                                    <View
                                        ref={(com)=>{
                                            // @ts-ignore
                                            this['_view' + index] = com;
                                        }}
                                        key={index} style={[styles.textContainer, selectedContainerStyle]}
                                    >
                                        <Text
                                            ref={(com)=>{
                                                // @ts-ignore
                                                this['_text' + index] = com;
                                            }}
                                            style={[styles.text, selectedTextStyle]}
                                        >{item}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })}
                    </View>
                    {
                        this.state.iconShow ?
                            <View ref={this._floatIcon} style={[styles.floatIcon, {top: -16 + 18 * this.selectedIndex}]}>
                                <View style={styles.triangle}/>
                                <View style={styles.circle}>
                                    <TextInput underlineColorAndroid={'transparent'} ref={this._floatText} editable={false} style={styles.circleText} defaultValue={this.props.list[this.selectedIndex]}/>
                                </View>
                            </View>
                            :
                            null
                    }
                </View>
            </View>
        );
    }
    _getIndexFromY(dy: number){
        return Math.floor(dy / 18);
    }
    _onPressIn(index: number){
        this._changeSelectedIndex(index);
        this.props.onValueChange && this.props.onValueChange(this.props.list[index], index);
    }
    _onLongPress(){
        if (!this.state.iconShow){
            this.setState({
                iconShow: true
            });
        }
    }
    _onPressOut(){
        /*
        * 在 move 的过程中会触发 onPressOut ,所以用 this.moving 来标注是否发生 move
        * 在没有发生 move 时释放点击，隐藏 icon
        * 在发生了 move 后，隐藏 icon 交由 onPanResponderRelease
        * */
        if (!this.moving && this.state.iconShow){
            this.setState({
                iconShow: false
            });
        }
    }
    /*
    * @params value: 数组中的一项; list: 数组
    * @return (number): value 在 list 中的索引
    * 如果数组中没有 value 返回 0
    * */
    _getIndexFromValue(value: string, list: string[]) {
        let i;
        for (i = 0; i < list.length; i++){
            if (value === list[i]) {
                break;
            }
        }
        if (i >= list.length) {i = 0;}
        return i;
    }
    /**
     * 修改索引的选中项
     * 修改样式，修改 this.selectedIndex, 修改 floatIcon 的 top 值和 text 值
     * */
    _changeSelectedIndex(index: number) {
        let oldSelectedIndex = this.selectedIndex;
        // @ts-ignore
        this['_view' + oldSelectedIndex].setNativeProps({
            style: {
                backgroundColor: 'transparent'
            }
        });
        // @ts-ignore
        this['_text' + oldSelectedIndex].setNativeProps({
            style: {
                color: 'rgba(42,48,61,0.7)'
            }
        });
        // @ts-ignore
        this['_view' + index].setNativeProps({
            style: {
                backgroundColor: primary
            }
        });
        // @ts-ignore
        this['_text' + index].setNativeProps({
            style: {
                color: g5
            }
        });
        if (this.state.iconShow){
            this._floatIcon.current && this._floatIcon.current.setNativeProps({
                style: {
                    top: -16 + 18 * index
                }
            });
            this._floatText.current && this._floatText.current.setNativeProps({
                text: this.props.list[index]
            });
        }
        this.selectedIndex = index;
    }
}

const primary = '#EA0029';
const g5 = '#f5f5f5';

const styles = StyleSheet.create({
    alphlistContainer: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        // backgroundColor: Color.White1,    // bug: 当设置背景色后，安卓下 floatIcon 会不显示
        paddingLeft: 2,
        paddingRight: 2,
    },
    textContainer: {
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'rgba(42,48,61,0.7)',
        fontSize: 12,
    },
    floatIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -16,
        left: -80,
    },
    triangle: {
        width: 28,
        height: 28,
        backgroundColor: '#D8D8D8',
        transform: [
            {rotate: '45deg'}  // 旋转45度
        ],
        position: 'relative',
        left: 52
    },
    circle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D8D8D8',
        paddingLeft: Platform.OS === 'ios' ? 8 : 0,
    },
    circleText: {
        width: 32,
        height: 48,
        fontSize: 32,
        color: g5,
        padding: 0,
        textAlign: 'center',
    }
});
