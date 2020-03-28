import 'react-native-gesture-handler';

import React, {useState} from 'react';
import {Route, ScrollView, StyleSheet, View} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import TextInput from '../../components/TextInput';

import {Color} from '../../config/color_yep';
import {StackNavigationProp} from '@react-navigation/stack';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import {Media, MediaType} from '../../components/MdeiaList';
import {isVideo} from '../../utils/mediaUtil';
import MediaList from '../../components/MdeiaList';
import {SCREEN_WIDTH} from '../../const/screen';
import {List} from '../../asrn_ui';
import Icon from '../../components/Icon';
import {Community} from "../../api/request/community";

interface Props {
  navigation: StackNavigationProp<any>;
  route: Route;
}

function trasformMediaType(imageList: Image[]) {
  const result: Media[] = [];
  for (const image of imageList) {
    // @ts-ignore
    const {path, sourceURL} = image;
    result.push({
      type: isVideo(path) ? MediaType.Video : MediaType.Image,
      url: isVideo(path) ? sourceURL : path,
    });
  }
  return result;
}

function Index(props: Props) {
  // const {imageList} = props.route.params;

  const [text, setText] = useState('');
  const [mediaList, setMediaList] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | undefined>(undefined);

  return (
    <View style={{flex: 1}}>
      <CustomHeader
        title={'发布动态'}
        leftTitle={'取消'}
        rightTitle={'发布'}
        rightTitleStyle={{color: Color.statusBlue}}
        onLeftPress={props.navigation.pop}
        headerStyle={{borderWidth: 0}}
      />
      <View style={{flex: 1, backgroundColor: Color.bgPrimary}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            multiline={true}
            placeholder={'书写此刻的心情'}
            value={text}
            onChangeText={txt => setText(txt)}
          />
          <MediaList
            mediaList={mediaList}
            containerWidth={SCREEN_WIDTH}
            showAdd={mediaList.length < 9}
            onAddPress={async () => {
              try {
                // @ts-ignore
                const images: Image[] = await ImagePicker.openPicker({
                  multiple: true,
                  compressVideoPreset: 'HighQuality',
                  loadingLabelText: '读取中',
                  showsSelectedCount: false,
                  compressImageQuality: 1,
                  maxFiles: 9 - mediaList.length,
                });
                setMediaList(mediaList.concat(trasformMediaType(images)));
              } catch (e) {
                console.error(e);
              }
            }}
          />
          <List style={{marginTop: 40}}>
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: Color.splitLine1,
                marginHorizontal: 20,
              }}
            />
            <List.Item
              style={{height: 60}}
              icon={<Icon name={'community-black'} size={24} />}
              title={'选择圈子'}
              textStyle={{color: Color.primary}}
              extra={(selectedCommunity && selectedCommunity.name) || ' '}
              extraStyle={{color: Color.statusBlue}}
              arrow={'right'}
              arrowStyle={{width: 8, height: 16}}
              onPress={() => {
                props.navigation.navigate('CommunitySelect', {
                  onCommunitySelect: (community: Community) =>
                    setSelectedCommunity(community),
                });
              }}
            />
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: Color.splitLine1,
                marginHorizontal: 20,
              }}
            />
            <List.Item
              style={{height: 60}}
              icon={
                <Icon
                  name={'location-black'}
                  size={20}
                  style={{marginRight: 4}}
                />
              }
              title={'选择位置'}
              textStyle={{color: Color.primary}}
              extra={' '}
              extraStyle={{color: Color.primary}}
              arrow={'right'}
              arrowStyle={{width: 8, height: 16}}
              onPress={() => {}}
            />
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: Color.splitLine1,
                marginHorizontal: 20,
              }}
            />
          </List>
        </ScrollView>
      </View>
    </View>
  );
}

export default Index;
