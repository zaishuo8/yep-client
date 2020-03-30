import * as React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from '../../components/Icon';
import Home from './tabs/Home';
import UploadPosting from '../UploadPosting';
import {StackNavigationProp} from '@react-navigation/stack';

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
  return (
    <View style={{flex: 1}}>
      <TabPage
        onAddPress={() => {
          props.navigation.navigate('UploadPosting');
        }}
      />
    </View>
  );
}

export default TabIndex;
