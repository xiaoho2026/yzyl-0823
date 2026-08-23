$.fn.RangeSlider = function(cfg){
	var userAgent = navigator.userAgent;
	var isWebkit = (userAgent.indexOf("AppleWebKit") >= 0);
	// var isIE = isIE();
	
	// function isIE() {
	// 	var isIE = false;
	// 	if (window.ActiveXObject || "ActiveXObject" in window) {
	// 		isIE = true;
	// 	} else {
	// 		isIE = (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1
	// 			&& !(userAgent.indexOf("Opera") > -1));
	// 		isIE = false;
	// 	}
	// 	return isIE;
	// }
	
	this.sliderCfg = {
		min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null, 
		max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
		step: cfg && Number(cfg.step) ? cfg.step : 1,
		callback: cfg && cfg.callback ? cfg.callback : null,
		callback2: cfg && cfg.callback2 ? cfg.callback2 : null
	};

	var $input = $(this);
	var min = this.sliderCfg.min;
	var max = this.sliderCfg.max;
	var step = this.sliderCfg.step;
	var callback = this.sliderCfg.callback;
	var callback2 = this.sliderCfg.callback2;

	$input.attr('min', min)
		.attr('max', max)
		.attr('step', step);

	// var event = null;
	// if (isIE) {
	// 	event = "change";
	// } else {
	// 	event = "input";
	// }
	
	//修改进度条
	$input.bind("input", function(e){
		$input.attr('value', this.value);
		var left = (this.value - min) / (max-min) * 100
		if (isWebkit) {
			$input.css( 'background', 'linear-gradient(60.5deg, rgba(255, 215, 185, 0.91), rgba(253, 199, 207, 1) ,white ' + left + '%, white)' );
			// $input.css( 'background', 'linear-gradient(to right, #059CFA, white ' + this.value + '%, white)' );
		}
		
		if ($.isFunction(callback)) {
			callback(this,e);
		}
	});
	
	//修改进度条
	$input.bind("change", function(e){
		$input.attr('value', this.value);
		if ($.isFunction(callback2)) {
			callback2(this);
		}
	});
};