import 'react-native-gesture-handler';

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import TextInput from '../../components/TextInput';

import {Color} from '../../config/color_yep';
import {StackNavigationProp} from '@react-navigation/stack';
import ImagePicker, {Image} from 'react-native-image-crop-picker';
import {Media, MediaType} from '../../components/MdeiaList';
import {isVideo} from '../../utils/mediaUtil';
import MediaList from '../../components/MdeiaList';
import {SCREEN_WIDTH} from '../../const/screen';
import {List, Popup} from '../../asrn_ui';
import Icon from '../../components/Icon';
import {Community} from '../../api/request/community';

interface Props {
  navigation: StackNavigationProp<any>;
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
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [mediaList, setMediaList] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState<
    Community | undefined
  >(undefined);

  const selectFromLibrary = async () => {
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
      setVisible(false);
      setMediaList(mediaList.concat(trasformMediaType(images)));
    } catch (e) {
      console.error(e);
      setVisible(false);
    }
  };

  const selectFromCamera = async (mediaType: 'video' | 'photo') => {
    try {
      // @ts-ignore
      const image: Image = await ImagePicker.openCamera({
        compressVideoPreset: 'HighQuality',
        loadingLabelText: '读取中',
        showsSelectedCount: false,
        compressImageQuality: 1,
        mediaType,
      });
      setVisible(false);
      setMediaList(mediaList.concat(trasformMediaType([image])));
    } catch (e) {
      console.error(e);
      setVisible(false);
    }
  };

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
            onAddPress={() => setVisible(true)}
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
      <Popup onClose={() => setVisible(false)} visible={visible}>
        <SafeAreaView>
          <View
            style={{
              backgroundColor: Color.bgPrimary,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <WhiteButton
              text={'拍视频'}
              onPress={() => {
                selectFromCamera('video');
              }}
            />
            <Line />
            <WhiteButton
              text={'拍照'}
              onPress={() => {
                selectFromCamera('photo');
              }}
            />
            <Line />
            <WhiteButton
              text={'从相册选取'}
              onPress={() => {
                selectFromLibrary();
              }}
            />
            <Line height={10} />
            <WhiteButton text={'取消'} onPress={() => setVisible(false)} />
          </View>
        </SafeAreaView>
      </Popup>
    </View>
  );
}

const WhiteButton = ({text, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.whiteButton}
      onPress={() => {
        onPress && onPress();
      }}>
      <Text style={styles.whiteButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const Line = (props: {height?: number}) => (
  <View
    style={{
      height: props.height || StyleSheet.hairlineWidth,
      backgroundColor: Color.bgGray,
    }}
  />
);

const styles = StyleSheet.create({
  whiteButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  whiteButtonText: {
    color: Color.primary,
    fontSize: 18,
    height: 24,
    lineHeight: 24,
  },
});

export default Index;
