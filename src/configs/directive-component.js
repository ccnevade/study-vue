
import numAnimate   from '../components/numAnimate.vue'
import fixedTable   from '../components/fixedTable.vue'
import sortTable   from '../components/sortTable.vue'
import showImg   from '../components/showImg.vue'

exports.install = function (Vue, options) {
    //全局指令
    Vue.filter("string-num", function(value,length){
        return value.substring(0,length);
    });

    Vue.filter("dateFormatZefun", function(date,fmt){
        date=new Date(date)
        var o = {
          "M+" : date.getMonth()+1,                 //月份
          "d+" : date.getDate(),                    //日
          "h+" : date.getHours(),                   //小时
          "m+" : date.getMinutes(),                 //分
          "s+" : date.getSeconds(),                 //秒
          "q+" : Math.floor((date.getMonth()+3)/3), //季度
          "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
          fmt=fmt.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
          if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    });
    //注册全局组件
    Vue.component('numAnimate', numAnimate)
    Vue.component('fixed-table',fixedTable)
    Vue.component('sortTable',sortTable)
    Vue.component('showImg',showImg)
};
