import React from 'react';
import { Picker, StyleSheet } from 'react-native';
import { Item } from './types';

const emptyItems = [{label: '', value: ''}];

/*PickerIOSBody.propTypes = {
    items: PropTypes.array,
    selectedIndex: PropTypes.number,
    onValueChange: PropTypes.func,
    disabledIndexArr: PropTypes.array
};*/

/*PickerIOSBody.defaultProps = {
    items: [],
    selectedIndex: 0,
    disabledIndexArr: []
};*/

export interface Props {
    items: Item[],
    selectedIndex?: number,
    onValueChange?: (value: string, index: number) => void,
    disabledIndexArr?: number[]
}

interface State {
    selectedValue: string,
    selectedIndex: number,
}

export default class PickerIOSBody extends React.Component<Props, State>{
    private items: Item[];

    constructor(props: Props){
        super(props);
        const items = props.items;
        this.items = Array.isArray(items) ? (items.length > 0 ? items : emptyItems) : emptyItems;
        let defaultSelectedIndex = props.selectedIndex || 0;
        const selectedItem = this.items[defaultSelectedIndex] || {};
        this.state = {
            selectedValue: selectedItem.value,
            selectedIndex: defaultSelectedIndex
        };
    }
    componentWillReceiveProps(nextProps: Props){
        this.items = nextProps.items;
        let defaultSelectedIndex = nextProps.selectedIndex || 0;
        const selectedItem = this.items[defaultSelectedIndex] || {};
        this.setState({
            selectedValue: selectedItem.value,
            selectedIndex: defaultSelectedIndex
        });
    }
    // 判断 ele 在不在 arr 中
    _notInArray = (ele: number, arr: number[]) => {
        return (
            arr.every((item) => {
                if (item !== ele) {
                    return true;
                }
            })
        );
    };
    _onValueChange = (value: string, index: number) => {
        let disabledIndexArr = this.props.disabledIndexArr || [];
        let i, enableIndex = 0, items = this.items;
        let length = items.length;
        for (i = 0; i < length; i++){
            enableIndex = index + i;
            if (enableIndex >= length) {
                enableIndex = enableIndex - length;
            }
            if (this._notInArray(enableIndex, disabledIndexArr)){
                break;
            }
        }
        // 如果没有一个能选中，就默认选中第一个
        if (i >= length){
            enableIndex = 0;
        }
        let enableValue = items[enableIndex].value;
        this.setState({
            selectedValue: enableValue,
            selectedIndex: enableIndex
        });
        this.props.onValueChange && this.props.onValueChange(enableValue, enableIndex);
    };
    render(){
        return (
            <Picker
                style={styles.pickerBody}
                itemStyle={styles.itemStyle}
                onValueChange={this._onValueChange}
                selectedValue={this.state.selectedValue}
            >
                {this.items.map((item, index) => {
                    return <Picker.Item key={index} label={item.label} value={item.value}/>;
                })}
            </Picker>
        );
    }
}

const styles = StyleSheet.create({
    pickerBody: {
        backgroundColor: '#FFFFFF',
        height: 215
    },
    itemStyle: {
        color: '#1a1a1a',
        fontSize: 20,
    }
});
