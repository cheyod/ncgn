var channels = {};
mui.plusReady(function() {
	// 获取支付通道  
	plus.payment.getChannels(function(channellist){
		for(var i in channellist){
			var channel = channellist[i];
			if(channel.id=='qhpay'||channel.id=='qihoo'){	// 过滤掉不支持的支付通道：暂不支持360相关支付
				continue;
			}
			this.channels[channel.id] = channel;
		}
	},function(e){  
		plus.nativeUI.alert("获取支付通道失败："+e.message);  
	});
});

var pay_url = {
	"alipay":{
		"charge" : "/O2App/makeAliPayAppChargeOrder",
		//"payment" : "/O2App2/makeAliPayAppPaymentOrder",
		"payment" : "/O2App/cashPayments",
	},
	"wxpay":{
		"charge" : "/O2App/makeWxAppChargeOrder",
		//"payment" : "/O2App2/makeWxAppPaymentOrder",
		"payment" : "/O2App/cashPayments",
	}
},
query_pay_url = {
	// "alipay":"/O2App2/queryMobileAliPayOrder",
	// "wxpay":"/O2App2/queryMobileWxPayOrder"
	"alipay":"/O2App/queryAliPayOrder",
	"wxpay":"/O2App/queryWxPayOrder",
};
var w=null;
function closeWaiting(){
	w.close();
	w=null;
}
function goPay(params){
	if(w){return false;}//检查是否请求订单中
	var options = {
		paytype : "wxpay",	//支付类型
		purpose : "charge",	//用途
		data : {},			//post传递的数据
		addOrderCallback : function(){},
		queryOrderCallback : function(){},
		failCallback : function(){}
	};
	$.extend(options, params);
	var _this = this;
	var channel = null;
	if(this.channels[options.paytype] != undefined){
		channel = this.channels[options.paytype];
	} else{
		plus.nativeUI.toast("不支持当前充值渠道！");
		return false;
	}
	w=plus.nativeUI.showWaiting("请稍等...");
	var xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		switch(xhr.readyState){
			case 4:
			closeWaiting();
			if(xhr.status==200){
				console.log("xhr.responseText="+xhr.responseText);
				var response = (toJSON(xhr.responseText));
				if(response.result == 1){
					var data = response.data.data;
					console.log(JSON.stringify(channel));
					console.log(JSON.stringify(data));
					plus.payment.request(channel, data, function(result){
						console.log('----- 支付成功 -----');
						console.log(JSON.stringify(result));
						options.addOrderCallback();
						plus.nativeUI.showWaiting("请稍等，系统正在校检支付事项！");
						queryOrderResult(query_pay_url[options.paytype], response.data.trade_no, options);
					},function(e){
						console.log('----- 支付失败 -----');
						console.log(JSON.stringify(e));
						console.log('['+e.code+']：'+e.message);
						var message = e.message;
						if(e.code==-100){
							//提取错误码
							code = message.substring(message.indexOf(":")+1, message.indexOf("]"));
							var objError = {
								"wxpay" : {
									"-1":"一般错误",
									"-2":"用户取消",
									"-3":"发送失败",
									"-4":"认证被否决",
									"-5":"不支持错误"
								},
								"alipay" : {
									"62000":"客户端未安装支付通道依赖的服务",
									"62001":"用户取消支付操作",
									"62002":"此设备不支持支付",
									"62003":"数据格式错误",
									"62004":"支付账号状态错误",
									"62005":"订单信息错误",
									"62006":"支付操作内部错误",
									"62007":"支付服务器错误",
									"62008":"网络问题引起的错误",
									"62009":"其它未定义的错误"
								}
							};
							//取消支付单独提取出来
							if((code==-2 && options.paytype=="wxpay") || (code==62001 && options.paytype=="alipay")){
								plus.nativeUI.toast("您已取消支付！");
							} else{
								if(objError[options.paytype][code] != undefined){
									//已知错误
									plus.nativeUI.toast(objError[options.paytype][code]);
								} else{
									//未知错误
									plus.nativeUI.toast("系统错误，请联系我们！");
								}
							}
						} else{
							plus.nativeUI.toast(message);
						}
						//plus.nativeUI.alert('更多错误信息请参考支付(Payment)规范文档：http://www.html5plus.org/#specification#/specification/Payment.html', null, '支付失败：'+e.code);
						options.failCallback();
					});
				} else{
					plus.nativeUI.alert(response.msg);  
					options.failCallback();
				}
			}
			else{
				console.log('----- 请求订单失败 -----');
				plus.nativeUI.alert('获取订单信息失败！', null, '捐赠');
			}
			break;
			default:
			break;
		}
	}
	var url = REMOTE_SERVER_HOST + this.pay_url[options.paytype][options.purpose];
	// post请求
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send($.param(options.data));
}
function queryOrderResult(url, trade_no, options){
	var _this = this;
	var myIntval = setInterval(function () {
		load(trade_no);
	}, 1000);
	
	function load(trade_no) {
		if(trade_no=="") return false;
		Vue.http.post(url, {'trade_no':trade_no}, VUE_HEADER)
		.then(
			function(res){
				console.log(JSON.stringify(res));
				console.log(JSON.stringify(options));
				var json=toJSON(res.data);
				if(options.paytype == "wxpay"){
					if(json.data.trade_state  == 'SUCCESS'){
						options.queryOrderCallback(options);
						//支付成功
						clearInterval(myIntval);
						plus.nativeUI.closeWaiting();
					} else if($.inArray(json.data.trade_state, ["REFUND", "CLOSED", "REVOKED", "PAYERROR"])){
						//支付失败
						clearInterval(myIntval);
						plus.nativeUI.closeWaiting();
						options.failCallback();
						plus.nativeUI.toast("支付失败，原因："+json.data.trade_state_desc);
					}
				}
				else if(options.paytype == "alipay"){
					if(json.data.trade_status  == 'TRADE_SUCCESS' || json.data.trade_status  == 'TRADE_FINISHED'){
						options.queryOrderCallback(options);
						//支付成功
						clearInterval(myIntval);
						plus.nativeUI.closeWaiting();
					} else if(json.data.trade_status  == 'WAIT_BUYER_PAY'){
						//等待买家付款
					}  else if(json.data.trade_status  == 'TRADE_CLOSED'){
						//未付款交易超时关闭，或支付完成后全额退款
						clearInterval(myIntval);
						plus.nativeUI.closeWaiting();
						options.failCallback();
						plus.nativeUI.toast("支付失败，原因："+json.data.trade_state_desc);
					}
				}
				
			},function(error){
				closeWaiting();
				plus.nativeUI.alert("查询支付结果失败，原因：" + error.code);
			}
		);
	}
}