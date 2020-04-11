import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {getCurrentUser} from './api/request/user';
import {Dispatch} from 'redux';
import {UpdateUserType} from './store/user/reducers';
import {StackNavigationProp} from '@react-navigation/stack';

interface Props {
  dispatch: Dispatch;
  navigation: StackNavigationProp<any>;
}

class Index extends React.PureComponent<Props> {
  render() {
    return (
      <View/>
    );
  }

  async componentDidMount() {
    try {
      const user = await getCurrentUser();
      this.props.dispatch({
        type: UpdateUserType,
        user,
      });
      this.props.navigation.replace('IndexTab');
    } catch (e) {
      console.error(e);
    }
  }
}

export default connect()(Index);
