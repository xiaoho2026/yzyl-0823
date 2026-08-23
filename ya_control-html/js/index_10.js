//底部切换框
element.addBottom($(".content"));
//空调模式风速弹出框
element.addHvacPop($("body"));
//服务呼叫弹出框
element.addService($("body"));
//会议修改弹出框
element.addMeeting_10($("body"));
//会议绑定弹出框
element.addBindMeeting($("body"));

var json_data = {}
var input = null
var change = null

var sum = utils.GetQueryString("sum");

if(!utils.isnull(sum)){
	var url = decodeURIComponent(window.location.pathname);
	var filename = url.substring(url.lastIndexOf('/') + 1).replace(".html","");
	let html = '<div class="page-cut"><div class="page-name">' + filename + '</div><div class="page-change">返回</div></div>'
	$(".top").append(html)
	$(".page-cut").css("display","flex")	
	
	$(".no-always").css("display","none")
}

function setData(msg) {
	try {
		let json = JSON.parse(msg);
		let childjson = json["child"];
		if (!utils.isnull(childjson)) {
			json = Object.assign(json, childjson);
			delete json["child"];
		}
		json_data = Object.assign(json_data, json)
		//读取所有id
		$.each($("[control]"), function (idx, itm) {
			let key = $(itm).attr("control");
			if (json.hasOwnProperty(key)) {
				let value = json[key];
				if ((value == "false" && $(itm).hasClass("inter-lock-active")) || (value == "true" && !$(itm).hasClass("inter-lock-active"))) {
					//触发点击事件
					$("[control=" + key + "]")[0].dispatchEvent(new Event('click'));
				}
				//自锁
				if ((value == "false" && $(itm).hasClass("self-lock-active")) || (value == "true" && !$(itm).hasClass("self-lock-active"))) {
					//触发点击事件
					$("[control=" + key + "]")[0].dispatchEvent(new Event('click'));
				}
				if (utils.myIsNaN(value)) {
					if($(itm).text().includes("%")){
						$(itm).text(value + "%");
					}
					if($(itm).text().includes("℃")){
						$(itm).text(value + "℃");
					}
					if($(itm).text().includes("速")){
						if(value == 4){
							$(itm).text("低速");
						}
						if(value == 5){
							$(itm).text("中速");
						}
						if(value == 6){
							$(itm).text("高速");
						}
					}
					$(itm).val(value);
					$(itm)[0].dispatchEvent(new Event('input'));
				}
			}
		});
	} catch (e) {}
}

function setDataByJsonData() {
	setData(JSON.stringify(json_data))
}

$(function(){
	//设置时间
	let setDateTime = function(){
		let Datetime = utils.Datetime().split("#");
		$(".time").html(Datetime[0]);
		$(".date").html(Datetime[1]);
	}
	setInterval(setDateTime,1000)
	
	//拖动拖动条，静止页面移动
	$("[type=range]").on("touchstart", function () {
	    $(".middle").css("overflow-x", "hidden");
	});
	
	//恢复页面移动
	$("[type=range]").on("touchend", function () {
	    $(".middle").css("overflow-x", "scroll");
	});
	
	//按钮特效
	$("html").on("touchstart",".b_effect", function () {
		if($(this).hasClass("curtain_icon")){
			$(this).css("cssText", "width: 9.5% !important;")
			$(this).css("padding","1.5%")
		}else{
			$(this).css("width","16%")
			$(this).css("padding","2%")
		}
		
	});
	//恢复特效
	$("html").on("touchend",".b_effect", function () {
		if($(this).hasClass("curtain_icon")){
			$(this).css("cssText", "width: 12.5% !important;")
		}else{
			$(this).css("width","20%")
		}
		$(this).css("padding","0%")
	});
	
	//跳转
	$(".switch-to").on("click",function(){
		$(".switch-to-active").removeClass("switch-to-active")
		$(this).addClass("switch-to-active")
		$(".middle").css("display","none")
		let href = $(this).attr("href")
		$("."+href).css("display","inline-block")
	})
	
	//跳转到切换页面
	$("html").on("click",".page-change",function(){
		//获取跳转地址
		var url = window.location.href;
		var filename = url.substring(url.lastIndexOf('/') + 1);
		location.href = "总控选择.html?jmpurl=" + filename 
	})
	
	//开门
	$("html").on("click",".opendoor",function(){
		try {
		    window.android.opendoor();
		} catch (e) {}
	})
	
	//页面翻页显示
	$.each($(".pages"),function(idx,itm){
		let pages = "";
		let len = $(itm).parent().find(".module-box").length
		for (let i = 0; i < Math.ceil(len/4); i++) {
			pages += '<div class="page"></div>';
		}
		$(itm).html(pages);
		$($(itm).find($(".page"))[0]).addClass("page-active");
	})
	
	//页面翻页显示
	$(".middle").scroll(function () {
	    let num = Math.floor($(this).scrollLeft() / $(this).width());
		let remainder = Math.floor($(this).scrollLeft() % $(this).width());
		if(remainder >= $(this).width() / 4){
			num ++
		}
		$(this).find(".page-active").removeClass("page-active");
	    $($(this).find(".page")[num]).addClass("page-active");
	});
	
	//+ - 按钮
	$("html").find("[self-lock]").on("click",".down", function (event) {
		event.status = true
		let data = $(this).next().html()
		let sync = ""
		if(data.includes("℃")){
			//温度
			data = (Number)(data.replace("℃",""))
			if(data > 16){
				data += -1
			}
			data += "℃"
			//同步空调温度
			sync = data
			
			event.active = $(this).parents(".module-control").hasClass("self-lock-active")
		}
		if(data.includes("%")){
			//亮度
			data = (Number)(data.replace("%",""))
			if((data - 10) >= 0){
				data += -10
			}else{
				data = 0
			}
			if(data == 0){
				event.status = false
			}
			data += "%"
		}
		if(data.includes("速")){
			//风速
			if(data == "中速"){
				data = "低速"
			}
			if(data == "高速"){
				data = "中速"
			}
			//同步空调风速
			sync = data
			event.active = $(this).parents(".module-control").hasClass("self-lock-active")
		}
		$(this).next().html(data)
		var child = $(this).parents(".module-control").attr("child")
		if(!utils.isnull(sync) && !utils.isnull(child)){
			let childs =  getChilds(child)
			for (let key in childs) {
				$("[control="+childs[key]+"]").find(".module-box-adjust-change span").html(sync)
			}
		}
		
	})
	
	//+ - 按钮
	$("html").find("[self-lock]").on("click",".up", function (event) {
		event.status = true
		let data = $(this).prev().html()
		let sync = ""
		if(data.includes("℃")){
			//温度
			data = (Number)(data.replace("℃",""))
			if(data < 30){
				data += 1
			}
			data += "℃"
			//同步空调温度
			sync = data
			
			event.active = $(this).parents(".module-control").hasClass("self-lock-active")
		}
		if(data.includes("%")){
			//温度
			data = (Number)(data.replace("%",""))
			if((data + 10) <= 100){
				data += 10
			}else{
				data = 100
			}
			data += "%"
		}
		if(data.includes("速")){
			//风速
			if(data == "中速"){
				data = "高速"
			}
			if(data == "低速"){
				data = "中速"
			}
			//同步空调风速
			sync = data
			
			event.active = $(this).parents(".module-control").hasClass("self-lock-active")
		}
		$(this).prev().html(data)
		var child = $(this).parents(".module-control").attr("child")
		if(!utils.isnull(sync) && !utils.isnull(child)){
			let childs =  getChilds(child)
			for (let key in childs) {
				$("[control="+childs[key]+"]").find(".module-box-adjust-change span").html(sync)
			}
		}

	})
	
	$("html").find("[self-lock]").find(".module-box-adjust-change").on("click","span", function (event) {
		event.stopPropagation();
	})
	
	$("html").find("[self-lock]").find(".hvac-change").on("click",function (event) {
		event.stopPropagation();
	})
	
	//颜色
	$.each($(".color"),function(idx,itm){
		if($(itm).hasClass("hidden")){
			let img = $(itm).parents(".module-control").find(".module-box-icon").find("img")
			img.css("margin-top","30%")
		}
	})
	
	$.each($(".middle"),function(idx,itm){
		let box = $(itm).find(".module-box")
		$(box[box.length - 1]).addClass("module-box-end")
	})
	
	//点击弹出
	$("[pop]").on("click", function (event) {
	    event.stopPropagation();
	    let pop = $(this).attr("pop");
		//读取点击
		let cid = (Number)($(this).parents(".module-control").attr("control"))
		let cdids = $(this).parents(".module-control").attr("child")
		$.each($("#" + pop).find(".pop-cont-box"),function(idx,itm){
			if(cid > 700000000 && cid < 799999999){
				//多联机
				if(idx < 4){
					$(itm).attr("control",cid + 100000 + idx * 10000)
				}else{
					$(itm).attr("control",cid + 200000 + idx * 10000)
				}
			}else{
				if(idx < 4){
					$(itm).attr("control",cid + 1000 + idx * 100)
				}else{
					$(itm).attr("control",cid + 2000 + idx * 100)
				}
			}

			if(!utils.isnull(cdids)){
				let list = getChilds(cdids)
				let arr = []
				$.each(list,function(idx2,itm2){
					if(Number(itm2) > 700000000 && Number(itm2) < 799999999){
						//多联机
						if(idx < 4){
							arr.push(Number(itm2) + 100000 + idx * 10000)
						}else{
							arr.push(Number(itm2) + 200000 + idx * 10000)
						}
					}else{
						if(idx < 4){
							arr.push(Number(itm2) + 1000 + idx * 100)
						}else{
							arr.push(Number(itm2) + 2000 + idx * 100)
						}
					}
				})
				$(itm).attr("child",arr.join(","))
			}
			$(itm).show()
		})
		setDataByJsonData()
		if(event.originalEvent.isTrusted){
			$("#" + pop).show();
		}
	});
	
	
	$("html").on("click",".close", function (event) {
		$(this).closest(".pop").find(".pop-cont-box").hide("slow", "swing")
	    $(this).closest(".pop").hide("slow", "swing");

		$(this).closest(".service-pop").hide("slow", "swing");
		$(this).closest(".meeting-pop").hide("slow", "swing");
	});
	
	//服务呼叫
	$("html").on("click",".service",function(){
		//获取当前绑定的会议室
		let bindMeeting = localStorage.getItem("bindMeeting")
		if(utils.isnull(bindMeeting)){
			//弹出绑定会议室框
			tip.info_autoClose("请先绑定会议室!",function(){})
			showBindMeetingRoom()
		}else{
			let bindMeetingName = localStorage.getItem("bindMeetingName")
			let text = $(this).find("span").text()
			let send = {}
			send["remark"] = "<div class=\"normal\">会议室：" + bindMeetingName + "</div><div class=\"normal\">会议需求："+text+"</div>"
			send["roomId"] = bindMeeting
			$(this).closest(".service-pop").hide("slow", "swing");
			utils.ajax("/prod-api/dev/meeting/sendMsg","post",send).then(function(res){
				if(res.code == 200){
					tip.info_autoClose("呼叫成功!",function(){})
				}else{
					tip.info_autoClose("呼叫失败!",function(){})
				}
			})
		}
	})
	
	//会议延时	
	$("html").on("click",".meeting",function(){
		let bindMeeting = localStorage.getItem("bindMeeting")
		if(utils.isnull(bindMeeting)){
			//弹出绑定会议室框
			tip.info_autoClose("请先绑定会议室!",function(){})
			showBindMeetingRoom()
		}else{
			$(this).closest(".meeting-pop").hide("slow", "swing");
	
			let bindMeetingName = localStorage.getItem("bindMeetingName")
			let text = $(this).find("span").text()
			let url = "/prod-api/dev/meeting/addMeetingTime"
			let send = {}
			send["roomId"] = bindMeeting
			if(text.includes("延长")){
				text = text.replace("延长","").replace("分钟","")
				send["addTime"] = text
			}
			if(text == "提前结束"){
				url = "/prod-api/dev/meeting/finishMeeting"
			}
			
			$(this).closest(".meeting-pop").hide("slow", "swing");
			utils.ajax(url,"post",send).then(function(res){
				if(res.code == 200){
					tip.info_autoClose("会议延时成功!",function(){})
				}else{
					tip.info_autoClose("会议延时失败!",function(){})
				}
			})
		}
	})
	
	
	let timer;
	let meetingRooms = {};
	// 绑定鼠标按下和触摸开始事件
	$("[pop]").on("touchstart", function() {
		timer = setTimeout(function() {
			showBindMeetingRoom()
		}, 3000); // 设置长按时间为 1 秒
	});
	
	// 绑定鼠标松开和触摸结束事件
	$("[pop]").on("touchend", function() {
		clearTimeout(timer); // 如果未达到长按时间，清除定时器
	});
	
	function showBindMeetingRoom(){
		//弹出会议绑定
		$("#bindMeeting-pop").show();
		//获取meetingrooms
		utils.ajax("/prod-api/dev/meeting/meetingRooms","get",).then(function(res){
			$.each(res.data,function(idx,itm){
				if(utils.isnull(meetingRooms[itm.location])){
					var list = [];
					list.push(itm)
					meetingRooms[itm.location] = list;
					
					$("#park").append("<option value='"+itm.location+"'>"+itm.location+"</option>")
				}else{
					meetingRooms[itm.location].push(itm)
				}
				// console.log(itm)
			});
		})
	}
	
	$("html").on("change","#park",function(){
		var key = $(this).val()
		$("#meetingRooms").html("<option>请选择会议室</option>");
		if(key != "请选择园区"){
			$("#meetingRooms").html("")
			var vl = meetingRooms[key]
			$.each(vl,function(idx,itm){
				$("#meetingRooms").append("<option value='"+itm.roomId+"'>"+itm.roomName+"</option>")
			});
		}
	})
	
	$("html").on("click","#bingMeetingRoom",function(){
		if($("#meetingRooms").val() != "请选择会议室"){
			localStorage.setItem("bindMeeting",$("#meetingRooms").val())
			localStorage.setItem("bindMeetingName",$("#meetingRooms option:selected").text())
			$(this).closest(".bindMeeting-pop").hide("slow", "swing");
			tip.info_autoClose("绑定成功!",function(){})
		}
	})
	
	//初始化
	$("html").on("click",".floor-init",function(){
		try {
			let f = (Number)($(this).attr("floor"))
			let num = (Number)($(this).attr("num"))
			let child = {}
			for (var i = 1; i <= num; i++) {
				child[250000 + f * 1000 + i] = 70
			}
			let id = 101000 + f * 10000
			let json = {}
			json[id] = 70
			json["999999999"] = "true"
			json["child"] = child
			console.log(json)
			window.android.sendMqtt(JSON.stringify(json));
		} catch (e) {}
	})
	
	//冷光
	$("html").on("click",".floor-cw1",function(){
		try {
			let f = (Number)($(this).attr("floor"))
			let num = (Number)($(this).attr("num"))
			let child = {}
			for (var i = 1; i <= num; i++) {
				child[350000 + f * 1000 + i] = -1
			}
			let id = 102000 + f * 10000
			let json = {}
			json[id] = -1
			json["888888888"] = "true"
			json["child"] = child
			console.log(json)
			window.android.sendMqtt(JSON.stringify(json));
		} catch (e) {}
	})
	
	//暖光
	$("html").on("click",".floor-cw2",function(){
		try {
			let f = (Number)($(this).attr("floor"))
			let num = (Number)($(this).attr("num"))
			let child = {}
			for (var i = 1; i <= num; i++) {
				child[350000 + f * 1000 + i] = -1
			}
			let id = 102000 + f * 10000
			let json = {}
			json[id] = -1
			json["666666666"] = "true"
			json["child"] = child
			console.log(json)
			window.android.sendMqtt(JSON.stringify(json));
		} catch (e) {}
	})
	
	//休息模式
	$("html").on("click",".floor-mode1",function(){
		try {
			let f = (Number)($(this).attr("floor"))
			let num = (Number)($(this).attr("num"))
			let child = {}
			for (var i = 1; i <= num; i++) {
				child[250000 + f * 1000 + i] = 0
			}
			let id = 101000 + f * 10000
			let json = {}
			json[id] = 0
			json["777777777"] = "true"
			json["child"] = child
			console.log(json)
			window.android.sendMqtt(JSON.stringify(json));
		} catch (e) {}
	})
	
	//正常模式
	$("html").on("click",".floor-mode2",function(){
		try {
			let f = (Number)($(this).attr("floor"))
			let num = (Number)($(this).attr("num"))
			let child = {}
			for (var i = 1; i <= num; i++) {
				child[250000 + f * 1000 + i] = 70
			}
			let id = 101000 + f * 10000
			let json = {}
			json[id] = 70
			json["555555555"] = "true"
			json["child"] = child
			console.log(json)
			window.android.sendMqtt(JSON.stringify(json));
		} catch (e) {}
	})
	
	//自锁
	$("html").find("[self-lock]").on("click", function (event) {
	    try {
	        let control = $(this).attr("control");
	        let json = {};
			let img = $(this).find(".module-box-icon").find("img")
			let swimg = $(this).find(".module-box-adjust-switch").find("img")
			
			let spnum = $(this).find(".module-box-adjust-change span").html()
			let brigh = null;
			let wd = null;
			let fs = null;
			
			let child_ = null
			
			if(!utils.isnull(spnum)){
				//灯光换算
				if(spnum.includes("%")){
					brigh = (Number)($(this).find(".module-box-adjust-change span").html().replace("%",""))
				}
				//空调换算
				if(spnum.includes("℃")){
					wd = (Number)($(this).find(".module-box-adjust-change span").html().replace("℃",""))
				}
				//空调换算
				if(spnum.includes("速")){
					fs = $(this).find(".module-box-adjust-change span").html()
					if(fs == "低速"){
						fs = 4
					}
					if(fs == "中速"){
						fs = 5
					}
					if(fs == "高速"){
						fs = 6
					}
				}
			}

			let status = event.status
			if(status != null){
				if(status){
					$(this).addClass("self-lock-active");
					let oldsrc = img.attr("src");
					if(!oldsrc.includes("-on.png")){
						img.attr("src", oldsrc.replace(".png", "-on.png"));
						swimg.attr("src", "img/Switch-on.png");
					}
					json[control] = "true";
					child_ = "true"
				}else{
					$(this).removeClass("self-lock-active");
					let oldsrc = img.attr("src");
					if(oldsrc.includes("-on.png")){
						img.attr("src", oldsrc.replace("-on.png", ".png"));
						swimg.attr("src", "img/Switch-off.png");
					}
					json[control] = "false";
					child_ = "false"
				}
			}else{
				if(event.originalEvent.isPattern != null){
					//模式按钮
					if(event.originalEvent.isPattern == "true"){
						//按下
						$(this).addClass("self-lock-active");
						let oldsrc = img.attr("src");
						if(!oldsrc.includes("-on.png")){
							img.attr("src", oldsrc.replace(".png", "-on.png"));
						}
						swimg.attr("src", "img/Switch-on.png");
						let span = $(this).find(".module-box-adjust-change span").html()
						
						if(span.includes("%") && span == "0%"){
							$(this).find(".module-box-adjust-change span").html("70%")
							brigh = 70
						}
						json[control] = "true";
						child_ = "true"
					}else{
						$(this).removeClass("self-lock-active");
						let oldsrc = img.attr("src");
						if(oldsrc.includes("-on.png")){
							img.attr("src", oldsrc.replace("-on.png", ".png"));
						}
						swimg.attr("src", "img/Switch-off.png");
						let span = $(this).find(".module-box-adjust-change span").html()
						
						if(span.includes("%")){
							$(this).find(".module-box-adjust-change span").html("0%")
							brigh = 0
						}
						json[control] = "false";
						child_ = "false"
					}
				}else{
					if ($(this).hasClass("self-lock-active")) {
					    $(this).removeClass("self-lock-active");
					    let oldsrc = img.attr("src");
					    img.attr("src", oldsrc.replace("-on.png", ".png"));
					    swimg.attr("src", "img/Switch-off.png");
						let span = $(this).find(".module-box-adjust-change span").html()
						
						if(!utils.isnull(span) && span.includes("%") && event.originalEvent.isTrusted){
							$(this).find(".module-box-adjust-change span").html("0%")
							brigh = 0
						}
					    json[control] = "false";
						child_ = "false"
					} else {
					    $(this).addClass("self-lock-active");
					    let oldsrc = img.attr("src");
					    img.attr("src", oldsrc.replace(".png", "-on.png"));
					    swimg.attr("src", "img/Switch-on.png");
						let span = $(this).find(".module-box-adjust-change span").html()
						if(!utils.isnull(span) && span.includes("%") && event.originalEvent.isTrusted){
							$(this).find(".module-box-adjust-change span").html("70%")
							brigh = 70
						}
					    json[control] = "true";
						child_ = "true"
					}
				}
			}
			relevance(this)
			if(event.originalEvent.isTrusted || event.originalEvent.isPattern != null){
				if(brigh != null){
					child_ = brigh
				}
				let childjson = {}
				let child = $(this).attr("child");
				let childs = []
				if (!utils.isnull(child)) {
					childs =  getChilds(child)
				}
				for (let key in childs) {
					childjson[childs[key]] = child_
				}
				json["child"] = childjson;
				setData(JSON.stringify(json));
				
				if (typeof $(this).attr("isAll") !== 'undefined') {
					json["999999999"] = json[control]
					for (let key in childs) {
						let ck = Number(childs[key]) + 1000
						if($("[control="+ck+"]").length > 0){
							$("[control="+ck+"]").val("70")
							$("[control="+ck+"]")[0].dispatchEvent(new Event('input'));
						}
					}
				}
				
				if(!utils.isnull(control) && (event.active == null || event.active == false)){
					console.log(json);
					window.android.sendMqtt(JSON.stringify(json));
				}
				
				if(status != null && !utils.isnull(wd)){
					//点击了温度+-
					//发送温度+-
					let json_wd = {};
					let childjson_wd = {}

					if((Number)(control) > 700000000 && (Number)(control) < 799999999){
						control = control.substring(0,3) + ((Number)(control.substring(3,4)) + 3) + control.substring(4,9)
					}else{
						control = control.substring(0,3) + ((Number)(control.substring(3,4)) + 3) + control.substring(4,7)
					}
					
					json_wd[control] = wd;
					for (let key in childs) {
						let str = childs[key].toString()
						
						if((Number)(control) > 700000000 && (Number)(control) < 799999999){
							let cid = str.substring(0,3) + ((Number)(str.substring(3,4)) + 3) + str.substring(4,9)
							childjson_wd[cid] = wd
						}else{
							let cid = str.substring(0,3) + ((Number)(str.substring(3,4)) + 3) + str.substring(4,7)
							childjson_wd[cid] = wd
						}

					}
					json_wd["child"] = childjson_wd;
					if(!utils.isnull(control)){
						console.log(json_wd);
						window.android.sendMqtt(JSON.stringify(json_wd));
					}
				}
				
				if(status != null && !utils.isnull(fs)){
					//点击了风速+-
					let json_fs = {};
					let childjson_fs = {}
					control = control.substring(0,3) + ((Number)(control.substring(3,4)) + 2) + control.substring(4,7)
					json_fs[control] = fs;
					for (let key in childs) {
						let str = childs[key].toString()
						let cid = str.substring(0,3) + ((Number)(str.substring(3,4)) + 2) + fs + str.substring(5,7)
						childjson_fs[cid] = fs
					}
					json_fs["child"] = childjson_fs;
					if(!utils.isnull(control)){
						console.log(json_fs);
						window.android.sendMqtt(JSON.stringify(json_fs));
					}
				}
				
			}
			
	    } catch (e) {}
	});
	
	$("#hvac-change-pop").find("[inter-lock]").on("click", function (event) {
		$.each($("#hvac-change-pop .pop-cont-box"),function(idx,itm){
			if($(itm).hasClass("inter-lock-active-hvacmode")){
				let control = $(this).attr("control")
				let index = control.substring(5,7)
				if((Number)(control) > 700000000 && (Number)(control) < 799999999){
					//多联机
					index = control.substring(5,9)
				}
				control = (Number)(control.substring(0,3) + "00") + index;
				let hm = $("[control=" + control + "]").find(".hvac-mode")
				hm.find("span").html($(this).find("span").html())
				hm.find("img").attr("src",$(this).find(".pop-cont-box-icon img").attr("src"))
			}
			if($(itm).hasClass("inter-lock-active-hvacspeed")){
				let control = $(this).attr("control")
				let index = control.substring(5,7)
				if((Number)(control) > 700000000 && (Number)(control) < 799999999){
					//多联机
					index = control.substring(5,9)
				}
				control = (Number)(control.substring(0,3) + "00") + index;
				let hs = $("[control=" + control + "]").find(".hvac-speed")
				hs.find("span").html($(this).find("span").html())
				hs.find("img").attr("src",$(this).find(".pop-cont-box-icon img").attr("src"))
			}
		})
	})
	
	$("#hvac-all-change-pop").find("[inter-lock]").on("click", function (event) {
		//计算所有
		$.each($("#hvac-all-change-pop .pop-cont-box"),function(idx,itm){
			if($(itm).hasClass("inter-lock-active-hvacallmode")){
				let control = $(this).attr("control")
				let index = control.substring(5,7)
				if((Number)(control) > 700000000 && (Number)(control) < 799999999){
					//多联机
					index = control.substring(5,9)
				}
				control = (Number)(control.substring(0,3) + "60") + index;
				let hm = $("[control=" + control + "]").find(".hvac-mode")
				hm.find("span").html($(this).find("span").html())
				hm.find("img").attr("src",$(this).find(".pop-cont-box-icon img").attr("src"))
				let childs = $(this).attr("child")
				if(!utils.isnull(childs)){
					let child_arr = childs.split(",")
					for (let key in child_arr) {
						let child = child_arr[key]
						index = child.substring(5,7)
						if((Number)(child) > 700000000 && (Number)(child) < 799999999){
							//多联机
							index = child.substring(5,9)
						}
						child = (Number)(child.substring(0,3) + "00") + index;
						hm = $("[control=" + child + "]").find(".hvac-mode")
						hm.find("span").html($(this).find("span").html())
						hm.find("img").attr("src",$(this).find(".pop-cont-box-icon img").attr("src"))
					}
				}
			}
			if($(itm).hasClass("inter-lock-active-hvacallspeed")){
				let control = $(this).attr("control")
				let index = control.substring(5,7)
				if((Number)(control) > 700000000 && (Number)(control) < 799999999){
					//多联机
					index = control.substring(5,9)
				}
				control = (Number)(control.substring(0,3) + "60") + index;
				let hs = $("[control=" + control + "]").find(".hvac-speed")
				hs.find("span").html($(this).find("span").html())
				hs.find("img").attr("src",$(this).find(".pop-cont-box-icon img").attr("src"))
				let childs = $(this).attr("child")
				if(!utils.isnull(childs)){
					let child_arr = childs.split(",")
					for (let key in child_arr) {
						let child = child_arr[key]
						index = child.substring(5,7)
						if((Number)(child) > 700000000 && (Number)(child) < 799999999){
							//多联机
							index = child.substring(5,9)
						}
						child = (Number)(child.substring(0,3) + "00") + index;
						hm = $("[control=" + child + "]").find(".hvac-speed")
						hm.find("span").html($(this).find("span").html())
						hm.find("img").attr("src",$(this).find(".pop-cont-box-icon img").attr("src"))
					}
				}
			}
		})
	})

	//互锁
	$("html").find("[inter-lock]").on("click", function (event) {
	    event.stopPropagation();
	    let key = $(this).attr("inter-lock");
		let ts = $(this);
	    $("html").find("[inter-lock='" + key + "']").removeClass("inter-lock-active");
	    $("html").find("[inter-lock='" + key + "']").removeClass("inter-lock-active-" + key);
	    $(this).addClass("inter-lock-active");
	    $(this).addClass("inter-lock-active-" + key);

	    $("html").find("[inter-lock='" + key + "']").find(".module-switch img").attr("src", "img/Switch-off.png");
	    $(this).find(".module-switch img").attr("src", "img/Switch-on.png");
		
		$("html").find("[inter-lock='" + key + "']").find(".pop-cont-box-switch img").attr("src", "img/Switch-off.png");
		$(this).find(".pop-cont-box-switch img").attr("src", "img/Switch-on.png");
		
	    if(event.originalEvent.isTrusted){
	        try {
	            let childon = $(this).attr("childon");
	            let childoff = $(this).attr("childoff");
	            let control = $(this).attr("control");
				let child = $(this).attr("child");
	            // let list = [];
	            let childjson = {};
	            let json = {};
	            // let def = "true";
	            // let child = childon;
	            // if (!utils.isnull(childoff)) {
	            //     child = childoff;
	            //     def = "false";
	            // }
				if (!utils.isnull(child)) {
					$.each($("[inter-lock=" + key+ "]"), function (idx, itm) {
						let list = getChilds($(itm).attr("child"))
						$.each(list, function (idx2, itm2) {
							if(ts[0] == $(itm)[0]){
								childjson[itm2] = "true";
							}else{
								childjson[itm2] = "false";
							}
						});
						
					})
				}
	            if (!utils.isnull(childon)) {
	                let list = getChilds(childon)
					$.each(list, function (idx, itm) {
					    let il = $("[control=" + itm + "]").attr("inter-lock");
					    $.each($("[inter-lock=" + il + "]"), function (idx2, itm2) {
					        childjson[$(itm2).attr("control")] = "false";
					        if ($(itm2).attr("control") == itm) {
					            childjson[itm] = "true";
					        }
					    });
					    if ($("[control=" + itm + "]").length > 0 && $("[control=" + itm + "]")[0].hasAttribute("self-lock")) {
					        let def = "true";
							childjson[itm] = def;
							var ck = new Event('click')
							Object.defineProperty(ck, 'isPattern', { value: def });
							$("[control=" + itm + "]")[0].dispatchEvent(ck);
					    }
					});
	            }
				
				if (!utils.isnull(childoff)) {
				    let list = getChilds(childoff)
					$.each(list, function (idx, itm) {
					    let il = $("[control=" + itm + "]").attr("inter-lock");
					    $.each($("[inter-lock=" + il + "]"), function (idx2, itm2) {
					        childjson[$(itm2).attr("control")] = "false";
					        if ($(itm2).attr("control") == itm) {
					            childjson[itm] = "true";
					        }
					    });
					    if ($("[control=" + itm + "]").length > 0 && $("[control=" + itm + "]")[0].hasAttribute("self-lock")) {
					        let def = "false";
							childjson[itm] = def;
							var ck = new Event('click')
							Object.defineProperty(ck, 'isPattern', { value: def });
							$("[control=" + itm + "]")[0].dispatchEvent(ck);
					    }
					});
				}
				
	            $.each($("[inter-lock=" + key + "]"), function (idx, itm) {
	                json[$(itm).attr("control")] = "false";
	            });
	            json[control] = "true";
				
	            json["child"] = childjson;
	            console.log(json);
	            setData(JSON.stringify(json));
	            window.android.sendMqtt(JSON.stringify(json));
	        } catch (e) {}
	    }
	});
	
	$("#video-in, #video-out").on("change", function () {
		let videoout = $("#video-out").val();
		let videoin = $("#video-in").val();
		let json = {};
		if (videoout == 0) {
			let arr = Array.from("1All.", char => char.charCodeAt(0));
			arr[0] = Number(videoin);
			json["10001"] = arr;
		} else {
			let arr = Array.from("1B1.", char => char.charCodeAt(0));
			arr[0] = Number(videoin);
			arr[2] = Number(videoout);
			json["10001"] = arr;
		}
		try {
			window.android.sendMqtt(JSON.stringify(json));
		} catch (e) {}
	});
	
	input = function ($input,event) {
		let span = $($input).prev().prev()
		let split = span.text().split("：")
		span.html(split[0] + "：" + $($input).val() + "%")
		
		let img = $($input).parents(".module-control").find(".module-box-icon").find("img")
		let oldsrc = img.attr("src");
		if($($input).val() != 0){
			if(!oldsrc.includes("-on.png")){
				img.attr("src", oldsrc.replace(".png", "-on.png"));
			}
		}else{
			if(oldsrc.includes("-on.png")){
				img.attr("src", oldsrc.replace("-on.png", ".png"));
			}
		}
		if(event.originalEvent.isTrusted){
			try {
			    let id = $($input).attr("control");
			    let json = {};
			    json[id] = Number($input.value);
			    let child = $($input).attr("child");
			    let childjson = {};
			    if (!utils.isnull(child)) {
			        let childs = getChilds(child)
					for (let key in childs) {
						childjson[childs[key]] = json[id]
					}
			    }
			    json["child"] = childjson;
			    console.log(json);
			    setData(JSON.stringify(json));
			    window.android.sendMqtt(JSON.stringify(json));
			} catch (e) {}
		}
		
		
	};
	
	//判断灯光单独激活，调整模式
	change = function ($input) {
		let control = $($input).attr("control")
		let val = $($input).val()
		$.each($("div[child]"),function(idx,itm){
			let child = $(itm).attr("child")
			let list = getChilds(child)
			let pcontrol = $(itm).attr("control")
			if(list.includes(control) || list.includes((Number)(control))){
				let b = false
				$.each(list,function(idx,itm){
					if($("[control="+itm+"]").val() > 0){
						b = true
					}
					if($("[control="+itm+"]").val() > val){
						val = $("[control="+itm+"]").val()
					}
				})
				let img = $(itm).find(".module-box-icon").find("img")
				let swimg = $(itm).find(".module-box-adjust-switch").find("img")
				let json = {}
				json["child"] = {}
				if(b){
					$(itm).addClass("self-lock-active");
					let oldsrc = img.attr("src");
					if(!oldsrc.includes("-on.png")){
						img.attr("src", oldsrc.replace(".png", "-on.png"));
					}
					swimg.attr("src", "img/Switch-on.png");
					
					$(itm).find(".module-box-adjust-change span").html(val+"%")
					json[pcontrol] = "true";
				}else{
					$(itm).removeClass("self-lock-active");
					let oldsrc = img.attr("src");
					if(oldsrc.includes("-on.png")){
						img.attr("src", oldsrc.replace("-on.png", ".png"));
					}
					swimg.attr("src", "img/Switch-off.png");
					$(itm).find(".module-box-adjust-change span").html("0%")
					json[pcontrol] = "false";
				}
			}
		})

	};
	
	
	relevance = function ($input) {
		let control = $($input).attr("control")
		$.each($("div[child]"),function(idx,itm){
			let child = $(itm).attr("child")
			let list = getChilds(child)
			let pcontrol = $(itm).attr("control")
			if(list.includes(control) || list.includes((Number)(control))){
				let b = false
				$.each(list,function(idx,itm){
					if($("[control="+itm+"]").hasClass("self-lock-active")){
						b = true
					}
				})
				let img = $(itm).find(".module-box-icon").find("img")
				let swimg = $(itm).find(".module-box-adjust-switch").find("img")
				let json = {}
				json["child"] = {}
				if(b){
					$(itm).addClass("self-lock-active");
					let oldsrc = img.attr("src");
					if(!oldsrc.includes("-on.png")){
						img.attr("src", oldsrc.replace(".png", "-on.png"));
					}
					swimg.attr("src", "img/Switch-on.png");
					json[pcontrol] = "true";
				}else{
					$(itm).removeClass("self-lock-active");
					let oldsrc = img.attr("src");
					if(oldsrc.includes("-on.png")){
						img.attr("src", oldsrc.replace("-on.png", ".png"));
					}
					swimg.attr("src", "img/Switch-off.png");
					json[pcontrol] = "false";
				}
			}
		})
	
	};
	
	
	function getChilds(child){
		let childs = [];
		let arr = child.split(",");
		for (let j = 0; j < arr.length; j++) {
			let itm = arr[j];
			if (itm.indexOf("-") != -1) {
				let arrr = itm.split("-");
				for (let i = Number(arrr[0]); i <= Number(arrr[1]); i++) {
					childs.push(i)
				}
			} else if (itm.indexOf(":") != -1) {
				let arrr = itm.split(":");
				for (let i = Number(arrr[0]); i <= Number(arrr[1]); i += 2) {
					childs.push(i)
				}
			} else {
				childs.push(itm)
			}
		}
		return childs;
	}
	
	//emn推动条
	$.each($(".emn"),function(idx,itm){
		$(itm).RangeSlider({min: 0, max: 100, step: 1, callback: input, callback2: change});
		itm.dispatchEvent(new Event('input'));
	})

	init();
	function init() {
	    try {
	        window.android.sync("");
			setTimeout(function(){
				// 空调弹出数据
				$.each($("[pop]"), function (idx, itm) {
					//同步空调弹出
					$(itm)[0].dispatchEvent(new Event('click'));
				})
			},1000)
	    } catch (e) {}
	}
})