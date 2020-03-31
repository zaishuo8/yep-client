import React, {ReactElement} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, ViewStyle, TextStyle, ImageStyle} from 'react-native';

export interface Props {
    children: Element,
    style?: {
        margin?: number, marginTop?: number, marginLeft?: number, marginRight?: number, marginBottom?: number,
        padding?: number, paddingTop?: number, paddingLeft?: number, paddingRight?: number, paddingBottom?: number,
        backgroundColor?: string, flex?: number
    }
}

export interface ItemProps {
    title: string,
    extra?: string | ReactElement,
    extraStyle?: TextStyle
    arrow?: string,
    onPress?: () => void,
    textStyle?: { color?: string, fontSize?: number, fontWeight?: 'normal' | 'bold' },
    icon?: Element,
    important?: boolean,  // 星号 *
    style?: ViewStyle,
    arrowStyle?: ImageStyle,
    extraNumberLines?: number,
}

class Item extends React.Component<ItemProps>{
    render() {
        const { title, extra, arrow, onPress, textStyle, icon, important, arrowStyle } = this.props;
        const Container: React.ReactType = onPress ? TouchableOpacity : View;
        return (
            <Container style={[styles.itemContainer,this.props.style]} onPress={onPress}>
                {important && <Text style={{color: '#EA0029', marginRight: 4, fontSize: 14, padding: 0}}>*</Text>}
                {icon && icon}
                {icon && <View style={{ width: 10 }}/>}
                <Text style={[styles.titleText, textStyle]}>{title}</Text>
                {this.renderExtra()}
                {arrow === 'right' && <Image source={require('../../../asset/images/right_arrow.png')} style={[styles.arrow, arrowStyle]} resizeMode={'contain'} />}
            </Container>
        )
    }

    renderExtra() {
        const extra = this.props.extra;
        if (extra) {
            return typeof extra === 'string' ? <Text style={[styles.extraText,this.props.extraStyle]} numberOfLines={this.props.extraNumberLines}>{extra}</Text> : extra;
        }
    }
}

class List extends React.Component<Props>{

    static Item = Item;

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                {React.Children.map(this.props.children, (child, index) => {
                    return <View key={index}>{child}</View>
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
    },
    itemContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingVertical: 12,
        // height: 45,
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleText: {
        color: '#212121',
        fontSize: 16,
        // fontWeight: 'bold',
        padding: 0,
    },
    extraText: {
        color: '#999999',
        fontSize: 16,
        padding: 0,
        flex: 1,
        textAlign: 'right',
        marginLeft: 10,
    },
    arrow: {
        width: 5,
        height: 10,
        marginLeft: 10,
    }
});

export default List;
