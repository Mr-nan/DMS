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
    red:'red',
    all_blue : "#08c5a7",
    all_background :"#F0F0F0",
    esc_button :"#999999"
}

const easyRequest =(url,paramer)=>{


    request(url, 'Post', paramer)
        .then((response) => {

                let tempJson=response.mjson.retdata;

                return {stateCode:1,data:tempJson}

            },
            (error) => {

                if(error.mycode!= -300||error.mycode!= -500){

                    this.props.showToast(error.mjson.msg);
                }else {

                    this.props.showToast('服务器连接有问题')
                }

                return {stateCode:-6}
            });


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

const toutalPage =(toutal,rows)=>{

    let toutalNum =Number(toutal);
    let rowsNum =Number(rows);

    let items=toutalNum/rowsNum;

    return Number.isInteger(items)?items:Math.trunc(items+1);


}

export {STATECODE,PAGECOLOR,width,height,dateFormat,adapeSize,fontadapeSize,changeToMillion,toutalPage}