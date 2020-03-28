import React, {Component} from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';

import PickerBody from './PickerBody';
import Popup from '../Popup';

import { Item } from './types';

export interface Props {
    visible: boolean,
    title: string | Element,
    onConfirmPress: (value: string, index: number) => void,
    onCancelPress: (value: string, index: number) => void,
    items: Item[],
    selectedIndex?: number,
    onValueChange?: (value: string, index: number) => void,
    disabledIndexArr?: number[]
}

interface State {
    visible: boolean,
    index: number,
    value: string,
}

export default class Picker extends Component<Props, State>{
    constructor(props: Props){
        super(props);
        this.state = {
            visible: props.visible || false,
            index: props.selectedIndex || 0,
            value: props.items[props.selectedIndex || 0].value,
        };
    }

    componentWillReceiveProps(nextProps: Props){
        this.setState({
            visible: nextProps.visible || false,
            index: nextProps.selectedIndex || 0,
            value: nextProps.items[nextProps.selectedIndex || 0].value,
        });
    }

    render(){
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
                    <PickerBody
                        items={this.props.items}
                        selectedIndex={this.props.selectedIndex}
                        onValueChange={this.onValueChange}
                        disabledIndexArr={this.props.disabledIndexArr}
                    />
                </View>
            </Popup>
        );
    }

    onValueChange = (value: string, index: number) => {
        this.setState({value, index});
        this.props.onValueChange && this.props.onValueChange(value, index);
    };

    onCancelPress = () => {
        this.props.onCancelPress && this.props.onCancelPress(this.state.value, this.state.index);
    };

    onConfirmPress = () => {
        this.props.onConfirmPress && this.props.onConfirmPress(this.state.value, this.state.index);
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
