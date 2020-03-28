import React, {Component, RefObject} from 'react';
import {View, Text, StyleSheet, Image, Platform, ScrollView, TouchableHighlight} from 'react-native';
import { Item } from './types';

const itemHeight = 27, containerPadding = 13, showItemsNum = 7;

/**
 * props: items、selectedIndex、disabledIndexArr
 * callback: onValueChange(selectedValue, selectedIndex)
 * */
/*PickerBody.propTypes = {
    items: PropTypes.array.isRequired,
    selectedIndex: PropTypes.number,
    onValueChange: PropTypes.func,
    disabledIndexArr: PropTypes.array
};*/

export interface Props {
    items: Item[],
    selectedIndex?: number,
    onValueChange?: (value: string, index: number) => void,
    disabledIndexArr?: number[]
}

export default class PickerBody extends Component<Props>{
    private items: Item[];
    private selectedIndex: number;
    private itemHeight: number;
    private containerPadding: number;
    private showItemsNum: number;
    private containerHeight: number;
    private drag: boolean;
    private _scrollView: RefObject<ScrollView>;
    private _selectedScrollView: RefObject<ScrollView>;
    private timeoutId: number = 0;
    private onValueTimeoutId: number = 0;

    constructor(props: Props){
        super(props);

        this.items = this.props.items || [];    // 选项 [{label: '', value: ''}, {label: '', value: ''} ...];
        if (this.props.selectedIndex || this.props.selectedIndex === 0){
            // @ts-ignore
            if (parseInt(this.props.selectedIndex, 10) !== this.props.selectedIndex){
                // console.warn('selectedIndex 为整数');
                // @ts-ignore
                this.props.selectedIndex = 0;
            }
        }
        this.selectedIndex = (this.props.selectedIndex && this.props.selectedIndex < this.items.length) ? this.props.selectedIndex : 0;

        this.itemHeight = itemHeight;
        this.containerPadding = containerPadding;
        this.showItemsNum = showItemsNum;
        this.containerHeight = this.showItemsNum * this.itemHeight + this.containerPadding * 2;

        this.drag = false;  // 标记手指是否在滚动
        this._scrollView = React.createRef();
        this._selectedScrollView = React.createRef();
    }

    componentWillReceiveProps(nextProps: Props){
        this.items = nextProps.items || [];
        this.selectedIndex = (nextProps.selectedIndex && nextProps.selectedIndex < this.items.length) ? nextProps.selectedIndex : 0;
    }

    /**
     * 实现 shouldComponentUpdate
     * 只要 items 没改变，就返回 false
     * */
    shouldComponentUpdate(nextProps: Props){
        const thisItems = this.props.items,
            nextItems = nextProps.items;
        if (thisItems.length !== nextItems.length) {
            return true;
        }
        for (let i = 0; i < this.items.length; i++){
            const thisOneItem = this.items[i],
                nextOneItem = nextItems[i];
            if (thisOneItem.value !== nextOneItem.value || thisOneItem.label !== nextOneItem.label){
                return true;
            }
        }
        this._scrollView && this._scrollView.current && this._scrollView.current.scrollTo({x: 0, y: this._findNearEnableIndex(this.selectedIndex) * this.itemHeight, animated: false});
        return false;
    }

    /**
     * 渲染 Picker 中的选项
     * @param items: 字符串数组
     * @return itemView: <Text/> 数组
     * */
    _renderItems(items: Item[]){
        let itemView = [];
        const itemStyle = {
            height: this.itemHeight,
            lineHeight: this.itemHeight,
            textAlign: 'center' as 'center', // tslint: cast string to type 'absolute'
        };
        items.forEach((item, index) => {
            itemView.push(
                <Text key={`${index}_${item.value}`} style={[itemStyle, { color: '#666666', fontSize: 18 }]}>
                    {item.label}
                </Text>
            );
        });
        // 在 items 的顶部和底部增加空白 item , 使第一个和最后一个 item 能在 Picker 的中间位置被选中
        for (let i = 0; i < Math.floor(this.showItemsNum / 2); i++){
            itemView.unshift(<Text key={-(i + 1)} style={itemStyle}/>);
            itemView.push(<Text key={this.items.length + i + 1} style={itemStyle}/>);
        }

        return itemView;
    }

    /**
     * 渲染 Picker 中间的选中项
     * */
    _renderSelectedItem(items: Item[]){
        let itemView: Element[] = [];
        const itemStyle = {
            height: this.itemHeight,
            lineHeight: this.itemHeight,
            textAlign: 'center' as 'center', // tslint: cast string to type 'absolute'
        };
        items.forEach((item, index) => {
            itemView.push(
                <Text key={`${index}_${item.value}`} style={[itemStyle, {
                    color: '#1a1a1a',
                    fontSize: 20
                }]}>
                    {item.label}
                </Text>
            );
        });

        return itemView;
    }

    /**
     * 渲染透明度渐变的蒙层
     * */
    _renderCover(){
        const coverContainerStyle = {
            position: 'absolute' as 'absolute',
            top: 0, left: 0, right: 0,
            height: this.itemHeight * this.showItemsNum + 2 * containerPadding
        };
        const coverImgUpStyle = {
            position: 'absolute' as 'absolute',
            top: 0, left: 0, right: 0,
            height: this.itemHeight * Math.floor(this.showItemsNum / 2) + containerPadding,
        };
        const coverImgDownStyle = {
            position: 'absolute' as 'absolute',
            bottom: 0, left: 0, right: 0,
            height: this.itemHeight * Math.floor(this.showItemsNum / 2) + containerPadding,
            transform: [{rotate: '180deg'}],
        };
        return (
            <View style={coverContainerStyle} pointerEvents={'none'}>
                <Image
                    style={coverImgUpStyle}
                    resizeMode={'stretch'}
                    source={{uri: 'https://assets.souche.com/assets/sccimg/common/datePicker/cover.png'}}
                />
                <Image
                    style={coverImgDownStyle}
                    resizeMode={'stretch'}
                    source={{uri: 'https://assets.souche.com/assets/sccimg/common/datePicker/cover.png'}}
                />
            </View>
        );
    }

    render(){
        if (this.items.length === 0){
            console.warn('items 长度不能为空');
        }
        const containerStyle = {
            height: this.containerHeight,
            paddingTop: this.containerPadding,
            paddingBottom: this.containerPadding,
            backgroundColor: '#FFFFFF',
            alignSelf: 'stretch' as 'stretch',  // 横向撑满父容器
        };
        const items = this._renderItems(this.items);
        const cover = this._renderCover();
        const offSet = Platform.OS === 'ios' ? 1 : 0;
        const selectedItem = this._renderSelectedItem(this.items);
        const selectedValueContainerStyle = {
            position: 'absolute' as 'absolute',
            left: 0, right: 0,
            top: 3 * this.itemHeight + containerPadding,
            height: this.itemHeight,
            backgroundColor: '#FFFFFF'
        };
        return (
            <View style={containerStyle}>
                <ScrollView
                    ref={this._scrollView}
                    showsVerticalScrollIndicator={false}
                    overScrollMode={'never'}
                    scrollEventThrottle={10}
                    onScroll={this._onScroll}
                    onMomentumScrollEnd={this._onMomentumScrollEnd}
                    onScrollEndDrag={this._onScrollEndDrag}
                    onMomentumScrollBegin={this._onMomentumScrollBegin}
                    onScrollBeginDrag={this._onScrollBeginDrag}
                >
                    <TouchableHighlight>
                        <View>
                            {items}
                        </View>
                    </TouchableHighlight>
                </ScrollView>
                <View pointerEvents={'none'} style={selectedValueContainerStyle}>
                    <ScrollView
                        ref={this._selectedScrollView}
                        showsVerticalScrollIndicator={false}
                        overScrollMode={'never'}
                        scrollEnabled={false}
                    >
                        {selectedItem}
                    </ScrollView>
                </View>
                {cover}
                <View style={[styles.indicator, {top: -Math.ceil(this.showItemsNum / 2) * this.itemHeight + offSet}]}/>
                <View style={[styles.indicator, {top: -Math.floor(this.showItemsNum / 2) * this.itemHeight + offSet}]}/>
            </View>
        );
    }

    componentDidMount(){
        setTimeout(()=>{this._scrollView && this._scrollView.current && this._scrollView.current.scrollTo({x: 0, y: this._findNearEnableIndex(this.selectedIndex) * this.itemHeight, animated: false});}, 0);
    }
    componentDidUpdate(){
        setTimeout(()=>{this._scrollView && this._scrollView.current && this._scrollView.current.scrollTo({x: 0, y: this._findNearEnableIndex(this.selectedIndex) * this.itemHeight, animated: false});}, 0);
    }

    _onScroll = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
        this._selectedScrollView && this._selectedScrollView.current && this._selectedScrollView.current.scrollTo({x: 0, y: e.nativeEvent.contentOffset.y, animated: false});
    };

    _onScrollBeginDrag = () => {
        this.drag = true;
    };

    _onScrollEndDrag = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
        this.drag = false;
        clearTimeout(this.timeoutId);
        let dy = e.nativeEvent.contentOffset.y;
        // 如果 onScrollEndDrag 后，ScrollView 在自动滚动状态，则不调整位置; 自然滚动停止后调整位置
        // 默认 onScrollEndDrag 先与 onMomentumScrollBegin 执行; 把 onScrollRelease 放到下一个 tick 执行，而在这个 tick(onMomentumScrollBegin) 中清除定时器
        this.timeoutId = setTimeout(()=>{
            this._adjustScrollDy(dy);
        }, 0);
    };

    _onMomentumScrollBegin = () => {
        clearTimeout(this.timeoutId);
    };

    /**
     * android 手指打断 MomentumScroll 也会触发 onMomentumScrollEnd
     * 这里用 this.drag 判断是否手指打断
     * adjustScrollDy 后的 onMomentumScrollEnd 触发 ios onValueChange 回调
     * android 上 scrollTo 的滚动结束后不会触发 onMomentumScroll*
     * */
    _onMomentumScrollEnd = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
        if (!this.drag){
            const dy = e.nativeEvent.contentOffset.y;
            // @ts-ignore
            if (Platform.OS === 'ios' && parseInt(dy / this.itemHeight, 10) === dy / this.itemHeight){
                // 调整完毕，触发 onValueChange 回调
                const timesDy = getNearTimesNum(dy, this.itemHeight),
                    selectedIndex = timesDy / this.itemHeight,
                    enableSelectedIndex = this._findNearEnableIndex(selectedIndex);
                this.items.length > 0 && this.props.onValueChange && this.props.onValueChange(this.items[enableSelectedIndex].value, enableSelectedIndex);
                return;
            }
            this._adjustScrollDy(e.nativeEvent.contentOffset.y);
        }
    };

    /**
     * 调整 ScrollView 位置
     * @param dy: 调整前的位置
     * 在 android 上 scrollTo 的滚动结束后不会触发 onMomentumScroll*
     * 所以在这里触发 onValueChange 回调
     * */
    _adjustScrollDy(dy: number){
        clearTimeout(this.onValueTimeoutId);
        const timesDy = getNearTimesNum(dy, this.itemHeight),
            selectedIndex = timesDy / this.itemHeight,
            enableSelectedIndex = this._findNearEnableIndex(selectedIndex);
        this._scrollView && this._scrollView.current && this._scrollView.current.scrollTo({x: 0, y: enableSelectedIndex * this.itemHeight, animated: true});
        if (Platform.OS === 'android'){
            this.onValueTimeoutId = setTimeout(() => {
                // onValueChange 中一般会 setState 改变 Picker 的 props 发生渲染，延迟操作为了防止重新渲染卡 UI
                this.items.length > 0 && this.props.onValueChange && this.props.onValueChange(this.items[enableSelectedIndex].value, enableSelectedIndex);
            }, 300);
        }
    }

    /**
     * 找到距离 index 最近的允许被选中的 item
     * @param index - number: 起点索引
     * @return enableIndex - number: 距离 index 最近被允许的索引
     * */
    _findNearEnableIndex(index: number): number{
        const disabledIndexArr = this.props.disabledIndexArr || [];
        let i, enableIndex = 0;
        const items = this.items, length = items.length;
        for (i = 0; i < length; i++){
            enableIndex = index + i;
            if (enableIndex >= length) {
                enableIndex = enableIndex - length;
            }
            if (notInArray(enableIndex, disabledIndexArr)) {
                break;
            }
        }
        // 如果没有一个能选中，就默认选中第一个
        if (i >= length){
            enableIndex = 0;
        }
        return enableIndex;
    }
}

/**
 * 计算最接近 num 的 unit 的倍数
 * */
function getNearTimesNum(num: number, unit: number) {
    let result,
        times = num / unit;
    if (num > 0){
        result = (num - Math.floor(times) * unit) < (unit / 2) ? Math.floor(times) * unit : Math.ceil(times) * unit;
    } else {
        result = (Math.ceil(times) * unit - num) < (unit / 2) ? Math.ceil(times) * unit : Math.floor(times) * unit;
    }
    return result;
}

/**
 * 判断 ele 在不在 arr 中
 * */
function notInArray(ele: number, arr: number[]){
    return (
        arr.every((item) => {
            if (item !== ele) {
                return true;
            }
        })
    );
}

const styles = StyleSheet.create({
    indicator: {
        alignSelf: 'stretch',
        borderColor: '#999999',
        borderTopWidth: StyleSheet.hairlineWidth,
        height: 0,
        position: 'relative',
        left: 0,
    },
});
