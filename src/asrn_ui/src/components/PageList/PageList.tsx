import React, {ReactElement, RefObject} from 'react';
import {FlatList, View, Dimensions, TouchableWithoutFeedback, Image, StyleSheet, Platform} from 'react-native';

const nextButtonASource = require('../../../asset/images/next_l.png');
const nextButtonBSource = require('../../../asset/images/next_s.png');

const SCREEN = Dimensions.get('window');
const SCREEN_HEIGHT = SCREEN.height;

/**
 * 滚动逻辑
 * 0. 记录当前页码，和每页距离顶部的高度
 * 1. 手指松开：判断是否超过当前页的范围，超过的话判断滚动方向进行翻页
 * 2. 监听自然滚动：滚过当前页范围回弹
 * */

/**
 * props:
 * data: Array                          必填
 * renderItem: ({ item, index }) => {}  必填
 * keyExtractor: (item, index) => {}    必填
 * onPageChange: (pageIndex) => {}      非必填
 *
 * 其他 flatList 的 props 直接透传
 * 外层的 ref 透传到 flatList 的 ref
 * */

interface Event {
    nativeEvent: { contentOffset: { x: number, y: number } }
}

export interface Props {
    data: Array<any>,
    renderItem: (params: { item: any, index: number }) => ReactElement,
    keyExtractor: (item: any, index: number) => string,
    scrollEnabled?: boolean,
    onPageChange?: (pageIndex: number) => void,
    onScroll?: (event: Event) => void,
    scrollEventThrottle?: number,
    onScrollEndDrag?: (event: Event) => void,
    onMomentumScrollBegin?: (event: Event) => void,
    onMomentumScrollEnd?: (event: Event) => void,
    reset?: () => void,
    onEndReached: () => void,
    refreshing: boolean,
    onRefresh: () => void,
}

interface State {}

interface ItemHeightList {
    length: number,
    [key: number]: number
}

class PageList extends React.PureComponent<Props, State> {
    private itemHeightList: ItemHeightList = { length: 0 };      // 通过数组对象来记录 FlatList 中每个 item 的高度;
    private itemToTopArray: Array<number> = [];          // 记录每个 item 距离列表顶部的距离;
    private targetPage: number = 0;                      // 目标页码;
    private curPage: number = 0;                         // 当前页码;
    private scrollY: number = 0;                         // 滚动距离;
    private scrollDirection: number = 0;                 // 滚动方向：0：往下；1：往上;
    private scrollAfterMomentumBegin: boolean  = false;  // 标记是否在自然滚动状态 (scrollToOffset 开始不会触发 onMomentumScrollBegin，但是结束后会触发 onMomentumScrollEnd);
    private flatList: RefObject<FlatList<any>> = React.createRef();    // FlatList ref
    private nextButton: RefObject<View> = React.createRef();
    private nextButtonImgA: RefObject<Image> = React.createRef();
    private nextButtonImgB: RefObject<Image> = React.createRef();
    private nextButtonType: 'A' | 'B' = 'A';   // 按钮的类型 A 大的   B 小的

    private setButtonType(type: 'A' | 'B') {
        // 通过移动不同图片的位置来控制
        if (type === this.nextButtonType) {
            return;
        }
        if (type === 'A') {
            this.nextButtonImgA && this.nextButtonImgA.current && this.nextButtonImgA.current.setNativeProps({ style: [ styles.AStyle ] });
            this.nextButtonImgB && this.nextButtonImgB.current && this.nextButtonImgB.current.setNativeProps({ style: [ styles.BStyle, styles.buttonImgHideStyle ] });
        } else {
            this.nextButtonImgA && this.nextButtonImgA.current && this.nextButtonImgA.current.setNativeProps({ style: [ styles.AStyle, styles.buttonImgHideStyle ] });
            this.nextButtonImgB && this.nextButtonImgB.current && this.nextButtonImgB.current.setNativeProps({ style: [ styles.BStyle ] });
        }

        this.nextButtonType = type;
    }

    private renderItem = (params: { item: any, index: number }): ReactElement => {
        return (
            <View
                style={{ minHeight: SCREEN_HEIGHT }}
                onLayout={({ nativeEvent }) => {
                    // 记录每个 item 的高度，每个 item 的 onLayout 触发是无序的
                    this.itemHeightList[params.index] = nativeEvent.layout.height;
                    this.itemHeightList.length = Object.keys(this.itemHeightList).length - 1;

                    // 将数组对象转化成数组后，通过判断数组中是否有 undefined 来确定所有 item 是否触发 onLayout
                    const tempListArr: Array<number | undefined> = Array.prototype.slice.call(this.itemHeightList);
                    if (!tempListArr.includes(undefined)) {
                        // 计算每个 item 距离列表顶部的距离
                        tempListArr.forEach((height: number | undefined, index: number) => {
                            if(index === 0) {
                                this.itemToTopArray[0] = 0;
                            } else {
                                this.itemToTopArray[index] = this.itemToTopArray[index - 1] + (tempListArr[index - 1] as number)
                            }
                        });
                    }
                    if(this.scrollY + SCREEN_HEIGHT > this.itemToTopArray[this.curPage] + this.itemHeightList[this.curPage]) {
                        // 点击展开后，如果在两个页面中间的调整
                        this.flatList && this.flatList.current && this.flatList.current.scrollToOffset({offset: this.itemToTopArray[this.curPage] + this.itemHeightList[this.curPage] - SCREEN_HEIGHT, animated: false});
                    }
                }}
            >
                {this.props.renderItem(params)}
            </View>
        );
    };

    private adjust = (scrollY: number) => {
        if((this.curPage < this.itemHeightList.length - 1) && (scrollY + SCREEN_HEIGHT > this.itemToTopArray[this.curPage + 1])) {
            this.viewAdjust(this.itemToTopArray[this.curPage + 1]);
            this.targetPage = this.curPage + 1;
        } else if((this.curPage > 0) && (scrollY < this.itemToTopArray[this.curPage])) {
            this.viewAdjust(this.itemToTopArray[this.curPage] - SCREEN_HEIGHT);
            this.targetPage = this.curPage - 1;
        }
    };

    private viewAdjust = (offset: number, animated:boolean = true) => {
        // @ts-ignore
        this.flatList && this.flatList.current && this.flatList.current.setNativeProps({ scrollEnabled: false });
        this.flatList && this.flatList.current && this.flatList.current.scrollToOffset({offset, animated});
    };

    private onScroll = (event: Event) => {
        const scrollY = event.nativeEvent.contentOffset.y;

        // 修改下一页按钮的类型
        this.setButtonType('B');

        // 滚动方向
        if(scrollY >= this.scrollY){
            this.scrollDirection = 0;
        } else {
            this.scrollDirection = 1;
        }
        this.scrollY = scrollY;

        // 自然滚动边界回弹 (超出边界 200 像素后，不回弹，直接跳转)
        if(this.scrollAfterMomentumBegin && this.itemHeightList[this.curPage] > SCREEN_HEIGHT) {
            if(this.scrollDirection === 0 && this.curPage < this.itemHeightList.length - 1 && scrollY + SCREEN_HEIGHT > this.itemToTopArray[this.curPage + 1]) {
                if(scrollY + SCREEN_HEIGHT < this.itemToTopArray[this.curPage + 1] + 300) {
                    this.viewAdjust(this.itemToTopArray[this.curPage + 1] - SCREEN_HEIGHT);
                    this.targetPage = this.curPage;
                } else {
                    // 超越边界 300 像素后，不回弹，直接跳下一页
                    this.adjust(scrollY);
                }
            } else if(this.scrollDirection === 1 && this.curPage > 0 && scrollY < this.itemToTopArray[this.curPage]) {
                if(scrollY > this.itemToTopArray[this.curPage] - 300) {
                    this.viewAdjust(this.itemToTopArray[this.curPage]);
                    this.targetPage = this.curPage;
                } else {
                    // 超越边界 300 像素后，不回弹，直接跳上一页
                    this.adjust(scrollY);
                }
            }
        }

        this.props.onScroll && this.props.onScroll(event);
    };

    private onScrollEndDrag = (event: Event) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        this.adjust(scrollY);

        this.props.onScrollEndDrag && this.props.onScrollEndDrag(event);
    };

    private onMomentumScrollBegin = (event: Event) => {
        this.scrollAfterMomentumBegin = true;
        this.props.onMomentumScrollBegin && this.props.onMomentumScrollBegin(event);
    };

    private onMomentumScrollEnd = (event: Event) => {
        this.scrollAfterMomentumBegin = false;
        // @ts-ignore
        this.flatList && this.flatList.current && this.flatList.current.setNativeProps({ scrollEnabled: true });
        this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(event);
        if (this.curPage !== this.targetPage) {
            this.props.onPageChange && this.props.onPageChange(this.targetPage);
        }
        if (this.curPage !== this.targetPage) {
            this.setButtonType('A');
        }
        this.curPage = this.targetPage;
        if (this.curPage >= this.props.data.length - 1) {
            this.nextButton && this.nextButton.current && this.nextButton.current.setNativeProps({ style: styles.hideStyle });
        } else {
            this.nextButton && this.nextButton.current && this.nextButton.current.setNativeProps({ style: styles.commonStyle });
        }
    };

    render() {
        const { scrollEnabled, data, renderItem, keyExtractor, onScroll, scrollEventThrottle,
            onScrollEndDrag, onMomentumScrollBegin, onMomentumScrollEnd, onEndReached, ...restProps } = this.props;
        return (
            <View>
                <FlatList
                    scrollEnabled={true}
                    ref={this.flatList}
                    data={data}
                    // @ts-ignore
                    renderItem={this.renderItem}
                    keyExtractor={keyExtractor}
                    onScroll={this.onScroll}
                    scrollEventThrottle={scrollEventThrottle || 100}
                    onScrollEndDrag={this.onScrollEndDrag}
                    onMomentumScrollBegin={this.onMomentumScrollBegin}
                    onMomentumScrollEnd={this.onMomentumScrollEnd}
                    {...restProps}
                    showsVerticalScrollIndicator={false}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.01}
                />
                {
                    data.length > 1 &&
                    <TouchableWithoutFeedback onPress={this.nextOnPress}>
                        <View ref={this.nextButton} style={styles.commonStyle}>
                            <Image ref={this.nextButtonImgA} source={nextButtonASource} style={[styles.AStyle]} />
                            <Image ref={this.nextButtonImgB} source={nextButtonBSource} style={[styles.BStyle, styles.buttonImgHideStyle]} />
                        </View>
                    </TouchableWithoutFeedback>
                }
            </View>
        );
    }

    nextOnPress = () => {
        if (this.curPage < this.props.data.length - 1) {
            if (Platform.OS === 'ios') {
                this.viewAdjust(this.itemToTopArray[this.curPage + 1], true);
                this.targetPage = this.curPage + 1;
            } else {
                // android 直接通过点击触发的 scrollTo 结束后不会触发 onMomentumScrollEnd 所以这里自定义
                this.flatList && this.flatList.current && this.flatList.current.scrollToOffset({
                    offset: this.itemToTopArray[this.curPage + 1], animated: true
                });
                this.targetPage = this.curPage + 1;
                this.curPage = this.targetPage;
                this.props.onPageChange && this.props.onPageChange(this.curPage);
                this.setButtonType('A');
                if (this.curPage >= this.props.data.length - 1) {
                    this.nextButton && this.nextButton.current && this.nextButton.current.setNativeProps({ style: styles.hideStyle });
                } else {
                    this.nextButton && this.nextButton.current && this.nextButton.current.setNativeProps({ style: styles.commonStyle });
                }
            }
        }
    };

    reset() {
        this.flatList && this.flatList.current && this.flatList.current.scrollToOffset({offset: 0, animated: false});
        // 属性初始化
        this.curPage = 0;
        this.targetPage = 0;
        this.scrollY = 0;
        this.scrollDirection = 0;
        this.scrollAfterMomentumBegin = false;
    }
}

const styles = StyleSheet.create({
    commonStyle: { position: 'absolute', right: 20, bottom: 30 },
    hideStyle: { position: 'absolute', right: -40, bottom: -60 },
    AStyle: { width: 120, height: 40 },
    BStyle: { width: 40, height: 40 },
    buttonImgHideStyle: { width: 0, height: 0 }
});

export default PageList;
