import React, {useEffect, useState} from 'react';
import {
  FlatList,
  TouchableWithoutFeedback,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Route,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import {StackNavigationProp} from '@react-navigation/stack';
import {Color} from '../../config/color_yep';
import Search from '../../components/Search';
import {Community, getCommunityList} from '../../api/request/community';

interface Props {
  /**
   * onCommunitySelect: (community: Community) => void;
   * */
  navigation: StackNavigationProp<any>;
  route: Route;
}

function array2(communityList: Community[]): Community[][] {
  const result: Community[][] = [];
  for (let i = 0; i < communityList.length; i++) {
    if (i % 2 === 0) {
      continue;
    } else {
      result.push([communityList[i - 1], communityList[i]]);
    }
  }
  // 如果是单数，补最后一个
  if (communityList.length % 2 !== 0) {
    result.push([communityList[communityList.length - 1]]);
  }

  return result;
}

export default function Index(props: Props) {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [communityList, setCommunityList] = useState<Community[]>([]);

  useEffect(() => {
    async function loadData() {
      setCommunityList(await getCommunityList());
    }

    loadData();
  }, []);

  return (
    <View style={{flex: 1}}>
      <CustomHeader title={'圈子'} onLeftPress={props.navigation.pop} />
      <View
        style={{
          flex: 1,
          backgroundColor: Color.bgPrimary,
        }}>
        <Search
          style={{marginHorizontal: 15, marginVertical: 10}}
          placeholder={'搜索圈子'}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <View style={{backgroundColor: Color.bgGray}}>
            <FlatList
              data={[
                {groupId: 1, groupName: '兴趣部落'},
                {groupId: 2, groupName: '全国城市'},
                {groupId: 3, groupName: '全国城市'},
              ]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                const {groupName} = item;
                return (
                  <TouchableWithoutFeedback
                    onPress={() => setSelectedGroupIndex(index)}>
                    <View
                      style={{
                        padding: 15,
                        backgroundColor:
                          selectedGroupIndex === index
                            ? Color.bgPrimary
                            : Color.bgGray,
                      }}>
                      <Text
                        style={{
                          height: 20,
                          lineHeight: 20,
                          fontSize: 14,
                          color:
                            selectedGroupIndex === index
                              ? Color.statusBlue
                              : Color.fontGray,
                        }}>
                        {groupName}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={array2(communityList)}
              renderItem={({item}) => {
                const [community1, community2] = item;
                return (
                  <View
                    style={{
                      marginBottom: 10,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                    }}>
                    <CommunityCard
                      community={community1}
                      onPress={() => {
                        props.navigation.pop();
                        const {onCommunitySelect} = props.route.params;
                        onCommunitySelect && onCommunitySelect(community1);
                      }}
                    />
                    <View style={{width: 10}} />
                    {community2 ? (
                      <CommunityCard
                        community={community2}
                        onPress={() => {
                          props.navigation.pop();
                          const {onCommunitySelect} = props.route.params;
                          onCommunitySelect && onCommunitySelect(community2);
                        }}
                      />
                    ) : (
                      <View style={{flex: 1}} />
                    )}
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const defaultCommunityImg = require('../../asset/images/community_default.png');

function CommunityCard(props: {community: Community; onPress?: () => void}) {
  const {name, img} = props.community;
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        height: 60,
      }}
      onPress={() => {
        props.onPress && props.onPress();
      }}>
      <ImageBackground
        style={{
          flex: 1,
          height: 60,
          borderRadius: 8,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={img ? {uri: img} : defaultCommunityImg}
        resizeMode={'cover'}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        />
        <Text
          style={{
            height: 20,
            lineHeight: 20,
            fontSize: 14,
            color: Color.bgPrimary,
          }}>
          {name}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}
