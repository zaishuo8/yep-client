import React, {RefObject} from 'react';
import {
  FlatList,
  Route,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  defaultPosition,
  getCurrentPosition,
  MapTypes,
  MapView,
  onMapStatusChange,
  Position,
} from '../../components/BaiduMap';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../const/screen';
import {Color} from '../../config/color_yep';
import CustomHeader from '../../components/CustomHeader';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Coordtype,
  getAddressWithPoi,
  mapAddressWithPoiResultToPosition,
} from '../../api/request/baidu_map';
import Icon from '../../components/Icon';
import Search from '../../components/Search';

interface Props {
  /**
   * position?: Position
   * onGoBack?: (position: Position) => void
   * */
  navigation: StackNavigationProp<any>;
  route: Route;
}

interface State {
  position?: Position;
}

class Index extends React.PureComponent<Props, State> {
  poiListRef: RefObject<PoiList> = React.createRef();
  afterPoiListPress: boolean = false; // 是否在点击 POI 之后
  firstRender: boolean = true;

  constructor(props: Props) {
    super(props);
    this.state = {
      position: props.route.params.position,
    };
  }

  setPoiPositionList = (position: Position) => {
    if (this.poiListRef.current) {
      // 重设列表
      this.poiListRef.current.setPoiPositionList(position);
      setTimeout(() => {
        // 把列表置顶
        this.poiListRef.current.scrollToTop();
      }, 100);
    }
  };

  async componentDidMount() {
    setTimeout(() => {
      this.firstRender = false;
    }, 2000);
    const position =
      this.props.route.params.position || (await getCurrentPosition());
    if (position) {
      this.setPoiPositionList(position);
    } else {
      this.setPoiPositionList(defaultPosition);
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <CustomHeader
          title={'选择位置'}
          rightTitle={'确定'}
          rightTitleStyle={{color: Color.statusBlue}}
          onLeftPress={this.props.navigation.pop}
          headerStyle={{borderWidth: 0}}
          onRightPress={() => {
            const {onGoBack} = this.props.route.params;
            this.props.navigation.pop();
            onGoBack && onGoBack(this.state.position);
          }}
        />
        <View style={{flex: 1}}>
          <View>
            <MapView
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT * 0.4}
              zoom={18}
              zoomControlsVisible={true}
              mapType={MapTypes.NORMAL}
              showsUserLocation={true}
              center={{
                longitude:
                  (this.state.position && this.state.position.longitude) ||
                  defaultPosition.longitude,
                latitude:
                  (this.state.position && this.state.position.latitude) ||
                  defaultPosition.latitude,
              }}
              onMapStatusChange={params => {
                // 进页面的首次渲染不需要触发这个
                if (!this.firstRender) {
                  if (!this.afterPoiListPress) {
                    onMapStatusChange(params, (newPosition: Position) => {
                      // @ts-ignore 这里直接赋值，setState 会无限循环
                      this.state.position = newPosition;
                      this.setPoiPositionList(newPosition);
                    });
                  }
                  this.afterPoiListPress = false;
                }
              }}
            />
            <Search
              style={{
                position: 'absolute',
                width: SCREEN_WIDTH - 30,
                marginLeft: 15,
                marginTop: 10,
                backgroundColor: Color.bgPrimary,
                height: 30,
              }}
              onFocus={() => {
                const {onGoBack} = this.props.route.params;
                this.props.navigation.navigate('PositionSearch', {
                  onPositionSelectPage: 'UploadPosting',
                  onPositionSelect: onGoBack,
                });
              }}
              textStyle={{fontSize: 15}}
              placeholder={'搜索位置'}
              placeholderTextColor={Color.fontGray}
            />
            <Icon
              name={'location-fill-blue'}
              size={40}
              style={{
                position: 'absolute',
                top: (SCREEN_HEIGHT * 0.4 - 40) / 4,
                left: (SCREEN_WIDTH - 40) / 4,
              }}
            />
          </View>
          <PoiList
            ref={this.poiListRef}
            setFatherPosition={(position: Position) => {
              this.afterPoiListPress = true;
              this.setState({position});
            }}
          />
        </View>
      </View>
    );
  }
}

export default Index;

interface PoiListProps {
  setFatherPosition: (position: Position) => void;
}

interface PoiListState {
  positionList: Position[];
  position?: Position;
}

class PoiList extends React.PureComponent<PoiListProps, PoiListState> {
  state: PoiListState = {
    positionList: [],
    position: undefined,
  };
  flatListRef: RefObject<FlatList<any>> = React.createRef();

  setPoiPositionList = async (position: Position) => {
    const result = await getAddressWithPoi(
      position.latitude,
      position.longitude,
      {coordtype: Coordtype.BaiDu},
    );
    if (result) {
      const list: Position[] = result.pois.map(poi => {
        return {
          name: poi.name,
          address: poi.addr,
          latitude: poi.point.y,
          longitude: poi.point.x,
        };
      });
      if (position.name) {
        list.unshift(position);
      } else {
        console.log('jinlaile');
        list.unshift(mapAddressWithPoiResultToPosition(result));
      }
      if (list && list.length > 0) {
        this.setState({
          positionList: list,
          position: list[0],
        });
        this.props.setFatherPosition(list[0]);
      }
    }
  };

  scrollToTop = () => {
    if (this.state.positionList.length > 0) {
      this.flatListRef.current &&
        this.flatListRef.current.scrollToIndex({index: 0, animated: false});
    }
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: Color.bgPrimary,
          paddingLeft: 15,
          flex: 1,
          paddingTop: 10,
        }}>
        <SafeAreaView>
          <FlatList
            ref={this.flatListRef}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.positionList}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({position: item});
                    this.props.setFatherPosition &&
                      this.props.setFatherPosition(item);
                  }}
                  style={{
                    height: 56,
                    borderBottomColor: Color.splitLine1,
                    borderBottomWidth:
                      index === this.state.positionList.length - 1
                        ? 0
                        : StyleSheet.hairlineWidth,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: 15,
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
                  {item.latitude === this.state.position.latitude &&
                  item.longitude === this.state.position.longitude &&
                  item.address === this.state.position.address ? (
                    <Icon name={'hook-blue'} size={20} />
                  ) : (
                    <View style={{width: 20}} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      </View>
    );
  }
}
