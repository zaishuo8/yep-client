// 18201 ==> 18,201
function parseToMoney(num: string): string {
    let numb = parseFloat(parseFloat(num).toFixed(2)); // 保留小数点后面2位
    let [integer, decimal] = numb.toString().split('.');
    integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,');
    let result = integer;
    if (decimal) {
        result = `${integer}.${decimal}`;
    } else if (num.indexOf('.') >= 0) {
        result = `${integer}.`
    }
    return result;
}

// 传入 分，return 123,456.00
function formatMoney(cent: number): string {
    if (typeof cent !== 'number') {
        return '0.00'
    }
    const fee = cent / 100;
    let feeText = parseToMoney(fee.toString());
    const feeArr = feeText.split('.');
    if (!feeArr[1]) feeText += '.00';
    if (feeArr[1] && feeArr[1].length === 1) feeText += '0';
    return feeText;
}

export {
    parseToMoney,
    formatMoney
}
