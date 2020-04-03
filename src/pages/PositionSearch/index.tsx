import React, {RefObject} from 'react';
import {
  FlatList,
  Route, SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import {StackNavigationProp} from '@react-navigation/stack';
import {Position} from '../../components/BaiduMap';
import {SCREEN_WIDTH} from '../../const/screen';
import {Color} from '../../config/color_yep';
import Search from '../../components/Search';
import {getSearchPois} from '../../api/request/baidu_map';

interface Props {
  /**
   * onPositionSelectPage?: string; 需要返回到的页面
   * onPositionSelect?: (position: Position) => void;
   * */
  navigation: StackNavigationProp<any>;
  route: Route;
}

interface State {
  searchText: string;

  poiList: Position[];
  pageNo: number;
  pageSize: number;
  hasNext: boolean;
}

class Index extends React.PureComponent<Props, State> {
  loadingData: boolean = false; // 是否在加载数据
  flatListRef: RefObject<FlatList<any>> = React.createRef();
  searchTimeoutId: number = 0;

  state: State = {
    searchText: '',

    poiList: [],
    pageNo: 1,
    pageSize: 20,
    hasNext: true,
  };

  changeSearchText = text => {
    if (text !== this.state.searchText) {
      this.setState(
        {
          searchText: text,
        },
        () => {
          clearTimeout(this.searchTimeoutId);
          this.searchTimeoutId = setTimeout(this.refresh, 500);
        },
      );
    }
  };

  renderPoiItem = (params: {item: Position; index: number}) => {
    const {item, index} = params;
    return (
      <TouchableOpacity
        onPress={() => {
          const {
            onPositionSelectPage,
            onPositionSelect,
          } = this.props.route.params;
          this.props.navigation.navigate(onPositionSelectPage);
          onPositionSelect && onPositionSelect(item);
        }}
        style={{
          height: 56,
          borderBottomColor: Color.splitLine1,
          borderBottomWidth:
            index === this.state.poiList.length - 1
              ? 0
              : StyleSheet.hairlineWidth,
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 15,
          marginLeft: 15,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-around',
            paddingVertical: 4,
            marginRight: 20,
            alignSelf: 'stretch',
          }}>
          {item.name && (
            <Text
              style={{
                color: Color.primary,
                fontSize: 16,
              }}
              numberOfLines={1}>
              {item.name}
            </Text>
          )}
          {item.address && (
            <Text
              style={{
                color: Color.fontGray,
                fontSize: 12,
              }}
              numberOfLines={1}>
              {item.address}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {searchText} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: Color.bgPrimary}}>
        <CustomHeader
          title={
            <Search
              style={{
                width: SCREEN_WIDTH - 120,
                backgroundColor: Color.bgGray,
                height: 30,
              }}
              textStyle={{fontSize: 15, color: Color.primary}}
              placeholder={'搜索位置'}
              placeholderTextColor={Color.fontGray}
              value={searchText}
              onChangeText={this.changeSearchText}
            />
          }
          onLeftPress={this.props.navigation.pop}
          rightTitle={searchText ? '取消' : ''}
          onRightPress={() => this.changeSearchText('')}
        />
        <View style={{flex: 1}}>
          <SafeAreaView>
            <FlatList
              ref={this.flatListRef}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.poiList}
              renderItem={this.renderPoiItem}
              onEndReached={this.onEndReached}
              ListFooterComponent={
                this.state.poiList.length > 0 &&
                this.loadingData && (
                  <View
                    style={{
                      height: 56,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 16, color: Color.fontGray}}>
                      加载中...
                    </Text>
                  </View>
                )
              }
            />
          </SafeAreaView>
        </View>
      </View>
    );
  }

  refresh = async () => {
    if (!this.state.searchText) return;
    if (this.state.poiList.length > 0) {
      this.flatListRef.current &&
        this.flatListRef.current.scrollToIndex({index: 0, animated: false});
    }
    try {
      const result = await this.loadOnePage(1);
      if (result && result.length > 0) {
        this.setState({
          poiList: result,
          pageNo: 1,
          hasNext: !(result.length < this.state.pageSize),
        });
      } else {
        this.setState({
          hasNext: false,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 加载某一页
  loadOnePage = async (pageNo: number) => {
    this.loadingData = true;
    const result = await getSearchPois({
      searchText: this.state.searchText,
      pageNo,
      pageSize: this.state.pageSize,
    });
    this.loadingData = false;
    return result;
  };

  // 加载下一页
  loadNextPage = async () => {
    if (this.state.hasNext) {
      const result = await this.loadOnePage(this.state.pageNo + 1);
      if (result && result.length > 0) {
        this.setState({
          poiList: this.state.poiList.concat(result),
          pageNo: this.state.pageNo + 1,
          hasNext: !(result.length < this.state.pageSize),
        });
      } else {
        this.setState({
          hasNext: false,
        });
      }
    }
  };

  onEndReached = async () => {
    if (this.state.hasNext && !this.loadingData) {
      await this.loadNextPage();
    }
  };
}

export default Index;
