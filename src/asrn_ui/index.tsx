import {ReactElement} from "react";

export * from './src';

const Asrn = {
    toast: (value: string) => {},
    modal: (title: string, options: Array<{ text: string, onPress: (inputText?: string) => void | Promise<void> }>, textInput?: boolean, textInputPlaceHolder?: string, subTitle?: string) => {},
    loading: {
        show: (text: string) => {},
        hide: () => {},
    },
    filterLayer: {
        show: (children: ReactElement) => {},
        hide: () => {},
    },
};
export default Asrn;
