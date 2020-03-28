/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import React, {RefObject} from 'react';
import {View} from 'react-native';

import IndexTabNav from './src/pages/IndexTabNav';
import UploadPosting from './src/pages/UploadPosting';
import CommunitySelect from './src/pages/CommunitySelect';

import Asrn, {Modal, Toast, Loading} from './src/asrn_ui';

declare var global: {HermesInternal: null | {}};

const Stack = createStackNavigator();

function StackNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="IndexTab"
          component={IndexTabNav}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UploadPosting"
          component={UploadPosting}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CommunitySelect"
          component={CommunitySelect}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

class App extends React.Component {
  private toast: RefObject<Toast> = React.createRef(); // Toast ref
  private modal: RefObject<Modal> = React.createRef(); // Modal ref
  private loading: RefObject<Loading> = React.createRef(); // Modal ref

  showToast = (value: string) => {
    this.toast && this.toast.current && this.toast.current.show(value);
  };

  showModal = (
    title: string,
    options: Array<{
      text: string;
      onPress: (inputText?: string) => void;
    }>,
    textInput?: boolean,
    textInputPlaceHolder?: string,
    subTitle?: string,
  ) => {
    this.modal &&
      this.modal.current &&
      this.modal.current.show(
        title,
        options,
        textInput,
        textInputPlaceHolder,
        subTitle,
      );
  };

  showLoading = (text: string) => {
    this.loading.current && this.loading.current.show(text);
  };

  hideLoading = () => {
    this.loading.current && this.loading.current.hide();
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <StackNavigation />
        <Toast ref={this.toast} />
        <Modal ref={this.modal} visible={false} title={''} options={[]} />
        <Loading ref={this.loading} />
      </View>
    );
  }

  async componentDidMount() {
    // 挂载 toast/modal 工具
    Asrn.toast = this.showToast;
    Asrn.modal = this.showModal;
    Asrn.loading = {
      show: this.showLoading,
      hide: this.hideLoading,
    };
  }
}

export default App;
