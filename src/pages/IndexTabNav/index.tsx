import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from '../../components/Icon';
import Home from './tabs/Home';
import UploadPosting from '../UploadPosting';
import {StackNavigationProp} from '@react-navigation/stack';
// import {Popup} from '../../asrn_ui/src';
// import {useState} from 'react';
// import {Color} from '../../config/color_yep';
// import ImagePicker, {Image} from 'react-native-image-crop-picker';

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function TabPage({onAddPress}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          if (route.name === 'Home') {
            return focused ? (
              <Icon name={'home-fill-black'} size={30} />
            ) : (
              <Icon name={'home-black'} size={30} />
            );
          }
          if (route.name === 'Message') {
            return focused ? (
              <Icon name={'message-fill-black'} size={30} />
            ) : (
              <Icon name={'message-black'} size={26} />
            );
          }
          if (route.name === 'Add') {
            return (
              <TouchableOpacity onPress={onAddPress}>
                <Icon name={'add-black'} size={32} />
              </TouchableOpacity>
            );
          }
          if (route.name === 'Favorites') {
            return focused ? (
              <Icon name={'favorites-fill-black'} size={30} />
            ) : (
              <Icon name={'favorites-black'} size={30} />
            );
          }
          if (route.name === 'Account') {
            return focused ? (
              <Icon name={'account-fill-black'} size={30} />
            ) : (
              <Icon name={'account-black'} size={30} />
            );
          }
        },
        tabBarLabel: () => null,
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Message" component={SettingsScreen} />
      <Tab.Screen name="Add" component={UploadPosting} />
      <Tab.Screen name="Favorites" component={SettingsScreen} />
      <Tab.Screen name="Account" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

interface Props {
  navigation: StackNavigationProp<any>;
}

function TabIndex(props: Props) {
  // const [visible, setVisible] = useState(false);

  /*const navigateUploadPosting = (images: Image[]) => {
    props.navigation.navigate('UploadPosting', {
      imageList: images,
    });
  };*/

  /*const selectFromLibrary = async () => {
    try {
      // @ts-ignore
      const images: Image[] = await ImagePicker.openPicker({
        multiple: true,
        compressVideoPreset: 'HighQuality',
        loadingLabelText: '读取中',
        showsSelectedCount: false,
        compressImageQuality: 1,
        maxFiles: 9,
      });
      setVisible(false);
      navigateUploadPosting(images);
    } catch (e) {
      console.error(e);
      setVisible(false);
    }
  };*/

  return (
    <View style={{flex: 1}}>
      <TabPage
        onAddPress={() => {
          props.navigation.navigate('UploadPosting');
        }}
      />
      {/*<Popup onClose={() => setVisible(false)} visible={visible}>
        <SafeAreaView>
          <View
            style={{
              backgroundColor: Color.bgPrimary,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <WhiteButton text={'拍摄'} onPress={() => {}} />
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: Color.splitLine1,
              }}
            />
            <WhiteButton text={'从相册选取'} onPress={selectFromLibrary} />
            <View
              style={{
                height: 10,
                backgroundColor: Color.bgGray,
              }}
            />
            <WhiteButton text={'取消'} onPress={() => setVisible(false)} />
          </View>
        </SafeAreaView>
      </Popup>*/}
    </View>
  );
}

/*const WhiteButton = ({text, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.whiteButton}
      onPress={() => {
        onPress && onPress();
      }}>
      <Text style={styles.whiteButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};*/

/*const styles = StyleSheet.create({
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
});*/

export default TabIndex;
