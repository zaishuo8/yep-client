import React from 'react';
import Popup from "../Popup";
import {View,Text,StyleSheet} from "react-native";
import {TouchableWithoutFeedback} from "react-native";
import PickerBody from "../Picker/PickerBody";
import {Item} from "../Picker/types";

type time = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | undefined;

interface Props {
    startTime?: time,
    endTime?: time,
    visible?: boolean,
    title?: string | Element,
    onConfirmPress?: (selectTime: time, endTime: time) => void,
    onCancelPress?: (selectTime: time, endTime: time) => void,
    onValueChange?: (selectTime: time, endTime: time) => void,
}

interface State {
    startTime?: time
    endTime?: time
    visible: boolean,
}

const startTimeItems: Item[] = [],
    endTimeItems: Item[] = [];

let i: number = 0;
while(i < 24){
    startTimeItems.push({ label: `${i}点`, value: i.toString() });
    endTimeItems.push({ label: `${i}点`, value: i.toString() });
    i++;
}

export default class TimePicker extends React.Component<Props, State> {
    constructor(props: Props){
        super(props);
        this.state = {
            visible: props.visible || false,
            startTime: props.startTime || 0,
            endTime: props.endTime || 0,
        };
    }

    componentWillReceiveProps(nextProps: Props){
        this.setState({
            visible: nextProps.visible || false,
            // selectTime: nextProps.selectTime || '00:00:00'

            startTime: nextProps.startTime || 0,
            endTime: nextProps.endTime || 0,
        });
    }

    render(){
        const { startTime, endTime } = this.state;
        return (
            <Popup visible={this.state.visible} onClose={this.onCancelPress}>
                <View style={styles.datePickerContainer}>
                    <View style={styles.datePickerTitleContainer}>
                        <TouchableWithoutFeedback onPress={this.onCancelPress}>
                            <View style={styles.cancelContainerStyle}>
                                <Text style={styles.cancelAndConfirmTextStyle}>取消</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.titleContentContainer}>
                            {
                                typeof (this.props.title) === 'string' ?
                                    <Text>{this.props.title}</Text>
                                    :
                                    <View>{this.props.title}</View>
                            }
                        </View>
                        <TouchableWithoutFeedback onPress={this.onConfirmPress}>
                            <View style={styles.confirmContainerStyle}>
                                <Text style={styles.cancelAndConfirmTextStyle}>确定</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.pickerListContainer}>
                        <View style={[styles.onePickerContainer]}>
                            <PickerBody
                                items={startTimeItems}
                                selectedIndex={startTime}
                                onValueChange={(selectedValue: string) => {
                                    // @ts-ignore
                                    this.onValueChange({startTime: parseInt(selectedValue)});
                                }}
                            />
                        </View>
                        <View style={[styles.onePickerContainer]}>
                            <PickerBody
                                items={endTimeItems}
                                selectedIndex={endTime}
                                onValueChange={(selectedValue: string) => {
                                    // @ts-ignore
                                    this.onValueChange({endTime: parseInt(selectedValue)});
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Popup>
        );
    }

    onValueChange = (value: {startTime?: time, endTime?: time}) => {
        let startTime = this.state.startTime;
        let endTime = this.state.endTime;
        if (value.startTime || value.startTime === 0) startTime = value.startTime;
        if (value.endTime || value.endTime === 0) endTime = value.endTime;
        this.setState({ startTime, endTime });
        this.props.onValueChange && this.props.onValueChange(startTime, endTime);
    };

    onCancelPress = () => {
        this.props.onCancelPress && this.props.onCancelPress(this.state.startTime, this.state.endTime);
    };

    onConfirmPress = () => {
        this.props.onConfirmPress && this.props.onConfirmPress(this.state.startTime, this.state.endTime);
    };
}

const styles = StyleSheet.create({
    datePickerContainer: {
        alignSelf: 'stretch'
    },
    datePickerTitleContainer: {
        height: 44,
        backgroundColor: '#fafafa',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#c1c1c1',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#c1c1c1',
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    cancelContainerStyle: {
        justifyContent: 'center',
        paddingLeft: 16,
        paddingRight: 24,
    },
    titleContentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmContainerStyle: {
        justifyContent: 'center',
        paddingLeft: 24,
        paddingRight: 16,
    },
    cancelAndConfirmTextStyle: {
        color: '#ff571a',
        fontSize: 16,
    },
    titleContentTextStyle: {
        color: '#666666',
        fontSize: 12,
    },
    pickerListContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    onePickerContainer: {
        flex: 1,
    }
});
