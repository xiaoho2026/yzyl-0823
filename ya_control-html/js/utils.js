var host = "http://meeting-test.scasia-core.com:8099"

var utils = {
	isnull :function(str){
		if(str==""||str=="null"||str==null||"undefined" == typeof str){
		    return true;
		}
		return false;
	},
	myIsNaN :function(value) {
	   return (typeof value === 'number' && !isNaN(value));
	},
	stringToHex :function(str){
　　　　var val="";
　　　　for(var i = 0; i < str.length; i++){
　　　　　　if(val == "")
　　　　　　　　val = str.charCodeAt(i).toString(16);
　　　　　　else
　　　　　　　　val += str.charCodeAt(i).toString(16);
　　　　}
　　　　return val;
　　},
	hexStrToBytes :function(bytes) {   //string转hex
		var uint8Array = new Uint8Array(bytes.length / 2);
		var buff = new Uint8Array(bytes.length);
		var hexABC = "0123456789ABCDEF";
		var hexabc = "0123456789abcdef";

		var i, j = 0;
		var point = 0;
		for (i = 0; i < bytes.length; i++) {
			buff[i] = bytes[i] & 0xff;

			for (j = 0; j < 16; j++) {
				if (buff[i] == hexABC.charCodeAt(j)) {
					buff[i] = j;
					break;
				}
				else if (buff[i] == hexabc.charCodeAt(j)) {
					buff[i] = j;
					break;
				}
				if (j == 15) {
					buff[i] = 0;
				}//超过f的字符都视为0
			}
		}
		for (i = 0; i < bytes.length / 2; i++) {
			uint8Array[i] = buff[point] * 16 + buff[point + 1];
			point += 2;
		}
		return uint8Array;
	},
	GetQueryString :function(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return decodeURI(r[2]);
		return null;
	},
	Datetime : function() {
		var date = new Date();
		var month, dates, hours, min, seconds;
		month = (date.getMonth() + 1);
		dates = date.getDate();
		hours = date.getHours();
		min = date.getMinutes();
		seconds = date.getSeconds();
		// if (month < 10) {
		// 	month = "0" + month;
		// }
		if (dates < 10) {
			dates = "0" + dates;
		}
		if (hours < 10) {
			hours = "0" + hours;
		}
		if (min < 10) {
			min = "0" + min;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		week = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
		var clocks = week[date.getDay()]
		var time = hours + ":" + min
		var date = date.getFullYear() + "/" + month + "/" + dates;
		return time+"#" + date + "&nbsp;&nbsp;&nbsp;" + clocks;
	},
	
	ajax :function(url,type,data){
		return $.ajax({
			url:host + url,
			type:type,
			data:JSON.stringify(data),
			timeout: 10000,
			dataType:"json",
			headers: { 
				'Content-Type' : 'application/json;charset=utf-8',
			},
		}).done(function(res){
			if(res.code == 500){
				//错误
				if(res.msg==""||res.msg=="null"||res.msg==null||"undefined" == typeof res.msg){
					tip.info_autoClose("访问服务器错误!",function(){})
				}else{
					tip.info_color_autoClose(res.msg,"SandyBrown",function(){})
				}
			}
		})
	},
}
var led = {
	// 智慧源 1蓝 2红 3绿
	control : function(number){
	    try{
	    	window.android.updateZhyLightBarColor(number);
	    }catch(err){
			//console.log(err)
	    }
	},
}

var face = {
	showFace :function(){
		try{
			window.android.showFace();//显示人脸框
		}catch(err){
			//console.log(err)
		}
	},
	pushCurrentMeetingOpenId :function(ids){
		try{
			window.android.pushCurrentMeetingOpenId(ids);//显示人脸框
		}catch(err){
			//console.log(err)
		}
	},
}
 
Date.prototype.Format = function (fmt) {
var o = {
"M+": this.getMonth() + 1, // 月份
"d+": this.getDate(), // 日
"H+": this.getHours(), // 小时
"m+": this.getMinutes(), // 分
"s+": this.getSeconds(), // 秒
"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
"S": this.getMilliseconds() // 毫秒
};
if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
for (var k in o)
if (new RegExp("(" + k + ")").test(fmt))
fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
return fmt;
};

