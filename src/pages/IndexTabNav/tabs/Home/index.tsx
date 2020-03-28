import 'react-native-gesture-handler';

import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';

function Index() {
  return (
    <View style={{flex: 1}}>
      <CustomHeader />
      <Text>Home</Text>
    </View>
  );
}

export default Index;
