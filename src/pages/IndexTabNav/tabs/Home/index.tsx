import 'react-native-gesture-handler';

import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import {AppStateInterface} from '../../../../store';
import {connect} from 'react-redux';
import {OssProgressComponent} from '../../../../components/AliyunOSS';
import {OssState} from '../../../../store/oss/reducers';

interface Props {
  oss: OssState;
}

class Index extends React.PureComponent<Props> {
  render() {
    const {uploading, cover} = this.props.oss;
    return (
      <View style={{flex: 1}}>
        <CustomHeader />
        {uploading && <OssProgressComponent cover={cover} />}
        <Text>Home</Text>
      </View>
    );
  }
}

const mapStateToProps = (state: AppStateInterface) => ({
  oss: state.oss,
});

export default connect(mapStateToProps)(Index);
