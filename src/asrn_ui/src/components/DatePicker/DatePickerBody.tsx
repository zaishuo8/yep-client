import React, {Component, RefObject} from 'react';
import { View, StyleSheet } from 'react-native';
import Picker from '../Picker/PickerBody';
import { splitDate, getDaysOfMonth, weekList, fixup } from '../../util/dateUtil';
import { Item } from '../Picker/types';


/*DatePickerBody.propTypes = {
    minimumDate: PropTypes.instanceOf(Date),
    maximumDate: PropTypes.instanceOf(Date),
    mode: PropTypes.oneOf(['year', 'year-month', 'date', 'datetime']),
    minuteInterval: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]),
    date: PropTypes.instanceOf(Date),
    onDateChange: PropTypes.func,
};*/

interface PickerList {
    year?: {
        yearList: Item[],
        yearSelectedIndex: number,
    },
    month?: {
        monthList: Item[],
        monthSelectedIndex: number,
    },
    day?: {
        dayList: Item[],
        daySelectedIndex: number,
    },
    dateTime?: {
        dateList: Item[],
        dateSelectedIndex: number,
    },
    ampm?: {
        ampmList: Item[],
        ampmSelectedIndex: number,
    },
    hour?: {
        hourList: Item[],
        hourSelectedIndex: number,
    },
    minute?: {
        minuteList: Item[],
        minuteSelectedIndex: number,
    }
}

export interface Props {
    minimumDate: Date,
    maximumDate: Date,
    mode: 'year' | 'year-month' | 'date' | 'datetime',
    minuteInterval: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30,
    date: Date,
    onDateChange: (date: Date) => void
}

interface State {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    seconds: number,
    weekdays: number,
}

export default class DatePickerBody extends Component<Props, State>{
    private minimumDate: Date;
    private maximumDate: Date;
    private _container: RefObject<View>;

    constructor(props: Props){
        super(props);
        // state 控制选中的时间
        const { date, minimumDate, maximumDate } = props;
        this.minimumDate = minimumDate;
        this.maximumDate = maximumDate;
        const {year, month, day, hour, minute, seconds, weekdays} = splitDate(date);
        this.state = {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            seconds: seconds,
            weekdays: weekdays,
        };
        this._container = React.createRef();
    }

    componentWillReceiveProps(nextProps: Props){
        const { date, minimumDate, maximumDate } = nextProps;
        this.minimumDate = minimumDate;
        this.maximumDate = maximumDate;
        const {year, month, day, hour, minute, seconds, weekdays} = splitDate(date);
        this.setState({year, month, day, hour, minute, seconds, weekdays});
    }

    shouldComponentUpdate(nextProps: Props, nextState: State){
        return !(
            ((!nextProps.minimumDate && !this.props.minimumDate) || (nextProps.minimumDate && this.props.minimumDate && nextProps.minimumDate.getTime() === this.props.minimumDate.getTime()))
            &&
            ((!nextProps.maximumDate && !this.props.maximumDate) || (nextProps.maximumDate && this.props.maximumDate && nextProps.maximumDate.getTime() === this.props.maximumDate.getTime()))
            &&
            (nextProps.mode === this.props.mode)
            &&
            (nextProps.minuteInterval === this.props.minuteInterval)
            &&
            ((!nextProps.date && !this.props.date) || (nextProps.date && this.props.date && nextProps.date.getTime() === this.props.date.getTime()))
            &&
            (nextState.year === this.state.year) &&
            (nextState.month === this.state.month) &&
            (nextState.day === this.state.day) &&
            (nextState.hour === this.state.hour) &&
            (nextState.minute === this.state.minute) &&
            (nextState.seconds === this.state.seconds)
        );
    }

    /**
     * 构造每个 Picker 的参数
     * */
    generatorPickerParams(): PickerList{
        const {minimumDate, maximumDate, minuteInterval, mode} = this.props;
        if (!(mode === 'datetime')){
            // 年: 只与最大最小时间有关
            let yearList = [];
            for (let i = minimumDate.getFullYear(); i <= maximumDate.getFullYear(); i++){
                yearList.push({value: `year_${i}`, label: `${i}年`});
            }
            const yearSelectedIndex = this.state.year - minimumDate.getFullYear();

            // 月: 与选中年份和最大最小时间有关
            let minMonth = 1, maxMonth = 12;
            if (this.state.year === minimumDate.getFullYear()){
                // 选中年是最小时间对应的年份
                minMonth = minimumDate.getMonth() + 1;
            }
            if (this.state.year === maximumDate.getFullYear()){
                // 选中年是最大时间对应的年份
                maxMonth = maximumDate.getMonth() + 1;
            }
            let monthList = [];
            for (let i = minMonth; i <= maxMonth; i++){
                monthList.push({value: `month_${i}`, label: `${i}月`});
            }
            let monthSelectedIndex = this.state.month - minMonth;
            if (monthSelectedIndex < 0) {monthSelectedIndex = 0;}
            if (monthSelectedIndex > monthList.length - 1) {monthSelectedIndex = monthList.length - 1;}

            // 日: 与选中年月和最大最小时间有关
            let minDay = 1, maxDay = getDaysOfMonth(this.state.year, this.state.month);
            if (this.state.year === minimumDate.getFullYear() && this.state.month === minimumDate.getMonth() + 1){
                // 选中年月是最小年对应的年月
                minDay = minimumDate.getDate();
            }
            if (this.state.year === maximumDate.getFullYear() && this.state.month === maximumDate.getMonth() + 1){
                // 选中年月是最大年对应的年月
                maxDay = maximumDate.getDate();
            }
            let dayList = [];
            for (let i = minDay; i <= maxDay; i++){
                dayList.push({value: `day_${i}`, label: `${i}日`});
            }
            let daySelectedIndex = this.state.day - minDay;
            if (daySelectedIndex < 0) {daySelectedIndex = 0;}
            if (daySelectedIndex > dayList.length - 1) {daySelectedIndex = dayList.length - 1;}
            return {
                year: {yearList, yearSelectedIndex},
                month: {monthList, monthSelectedIndex},
                day: {dayList, daySelectedIndex}
            };
        } else {
            // 月日周
            let dateList = [];
            let dateSelectedIndex = 0;
            // 遍历最小天的0点到最大时间的23点，间隔一天
            let minDateTime = new Date(minimumDate.getFullYear(), minimumDate.getMonth(), minimumDate.getDate(), 0, 0, 0);
            let macDateTime = new Date(maximumDate.getFullYear(), maximumDate.getMonth(), maximumDate.getDate(), 23, 59, 59);
            let counter = 0;
            for (let i = minDateTime.getTime(); i <= macDateTime.getTime(); i += 86400000){
                let oneDate = new Date(i),
                    oneYear = oneDate.getFullYear(),
                    oneMonth = oneDate.getMonth() + 1,
                    oneDay = oneDate.getDate(),
                    weekDay = weekList[oneDate.getDay()];
                let item = {
                    value: `year_${oneYear}_month_${oneMonth}_day_${oneDay}`,
                    label: `${oneMonth}月${oneDay}日 ${weekDay}`
                };
                let today = new Date();
                if (oneYear === today.getFullYear() && oneMonth === today.getMonth() + 1 && oneDay === today.getDate()){
                    item.label = '今天';
                }
                dateList.push(item);

                if (oneYear === this.state.year && oneMonth === this.state.month && oneDay === this.state.day){
                    dateSelectedIndex = counter;
                }
                counter++;
            }

            // 上午下午
            let ampmList = [{value: 'am', label: '上午'}, {value: 'pm', label: '下午'}];
            if (this.state.year === minimumDate.getFullYear() && this.state.month === minimumDate.getMonth() + 1 && this.state.day === minimumDate.getDate()){
                // 最小时间是下午，不显示上午选项
                if (minimumDate.getHours() >= 12){
                    ampmList = [{value: 'pm', label: '下午'}];
                }
            }
            if (this.state.year === maximumDate.getFullYear() && this.state.month === maximumDate.getMonth() + 1 && this.state.day === maximumDate.getDate()){
                // 最大时间是上午，不显示下午选项
                if (maximumDate.getHours() < 12){
                    ampmList = [{value: 'am', label: '上午'}];
                }
            }
            let ampmSelectedIndex = 0;
            if (ampmList.length === 2){
                ampmSelectedIndex = this.state.hour < 12 ? 0 : 1;
            } else {
                ampmSelectedIndex = 0;
            }

            // 小时
            let hourList = [];
            let minHour = 0, maxHour = 11;
            if (this.state.year === minimumDate.getFullYear() && this.state.month === minimumDate.getMonth() + 1 && this.state.day === minimumDate.getDate()){
                minHour = minimumDate.getHours();
                if (minHour >= 12) {
                    minHour = minHour - 12;
                }
            }
            if (this.state.year === maximumDate.getFullYear() && this.state.month === maximumDate.getMonth() + 1 && this.state.day === maximumDate.getDate()){
                maxHour = maximumDate.getHours();
                if (maxHour >= 12){
                    maxHour = maxHour - 12;
                }
            }
            for (let i = minHour; i <= maxHour; i++){
                if (i === 0){
                    hourList.push({
                        value: `hour_${12}`,
                        label: `${12}`
                    });
                } else {
                    hourList.push({
                        value: `hour_${i}`,
                        label: `${i}`
                    });
                }
            }
            let hourSelectedIndex = this.state.hour < 12 ? this.state.hour - minHour : this.state.hour - 12 - minHour;

            // 分
            let minuteList = [];
            let minMinute = 0, maxMinute = 59;
            if (this.state.year === minimumDate.getFullYear() && this.state.month === minimumDate.getMonth() + 1 && this.state.day === minimumDate.getDate() && this.state.hour === minimumDate.getHours()){
                minMinute = minimumDate.getMinutes();
            }
            if (this.state.year === maximumDate.getFullYear() && this.state.month === maximumDate.getMonth() + 1 && this.state.day === maximumDate.getDate() && this.state.hour === maximumDate.getHours()){
                maxMinute = maximumDate.getMinutes();
            }
            for (let i = minMinute; i <= maxMinute; i += minuteInterval){
                minuteList.push({
                    value: `minute_${i}`,
                    label: fixup(i)
                });
            }
            // @ts-ignore
            const minuteSelectedIndex = parseInt(((this.state.minute - minMinute) / minuteInterval), 10);

            return {
                dateTime: {dateList, dateSelectedIndex},
                ampm: {ampmList, ampmSelectedIndex},
                hour: {hourList, hourSelectedIndex},
                minute: {minuteList, minuteSelectedIndex}
            };
        }
    }

    render(){
        const {mode} = this.props;
        switch (mode){
            case 'year': {
                const {year} = this.generatorPickerParams();
                return (
                    year &&
                    <View ref={this._container} style={styles.pickerListContainer}>
                        <View style={styles.onePickerContainer}>
                            <Picker
                                items={year.yearList}
                                selectedIndex={year.yearSelectedIndex}
                                onValueChange={(selectedValue: string) => {
                                    // @ts-ignore
                                    const selectYear = parseInt(selectedValue.match(/\d+/)[0], 10);
                                    this.onDateChange({year: selectYear});
                                }}
                            />
                        </View>
                    </View>
                );
            }
            case 'year-month': {
                const {year, month} = this.generatorPickerParams();
                return (
                    year && month &&
                    <View ref={this._container} style={styles.pickerListContainer}>
                        <View style={styles.onePickerContainer}>
                            <Picker
                                items={year.yearList}
                                selectedIndex={year.yearSelectedIndex}
                                onValueChange={(selectedValue: string) => {
                                    // @ts-ignore
                                    const selectYear = parseInt(selectedValue.match(/\d+/)[0], 10);
                                    this.onDateChange({year: selectYear});
                                }}
                            />
                        </View>
                        <View style={styles.onePickerContainer}>
                            <Picker
                                items={month.monthList}
                                selectedIndex={month.monthSelectedIndex}
                                onValueChange={(selectedValue: string) => {
                                    // @ts-ignore
                                    const selectMonth = parseInt(selectedValue.match(/\d+/)[0], 10);
                                    this.onDateChange({month: selectMonth});
                                }}
                            />
                        </View>
                    </View>
                );
            }
            case 'date': {
                const {year, month, day} = this.generatorPickerParams();
                const flexNum = {year: 2, month: 1, day: 2};
                return (
                    year && month && day &&
                    <View ref={this._container} style={styles.pickerListContainer}>
                        <View style={[styles.onePickerContainer, {flex: flexNum.year}]}>
                            <Picker
                                items={year.yearList}
                                selectedIndex={year.yearSelectedIndex}
                                onValueChange={(selectedValue: string) => {
                                    // @ts-ignore
                                    const selectYear = parseInt(selectedValue.match(/\d+/)[0], 10);
                                    this.onDateChange({year: selectYear});
                                }}
                            />
                        </View>
                        <View style={[styles.onePickerContainer, {flex: flexNum.month}]}>
                            <Picker
                                items={month.monthList}
                                selectedIndex={month.monthSelectedIndex}
                                onValueChange={(selectedValue: string) => {
                                    // @ts-ignore
                                    const selectMonth = parseInt(selectedValue.match(/\d+/)[0], 10);
                                    this.onDateChange({month: selectMonth});
                                }}
                            />
                        </View>
                        <View style={[styles.onePickerContainer, {flex: flexNum.day}]}>
                            <Picker
                                items={day.dayList}
                                selectedIndex={day.daySelectedIndex}
                                onValueChange={(selectedValue: string) => {
                                    // @ts-ignore
                                    const selectDay = parseInt(selectedValue.match(/\d+/)[0], 10);
                                    this.onDateChange({day: selectDay});
                                }}
                            />
                        </View>
                    </View>
                );
            }
            case 'datetime': {
                const {dateTime, ampm, hour, minute} = this.generatorPickerParams();
                const flexNum = {dateTime: 4, ampm: 2, hour: 1, minute: 2};
                return (
                    dateTime && ampm && hour && minute &&
                    <View ref={this._container} style={styles.pickerListContainer}>
                        <View style={[styles.onePickerContainer, {flex: flexNum.dateTime}]}>
                            <Picker
                                items={dateTime.dateList}
                                selectedIndex={dateTime.dateSelectedIndex}
                                onValueChange={(selectedValue: string) => {
                                    const selectedDate = selectedValue.match(/\d+/g);
                                    this.onDateChange({
                                        // @ts-ignore
                                        year: parseInt(selectedDate[0], 10), month: parseInt(selectedDate[1], 10), day: parseInt(selectedDate[2], 10),
                                    });
                                }}
                            />
                        </View>
                        <View style={[styles.onePickerContainer, {flex: flexNum.ampm}]}>
                            <Picker
                                items={ampm.ampmList}
                                selectedIndex={ampm.ampmSelectedIndex}
                                onValueChange={(selectedValue: string) => {
                                    // ampm 由 hour 控制, 所以这里不改 ampm, 只改 hour
                                    if (selectedValue === 'am'){
                                        if (this.state.hour >= 12){
                                            this.onDateChange({hour: this.state.hour - 12});
                                        }
                                    } else {
                                        if (this.state.hour < 12){
                                            this.onDateChange({hour: this.state.hour + 12});
                                        }
                                    }
                                }}
                            />
                        </View>
                        <View style={[styles.onePickerContainer, {flex: flexNum.hour}]}>
                            <Picker
                                items={hour.hourList}
                                selectedIndex={hour.hourSelectedIndex}
                                onValueChange={(selectedValue: string) => {
                                    // @ts-ignore
                                    const selectedHour = parseInt(selectedValue.match(/\d+/g)[0], 10);
                                    let selectedHour24 = 0;
                                    if (this.state.hour < 12){
                                        if (selectedHour === 12) {
                                            selectedHour24 = 0;
                                        } else {
                                            selectedHour24 = selectedHour;
                                        }
                                    } else {
                                        if (selectedHour === 12) {
                                            selectedHour24 = 12;
                                        } else {
                                            selectedHour24 = selectedHour + 12;
                                        }
                                    }
                                    this.onDateChange({hour: selectedHour24});
                                }}
                            />
                        </View>
                        <View style={[styles.onePickerContainer, {flex: flexNum.minute}]}>
                            <Picker
                                items={minute.minuteList}
                                selectedIndex={minute.minuteSelectedIndex}
                                onValueChange={(selectedValue: string) => {
                                    // @ts-ignore
                                    const selectedMinute = parseInt(selectedValue.match(/\d+/g)[0], 10);
                                    this.onDateChange({minute: selectedMinute});
                                }}
                            />
                        </View>
                    </View>
                );
            }
            default: {
                return;
            }
        }
    }

    onDateChange(date: {year?: number, month?: number, day?: number, hour?: number, minute?: number, seconds?: number}){
        const { year, month, day, hour, minute, seconds } = date;
        const newYear = (year || year === 0) ? year : this.state.year;
        const newMonth = (month || month === 0) ? month : this.state.month;
        const newDay = (day || day === 0) ? day : this.state.day;
        const newHour = (hour || hour === 0) ? hour : this.state.hour;
        const newMinute = (minute || minute === 0) ? minute : this.state.minute;
        const newSeconds = (seconds || seconds === 0) ? seconds : this.state.seconds;
        let selectedDate = new Date(newYear, newMonth - 1, newDay, newHour, newMinute, newSeconds);
        if (selectedDate.getTime() < this.minimumDate.getTime()){
            selectedDate = this.minimumDate;
        }
        if (selectedDate.getTime() > this.maximumDate.getTime()){
            selectedDate = this.maximumDate;
        }
        const newDateTime = splitDate(selectedDate);
        this._container && this.setState({
            year: newDateTime.year,
            month: newDateTime.month,
            day: newDateTime.day,
            hour: newDateTime.hour,
            minute: newDateTime.minute,
            seconds: newDateTime.seconds,
            weekdays: newDateTime.weekdays,
        }, () => { this.props.onDateChange && this.props.onDateChange(selectedDate); });
    }
}

const styles = StyleSheet.create({
    datePickerContainer: {
        alignSelf: 'stretch'
    },
    pickerListContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    onePickerContainer: {
        flex: 1,
    }
});
