import React, {Component} from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

import DatePickerBody from './DatePickerBody';
import Popup from '../Popup';

/*DatePicker.propTypes = {
    visible: PropTypes.bool,
    minimumDate: PropTypes.instanceOf(Date),
    maximumDate: PropTypes.instanceOf(Date),
    mode: PropTypes.oneOf(['year', 'year-month', 'date', 'datetime']),
    minuteInterval: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]),
    defaultDate: PropTypes.instanceOf(Date),
    onDateChange: PropTypes.func,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    onConfirmPress: PropTypes.func,
    onCancelPress: PropTypes.func,
};*/

export interface Props {
    visible: boolean,
    minimumDate: Date,
    maximumDate: Date,
    mode: 'year' | 'year-month' | 'date' | 'datetime',
    minuteInterval: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30,
    defaultDate?: Date,
    onDateChange: (date: Date) => void,
    title: string | Element,
    onConfirmPress: (date: Date) => void,
    onCancelPress: (date: Date) => void,
}

interface State {
    visible: boolean,
    selectedDate: Date,
}

export default class DatePicker extends Component<Props, State>{
    constructor(props: Props){
        super(props);
        const { date } = this.generatorParams(props);
        this.state = {
            visible: this.props.visible || false,
            selectedDate: date,
        };
    }

    componentWillReceiveProps(nextProps: Props){
        const { date } = this.generatorParams(nextProps);
        this.setState({
            visible: nextProps.visible || false,
            selectedDate: date,
        });
    }

    /**
     * 处理参数
     * */
    generatorParams(props: Props){
        let date = props.defaultDate || new Date();
        const mode = props.mode || 'date';
        let minimumDate = props.minimumDate;
        if (!minimumDate){
            if (mode === 'datetime') {
                minimumDate = new Date(date.getTime() - 30 * 24 * 3600000);
            } else {
                minimumDate = new Date(date.getTime() - 3650 * 24 * 3600000);
            }
        }
        if (date.getTime() < minimumDate.getTime()) {
            date = minimumDate;
        }
        let maximumDate = props.maximumDate;
        if (!maximumDate) {
            if (mode === 'datetime') {
                maximumDate = new Date(date.getTime() + 30 * 24 * 3600000);
            } else {
                maximumDate = new Date(date.getTime() + 3650 * 24 * 3600000);
            }
        }
        if (maximumDate.getTime() < minimumDate.getTime()) {
            maximumDate = minimumDate;
        }
        if (date.getTime() > maximumDate.getTime()) {
            date = maximumDate;
        }
        const minuteInterval = props.minuteInterval || 1;

        return {minimumDate, maximumDate, minuteInterval, date, mode};
    }

    render(){
        const { minimumDate, maximumDate, minuteInterval, mode } = this.generatorParams(this.props);
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
                    <DatePickerBody
                        mode={mode}
                        date={this.state.selectedDate}
                        maximumDate={maximumDate}
                        minimumDate={minimumDate}
                        minuteInterval={minuteInterval}
                        onDateChange={this.onDateChange}
                    />
                </View>
            </Popup>
        );
    }

    onDateChange = (selectedDate: Date) => {
        this.setState({selectedDate}, () => {
            this.props.onDateChange && this.props.onDateChange(this.state.selectedDate);
        });
    };

    onCancelPress = () => {
        this.props.onCancelPress && this.props.onCancelPress(this.state.selectedDate);
    };

    onConfirmPress = () => {
        this.props.onConfirmPress && this.props.onConfirmPress(this.state.selectedDate);
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
    }
});
