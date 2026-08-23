// 组件库
var element = {
	//非凡士灯光
	addEmn :function(data){
		if(data["type"] == 1){
			let html = '<div class="module-box">'+
							'<div control="' + data["control"] + '" child="'+ data["child"] + '" class="module-control" self-lock>'+
								'<div class="module-box-title">'+data["name"]+'</div>'+
								'<div class="module-box-icon flex-center">'+
									'<img src="img/灯.png"/>'+
								'</div>'+
								'<div class="module-box-adjust flex-center">'+
									'<div class="module-box-adjust-change flex-center">'+
										'<svg t="1768361448809" class="icon b_effect down" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9162" width="72" height="72"><path d="M161.1 511.2l373.6-373.6c26.4-26.4 61-39.5 95.6-39.5 34.6 0 69.2 13.2 95.6 39.5 52.7 52.7 52.7 138.5 0 191.2L400.4 654.3c-10.3 10.3-27 10.3-37.3 0-10.3-10.3-10.3-27 0-37.3l325.4-325.4c32.2-32.2 32.2-84.5 0-116.6-32.2-32.2-84.5-32.2-116.6 0L198.4 548.5M630.3 98.1" fill="#2197EF" p-id="9163"></path><path d="M371 375.9l341.2 341.2c42.5 42.5 42.5 111.4 0 153.9s-111.4 42.5-153.9 0L217 529.9" fill="#CEE8FA" p-id="9164"></path><path d="M198.4 548.5l336.3 336.3c25.5 25.5 59.5 39.6 95.6 39.6 36.1 0 70.1-14.1 95.6-39.6 52.7-52.7 52.7-138.5 0-191.2L389.6 357.3m-74.6 0l17.4 17.4 19.8 19.8 336.3 336.3c32.2 32.2 32.2 84.5 0 116.6-15.6 15.6-36.3 24.2-58.3 24.2s-42.7-8.6-58.3-24.2L235.7 511.2l-20.5-20.5-16.7-16.7" fill="#2197EF" p-id="9165"></path></svg>'+
										'<span control="'+ data["data"] +'">70%</span>'+
										'<svg t="1768361427880" class="icon b_effect up" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8174" width="72" height="72"><path d="M836.8 551.2L462 176.4c-32.3-32.3-84.8-32.3-117 0-32.3 32.3-32.3 84.8 0 117L671.5 620c10.3 10.3 10.3 27.1 0 37.4-10.3 10.3-27.1 10.3-37.4 0L307.6 330.8c-52.9-52.9-52.9-139 0-191.8 26.4-26.4 61.2-39.7 95.9-39.7s69.5 13.2 95.9 39.7l374.8 374.8M403.5 99.3" fill="#2197EF" p-id="8175"></path><path d="M818.1 532.5L475.8 874.9c-42.6 42.6-111.8 42.6-154.4 0-42.7-42.6-42.7-111.8 0-154.4l342.4-342.4" fill="#CEE8FA" p-id="8176"></path><path d="M645 359.4L307.6 696.8c-52.9 52.9-52.9 139 0 191.8 25.6 25.6 59.7 39.7 95.9 39.7s70.3-14.1 95.9-39.7l337.4-337.4m0-74.8L820 493.2l-20.6 20.6L462 851.2c-15.6 15.6-36.4 24.2-58.5 24.2s-42.9-8.6-58.5-24.2c-32.3-32.3-32.3-84.8 0-117l337.4-337.4 19.9-19.9 17.5-17.5" fill="#2197EF" p-id="8177"></path></svg>'+
									'</div>'+
									'<div class="module-box-adjust-switch">'+
										'<img src="img/Switch-off.png"/>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
			data["box"].before(html)
		}
		
		if(data["type"] == 2){
			let hide = ""
			if(data["isHide"]){
				hide = "hidden"
			}
			let html = '<div class="module-box">'+
							'<div class="module-control">'+
								'<div class="module-box-title">'+data["name"]+'</div>'+
								'<div class="module-box-icon flex-center module-box-icon2">'+
									'<img src="img/灯.png"/>'+
								'</div>'+
								'<div class="module-box-adjust">'+
									'<div class="module-sliders">'+
										'<div class="color '+hide+'">'+
											'<span>色温：100%</span><br/>'+
											'<input control="'+data["cw_control"]+'" child="'+data["cw_child"]+'" class="emn" type="range" value="0">'+
										'</div>'+
										'<div class="brigh">'+
											'<span>亮度：100%</span><br/>'+
											'<input control="'+data["ld_control"]+'" child="'+data["ld_child"]+'" class="emn" type="range" value="0">'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
			data["box"].before(html)
		}
		// 带开关的 拖动
		if(data["type"] == 3){
			let hide = ""
			if(data["isHide"]){
				hide = "hidden"
			}
			let html = '<div class="module-box">'+
							'<div class="module-control">'+
								'<div class="module-box-title">'+data["name"]+'</div>'+
								'<div class="module-box-icon flex-center module-box-icon2">'+
									'<img src="img/灯.png"/>'+
								'</div>'+
								'<div class="module-box-adjust">'+
									'<div class="module-sliders">'+
										'<div class="color '+hide+'">'+
											'<span>色温：100%</span><br/>'+
											'<input control="'+data["cw_control"]+'" child="'+data["cw_child"]+'" class="emn" type="range" value="0">'+
										'</div>'+
										'<div class="brigh">'+
											'<span>亮度：100%</span><br/>'+
											'<input control="'+data["ld_control"]+'" child="'+data["ld_child"]+'" class="emn" type="range" value="0">'+
										'</div>'+
									'</div>'+
									'<div class="module-box-adjust-switch">'+
										'<img src="img/Switch-off.png"/>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
			data["box"].before(html)
		}
	},
	
	//空调
	addHvac :function(data){
		if(data["type"] == 1){
			let html = '<div class="module-box">'+
							'<div control="' + data["control"] + '" child="'+ data["child"] + '" class="module-control" self-lock>'+
								'<div class="module-box-title">'+data["name"]+'</div>'+
								'<div class="module-box-icon flex-center">'+
									'<img src="img/灯.png"/>'+
								'</div>'+
								'<div class="module-box-adjust flex-center">'+
									'<div class="module-box-adjust-change flex-center">'+
										'<svg t="1768361448809" class="icon b_effect down" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9162" width="72" height="72"><path d="M161.1 511.2l373.6-373.6c26.4-26.4 61-39.5 95.6-39.5 34.6 0 69.2 13.2 95.6 39.5 52.7 52.7 52.7 138.5 0 191.2L400.4 654.3c-10.3 10.3-27 10.3-37.3 0-10.3-10.3-10.3-27 0-37.3l325.4-325.4c32.2-32.2 32.2-84.5 0-116.6-32.2-32.2-84.5-32.2-116.6 0L198.4 548.5M630.3 98.1" fill="#2197EF" p-id="9163"></path><path d="M371 375.9l341.2 341.2c42.5 42.5 42.5 111.4 0 153.9s-111.4 42.5-153.9 0L217 529.9" fill="#CEE8FA" p-id="9164"></path><path d="M198.4 548.5l336.3 336.3c25.5 25.5 59.5 39.6 95.6 39.6 36.1 0 70.1-14.1 95.6-39.6 52.7-52.7 52.7-138.5 0-191.2L389.6 357.3m-74.6 0l17.4 17.4 19.8 19.8 336.3 336.3c32.2 32.2 32.2 84.5 0 116.6-15.6 15.6-36.3 24.2-58.3 24.2s-42.7-8.6-58.3-24.2L235.7 511.2l-20.5-20.5-16.7-16.7" fill="#2197EF" p-id="9165"></path></svg>'+
										'<span control="'+ data["data"] +'">70%</span>'+
										'<svg t="1768361427880" class="icon b_effect up" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8174" width="72" height="72"><path d="M836.8 551.2L462 176.4c-32.3-32.3-84.8-32.3-117 0-32.3 32.3-32.3 84.8 0 117L671.5 620c10.3 10.3 10.3 27.1 0 37.4-10.3 10.3-27.1 10.3-37.4 0L307.6 330.8c-52.9-52.9-52.9-139 0-191.8 26.4-26.4 61.2-39.7 95.9-39.7s69.5 13.2 95.9 39.7l374.8 374.8M403.5 99.3" fill="#2197EF" p-id="8175"></path><path d="M818.1 532.5L475.8 874.9c-42.6 42.6-111.8 42.6-154.4 0-42.7-42.6-42.7-111.8 0-154.4l342.4-342.4" fill="#CEE8FA" p-id="8176"></path><path d="M645 359.4L307.6 696.8c-52.9 52.9-52.9 139 0 191.8 25.6 25.6 59.7 39.7 95.9 39.7s70.3-14.1 95.9-39.7l337.4-337.4m0-74.8L820 493.2l-20.6 20.6L462 851.2c-15.6 15.6-36.4 24.2-58.5 24.2s-42.9-8.6-58.5-24.2c-32.3-32.3-32.3-84.8 0-117l337.4-337.4 19.9-19.9 17.5-17.5" fill="#2197EF" p-id="8177"></path></svg>'+
									'</div>'+
									'<div class="module-box-adjust-switch">'+
										'<img src="img/Switch-off.png"/>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
			data["box"].before(html)
		}
		
		if(data["type"] == 2){
			let html = '<div class="module-box">'+
							'<div control="' + data["control"] + '" class="module-control" self-lock>'+
								'<div class="module-box-title">'+data["name"]+'</div>'+
								'<div class="module-box-icon flex-center module-box-icon3">'+
									'<img src="img/空调.png"/>'+
								'</div>'+
								'<div class="flex-center hvac-change" pop="hvac-change-pop">'+
									'<div class="hvac-mode flex-center">'+
										'<img src="img/制冷.png"/>'+
										'<span>制冷</span>'+
									'</div>'+
									'<img style="height: 80%;width: 1px" src="img/竖.png"/>'+
									'<div class="hvac-speed flex-center">'+
										'<img src="img/小风.png"/>'+
										'<span>低速</span>'+
									'</div>'+
								'</div>'+
								'<div class="module-box-adjust flex-center-end">'+
									'<div class="module-box-adjust-change flex-center">'+
										'<svg t="1768361448809" class="icon b_effect down" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9162" width="72" height="72"><path d="M161.1 511.2l373.6-373.6c26.4-26.4 61-39.5 95.6-39.5 34.6 0 69.2 13.2 95.6 39.5 52.7 52.7 52.7 138.5 0 191.2L400.4 654.3c-10.3 10.3-27 10.3-37.3 0-10.3-10.3-10.3-27 0-37.3l325.4-325.4c32.2-32.2 32.2-84.5 0-116.6-32.2-32.2-84.5-32.2-116.6 0L198.4 548.5M630.3 98.1" fill="#2197EF" p-id="9163"></path><path d="M371 375.9l341.2 341.2c42.5 42.5 42.5 111.4 0 153.9s-111.4 42.5-153.9 0L217 529.9" fill="#CEE8FA" p-id="9164"></path><path d="M198.4 548.5l336.3 336.3c25.5 25.5 59.5 39.6 95.6 39.6 36.1 0 70.1-14.1 95.6-39.6 52.7-52.7 52.7-138.5 0-191.2L389.6 357.3m-74.6 0l17.4 17.4 19.8 19.8 336.3 336.3c32.2 32.2 32.2 84.5 0 116.6-15.6 15.6-36.3 24.2-58.3 24.2s-42.7-8.6-58.3-24.2L235.7 511.2l-20.5-20.5-16.7-16.7" fill="#2197EF" p-id="9165"></path></svg>'+
										'<span control="'+data["data"]+'">22℃</span>'+
										'<svg t="1768361427880" class="icon b_effect up" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8174" width="72" height="72"><path d="M836.8 551.2L462 176.4c-32.3-32.3-84.8-32.3-117 0-32.3 32.3-32.3 84.8 0 117L671.5 620c10.3 10.3 10.3 27.1 0 37.4-10.3 10.3-27.1 10.3-37.4 0L307.6 330.8c-52.9-52.9-52.9-139 0-191.8 26.4-26.4 61.2-39.7 95.9-39.7s69.5 13.2 95.9 39.7l374.8 374.8M403.5 99.3" fill="#2197EF" p-id="8175"></path><path d="M818.1 532.5L475.8 874.9c-42.6 42.6-111.8 42.6-154.4 0-42.7-42.6-42.7-111.8 0-154.4l342.4-342.4" fill="#CEE8FA" p-id="8176"></path><path d="M645 359.4L307.6 696.8c-52.9 52.9-52.9 139 0 191.8 25.6 25.6 59.7 39.7 95.9 39.7s70.3-14.1 95.9-39.7l337.4-337.4m0-74.8L820 493.2l-20.6 20.6L462 851.2c-15.6 15.6-36.4 24.2-58.5 24.2s-42.9-8.6-58.5-24.2c-32.3-32.3-32.3-84.8 0-117l337.4-337.4 19.9-19.9 17.5-17.5" fill="#2197EF" p-id="8177"></path></svg>'+
									'</div>'+
									'<div class="module-box-adjust-switch">'+
										'<img src="img/Switch-off.png"/>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
			data["box"].before(html)
		}
	},
	
	addMeeting: function($box){
		let html = '<div class="pop meeting-pop" id="meeting-change-pop">'+
		    '<div class="close">'+
		        '<span>会议操作</span>'+
		        '<img src="img/close.png"/>'+
		    '</div>'+
		    '<div class="pop-cont">'+
				'<div class="meeting call-box flex-center">'+
					'<div class="call-box-cont">'+
						'<img src="img/茶水.png"/><br />'+
						'<span>延长15分钟</span>'+
					'</div>'+
				'</div>'+
				'<div class="meeting call-box flex-center">'+
					'<div class="call-box-cont">'+
						'<img src="img/清扫.png"/><br />'+
						'<span>延长30分钟</span>'+
					'</div>'+
				'</div>'+
				'<div class="meeting call-box flex-center">'+
					'<div class="call-box-cont">'+
						'<img src="img/会议调试.png"/><br />'+
						'<span>延长60分钟</span>'+
					'</div>'+
				'</div>'+
				'<div class="meeting call-box flex-center">'+
					'<div class="call-box-cont">'+
						'<img src="img/其他需求.png"/><br />'+
						'<span>提前结束</span>'+
					'</div>'+
				'</div>'+
		    '</div>'+
		'</div>'
		$box.append(html)
	},
	
	addMeeting_10: function($box){
		// <!-- 服务呼叫 -->
		let html = '<div class="meeting-pop" id="meeting-change-pop">'+
			'<div class="pop-form">'+
				'<div class="close">'+
				    '<span></span>'+
				    '<img src="img/closex.png"/>'+
				'</div>'+
				'<div class="meetings flex-center">'+
					'<div class="meeting">'+
						'<img src="img/茶水.png"/><br />'+
						'<span>延长30分钟</span>'+
					'</div>'+
					'<div class="meeting">'+
						'<img src="img/清扫.png"/><br />'+
						'<span>延长60分钟</span>'+
					'</div>'+
					'<div class="meeting">'+
						'<img src="img/会议调试.png"/><br />'+
						'<span>提前结束</span>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'
		
		$box.append(html)
	},
	
	addCall: function($box){
		let html = '<div class="pop service-pop" id="call-change-pop">'+
			'<div class="close">'+
				'<span>服务呼叫</span>'+
				'<img src="img/close.png"/>'+
			'</div>'+
			'<div class="pop-cont">'+
				'<div class="service call-box flex-center">'+
					'<div class="call-box-cont">'+
						'<img src="img/茶水.png"/><br />'+
						'<span>茶水咖啡</span>'+
					'</div>'+
				'</div>'+
				'<div class="service call-box flex-center">'+
					'<div class="call-box-cont">'+
						'<img src="img/清扫.png"/><br />'+
						'<span>清扫垃圾</span>'+
					'</div>'+
				'</div>'+
				'<div class="service call-box flex-center">'+
					'<div class="call-box-cont">'+
						'<img src="img/会议调试.png"/><br />'+
						'<span>会议调试</span>'+
					'</div>'+
				'</div>'+
				'<div class="service call-box flex-center">'+
					'<div class="call-box-cont">'+
						'<img src="img/其他需求.png"/><br />'+
						'<span>其他服务</span>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'
		
		$box.append(html)
	},
	
	addService: function($box){
		// <!-- 服务呼叫 -->
		let html = '<div class="service-pop" id="service-change-pop">'+
			'<div class="pop-form">'+
				'<div class="close">'+
				    '<span></span>'+
				    '<img src="img/closex.png"/>'+
				'</div>'+
				'<div class="services flex-center">'+
					'<div class="service">'+
						'<img src="img/茶水.png"/><br />'+
						'<span>茶水咖啡</span>'+
					'</div>'+
					'<div class="service">'+
						'<img src="img/清扫.png"/><br />'+
						'<span>清扫垃圾</span>'+
					'</div>'+
					// '<div class="service">'+
					// 	'<img src="img/会议调试.png"/><br />'+
					// 	'<span>会议调试</span>'+
					// '</div>'+
				'</div>'+
			'</div>'+
		'</div>'
		
		$box.append(html)
	},
	
	addBindMeeting: function($box){
		//绑定会议室
		let html = '<div class="pop bindMeeting-pop" id="bindMeeting-pop">'+
			'<div class="close">'+
				'<span>房间绑定</span>'+
				'<img src="img/close.png"/>'+
			'</div>'+
			'<div class="pop-cont">'+
				'<select id="park">'+
				'</select>'+
				'<select id="meetingRooms">'+
					'<option>请选择会议室</option>'+
				'</select>'+
			'</div>'+
			'<div id="bingMeetingRoom" class="flex-center">确定绑定</div>'+
		'</div>'
		
		$box.append(html)
	},
	
	addBottom :function($box){
		let html = '<div class="bottom">'+
			'<div class="flex-center switch-to-box">'+
				'<div class="switch-to switch-to-active flex-center"  href="scene">'+
					'<div class="switch-to-display">'+
						'<img src="img/场景@3x.png"/>'+
						'<br />'+
						'<span>场景</span>'+
					'</div>'+
				'</div>'
				if($(".light .module-box").length > 0){
					html += '<div class="switch-to flex-center" href="light">'+
						'<div class="switch-to-display">'+
							'<img src="img/灯.png" class="dg"/>'+
							'<br />'+
							'<span>灯光</span>'+
						'</div>'+
					'</div>'
				}
				
				html += '<div class="switch-to flex-center" href="hvac">'+
					'<div class="switch-to-display">'+
						'<img src="img/空调.png" class="kt"/>'+
						'<br />'+
						'<span>空调</span>'+
					'</div>'+
				'</div>'
				
				if($(".wind .module-box").length > 0){
					html += '<div class="switch-to flex-center" href="wind">'+
						'<div class="switch-to-display">'+
							'<img src="img/新风.png"/>'+
							'<br />'+
							'<span>新风</span>'+
						'</div>'+
					'</div>'
				}
				
			html +='</div></div>'
		
		$box.append(html)
		
		if($(".bottom").find(".switch-to").length == 3){
			$(".switch-to").css("margin-left","5%");
			$(".switch-to").css("margin-right","5%");
		}
	},
	addHvacPop :function($box){
		let html = '<div class="pop" id="hvac-change-pop">'+
		    '<div class="close">'+
		        '<span>空调模式-风速切换</span>'+
		        '<img src="img/close.png"/>'+
		    '</div>'+
		    '<div class="pop-cont">'+
				'<div class="pop-cont-box" inter-lock="hvacmode">'+
					'<span>制冷</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/制冷.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				'<div class="pop-cont-box" inter-lock="hvacmode">'+
					'<span>除湿</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/除湿.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				'<div class="pop-cont-box" inter-lock="hvacmode">'+
					'<span>送风</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/送风.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				'<div class="pop-cont-box" inter-lock="hvacmode">'+
					'<span>制热</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/制热.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				
				'<div class="pop-cont-box" inter-lock="hvacspeed">'+
					'<span>低速</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/小风.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				'<div class="pop-cont-box" inter-lock="hvacspeed">'+
					'<span>中速</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/中风.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				'<div class="pop-cont-box" inter-lock="hvacspeed">'+
					'<span>高速</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/大风.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
		    '</div>'+
		'</div>'+

		'<div class="pop" id="hvac-all-change-pop">'+
		    '<div class="close">'+
		        '<span>空调模式-风速切换</span>'+
		        '<img src="img/close.png"/>'+
		    '</div>'+
		    '<div class="pop-cont">'+
				'<div class="pop-cont-box" inter-lock="hvacallmode">'+
					'<span>制冷</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/制冷.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				'<div class="pop-cont-box" inter-lock="hvacallmode">'+
					'<span>除湿</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/除湿.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				'<div class="pop-cont-box" inter-lock="hvacallmode">'+
					'<span>送风</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/送风.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				'<div class="pop-cont-box" inter-lock="hvacallmode">'+
					'<span>制热</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/制热.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				
				'<div class="pop-cont-box" inter-lock="hvacallspeed">'+
					'<span>低速</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/小风.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				'<div class="pop-cont-box" inter-lock="hvacallspeed">'+
					'<span>中速</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/中风.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
				'<div class="pop-cont-box" inter-lock="hvacallspeed">'+
					'<span>高速</span>'+
					'<div class="pop-cont-box-icon flex-center">'+
						'<img src="img/大风.png"/>'+
					'</div>'+
					'<div class="pop-cont-box-switch">'+
						'<img src="img/Switch-off.png"/>'+
					'</div>'+
				'</div>'+
		    '</div>'+
		'</div>'
		
		$box.append(html)
	},
	
	addLink: function(data){
		let html = '<div class="module-box">'+
						'<div control="' + data["control"] + '" child="'+ data["child"] + '" class="module-control" self-lock>'+
							'<div class="module-box-title">'+data["name"]+'</div>'+
							'<div class="module-box-icon flex-center">'+
								'<img src="img/灯.png"/>'+
							'</div>'+
							'<div class="module-box-adjust flex-end-center">'+
								'<div class="module-box-adjust-switch">'+
									'<img src="img/Switch-off.png"/>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'
		data["box"].before(html)
	}
}