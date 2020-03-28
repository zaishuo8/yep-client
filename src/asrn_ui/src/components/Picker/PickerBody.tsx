import PickerAndroidBody from './PickerAndroidBody';
import PickerIOSBody from './PickerIOSBody';
import {Platform} from "react-native";

export default Platform.OS === 'ios' ? PickerIOSBody : PickerAndroidBody;
