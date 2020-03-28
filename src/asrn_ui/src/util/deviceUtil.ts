import {
    Dimensions,
    Platform,
} from 'react-native';

const X_HEIGHT = 812, X_WIDTH = 375;
const XR_HEIGHT = 896, XR_WIDTH = 414;
const XS_HEIGHT = 812, XS_WIDTH = 375;
const XSMAX_HEIGHT = 896, XSMAX_WIDTH = 414;

export function afterIPhoneX(): boolean {
    const WINDOW_HEIGHT = Dimensions.get('window').height;
    const WINDOW_WIDTH = Dimensions.get('window').width;
    if(Platform.OS === 'ios') {
        return ((WINDOW_HEIGHT === X_HEIGHT && WINDOW_WIDTH === X_WIDTH) || (WINDOW_HEIGHT === X_WIDTH && WINDOW_WIDTH === X_HEIGHT)) ||
               ((WINDOW_HEIGHT === XR_HEIGHT && WINDOW_WIDTH === XR_WIDTH) || (WINDOW_HEIGHT === XR_WIDTH && WINDOW_WIDTH === XR_HEIGHT)) ||
               ((WINDOW_HEIGHT === XS_HEIGHT && WINDOW_WIDTH === XS_WIDTH) || (WINDOW_HEIGHT === XS_WIDTH && WINDOW_WIDTH === XS_HEIGHT)) ||
               ((WINDOW_HEIGHT === XSMAX_HEIGHT && WINDOW_WIDTH === XSMAX_WIDTH) || (WINDOW_HEIGHT === XSMAX_WIDTH && WINDOW_WIDTH === XSMAX_HEIGHT));
    }
    return false;
}
