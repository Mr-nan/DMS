/**
 * Created by lcus on 2017/5/10.
 */

import { Dimensions } from 'react-native';

const STATECODE ={

    loading:'blank',
    loadSuccess:'success',
    loadError:'error',
    empty:'empty'

}
const PAGECOLOR = {

    white:'white',
    red:'red'
}

const {width, height} = Dimensions.get('window')

const changeToMillion=(number)=>{

    let temp =Number.parseFloat(number);

    return Math.floor(temp/10000*10000)/10000
}
const dateFormat = (date,fmt) => {
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

const adapeSize = (size)=> {

    return ((size / 375.0) * width);
}
const fontadapeSize = (size)=> {

    return adapeSize(size) + 2;
}

export {STATECODE,PAGECOLOR,width,height,dateFormat,adapeSize,fontadapeSize,changeToMillion}