import React from 'react';
import {View, Platform, Keyboard} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../const/screen';
import {afterIPhoneX} from "../../utils/deviceUtil";

interface Props {}

interface State {
  visible: boolean;
  bottom: number;
}

/**
 * 使用绝对定位实现的，只能在 page 的第一层使用
 * */
class Index extends React.PureComponent<Props, State> {
  state: State = {
    visible: false,
    bottom: 0,
  };

  render() {
    const {visible, bottom} = this.state;
    return (
      <View
        style={{
          width: SCREEN_WIDTH,
          position: 'absolute',
          bottom: visible ? bottom : -SCREEN_HEIGHT,
        }}>
        {this.props.children}
      </View>
    );
  }

  keyboardShow = (e: {endCoordinates: {height: number}}) => {
    const keyBoardHeight = e.endCoordinates.height;
    const bottom =
      Platform.OS === 'ios'
        ? afterIPhoneX()
          ? keyBoardHeight - 84
          : keyBoardHeight - 50
        : 0;
    this.setState({
      visible: true,
      bottom,
    });
  };

  keyboardHide = () => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount(): void {
    if (Platform.OS === 'ios') {
      // @ts-ignore
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardWillShow',
        this.keyboardShow,
      );
      // @ts-ignore
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardWillHide',
        this.keyboardHide,
      );
    } else {
      // @ts-ignore
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this.keyboardShow,
      );
      // @ts-ignore
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this.keyboardHide,
      );
    }
  }

  componentWillUnmount(): void {
    // @ts-ignore
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    // @ts-ignore
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
  }
}

export default Index;
