import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, Route, StyleSheet, View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import {
  MapView,
  MapTypes,
  Position,
  defaultPosition,
  onMapStatusChange,
} from '../../components/BaiduMap';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../const/screen';
import {Color} from '../../config/color_yep';
import CustomHeader from '../../components/CustomHeader';
import {StackNavigationProp} from '@react-navigation/stack';
import {getNearbyPoi} from '../../api/request/baidu_map';
import Icon from '../../components/Icon';

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
  positionList: Position[];
}

class Index extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      position: props.route.params.position,
      positionList: [],
    };
  }

  setPoiPositionList = async (position: Position) => {
    const result = await getNearbyPoi(
      position.latitude,
      position.longitude,
      20,
      1,
    );
    const list: Position[] = result || [];
    // 把传进来的地址放到list的第一个且被选中
    list.unshift(position);
    this.setState({
      positionList: list,
      position: list[0],
    });
  };

  componentDidMount() {
    const position = this.props.route.params.position;
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
              onMapPoiClick={poi => {
                this.setPoiPositionList(poi);
              }}
              // onMapStatusChange={params => {
              //   onMapStatusChange(params, (newPosition: Position) => {
              //     this.setState({
              //       position: newPosition,
              //     });
              //   });
              // }}
            />
            <Icon
              name={'location-fill-blue'}
              size={40}
              style={{
                position: 'absolute',
                // top: 0,
                // left: 0,
                top: (SCREEN_HEIGHT * 0.4 - 40) / 4,
                left: (SCREEN_WIDTH - 40) / 4,
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: Color.bgPrimary,
              paddingLeft: 15,
              flex: 1,
              paddingTop: 10,
            }}>
            <SafeAreaView>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={this.state.positionList}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({position: item});
                      }}
                      style={{
                        height: 50,
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
                      item.longitude === this.state.position.longitude ? (
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
        </View>
      </View>
    );
  }
}

export default Index;
