var tip = {
	info_autoClose : function(msg,fun){
		let box = '<div class="tip-box">'+
					'<span>' + msg + '</span>'+
					'<p>3秒后自动关闭</p>'+
					'<div class="tip-close">'+
						'<img src="img/closex.png"/>'+
					'</div>'+
				'</div>'
		$("body").prepend(box);

		$(".tip-close").click(function (){
			$(".tip-box").remove();
		});
		
		let close = $(".tip-close")
		let p = $(".tip-box").find("p")
		setTimeout(function(){
			close.click()
		},3000)
		
		setInterval(function(){
			let text = p.text()
			let s = Number(text.split("秒")[0]) - 1
			p.html(s + "秒后自动关闭")
		},1000)
	},
	
	info_color_autoClose : function(msg,color,fun){
		let box = '<div class="tip-box">'+
					'<span>' + msg + '</span>'+
					'<p>3秒后自动关闭</p>'+
					'<div class="tip-close">'+
						'<img src="img/closex.png"/>'+
					'</div>'+
				'</div>'
		$("body").prepend(box);
	
		$(".tip-close").click(function (){
			$(".tip-box").remove();
		});
		
		let close = $(".tip-close")
		let p = $(".tip-box").find("p")
		let span = $(".tip-box").find("span")
		span.css("color",color)
		
		setTimeout(function(){
			close.click()
		},3000)
		
		setInterval(function(){
			let text = p.text()
			let s = Number(text.split("秒")[0]) - 1
			p.html(s + "秒后自动关闭")
		},1000)
	}
}