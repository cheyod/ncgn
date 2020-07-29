var menu = new Vue({
	el:'#menu',
	data:{
//		Count:0
	},
	created: function(){
		this.getCartCount();
	},
	methods:{
		indexBtn:function(){
			setTimeout(function(){//延后显示可避免低端机上动画时白屏
				mui.openWindow({
					url: 'index.html',
					id: 'index',
					preload: true,
					createNew:true,
					show: {
						autoShow: true, //页面loaded事件发生后自动提示，默认为true
						aniShow: "none", //页面显示动画，默认为“slide-in-right”
                        duration: 100 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒
					},
					styles: {
						popGesture: 'hide'
					},
					waiting:{
						autoShow: true, //自动显示等待框，默认为true  
			        	title: '正在加载...', //等待对话框上显示的提示内容 
						//autoShow:false
					}
				})
				self.close();
			},100);
//			var nwaiting = plus.nativeUI.showWaiting();
//			webviewShow = plus.webview.create('index.html'); 
//			self.close();
		},
		informationBtn:function(){
			setTimeout(function(){//延后显示可避免低端机上动画时白屏
				mui.openWindow({
					url: 'information.html',
					id: 'information',
					preload: true,
					createNew:true,
					show: {
						autoShow: true, //页面loaded事件发生后自动提示，默认为true
						aniShow: "none", //页面显示动画，默认为“slide-in-right”
                        duration: 100 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒
					},
					styles: {
						popGesture: 'hide'
					},
					waiting:{
						autoShow: true, //自动显示等待框，默认为true  
			        	title: '正在加载...', //等待对话框上显示的提示内容 
						//autoShow:false
					}
				})
				self.close();
			},100);
//			var nwaiting = plus.nativeUI.showWaiting();
//			webviewShow = plus.webview.create('information.html'); 
//			self.close();
			
		},
		myBtn:function(){
			if(checkIsLogin() == true){
				setTimeout(function(){//延后显示可避免低端机上动画时白屏
					mui.openWindow({
						url: 'myInfo.html',
						id: 'myInfo',
						preload: true,
						createNew:true,
						show: {
							autoShow: true, //页面loaded事件发生后自动提示，默认为true
							aniShow: "none", //页面显示动画，默认为“slide-in-right”
	                        duration: 100 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒
						},
						styles: {
							popGesture: 'hide'
						},
						waiting:{
							autoShow: true, //自动显示等待框，默认为true  
				        	title: '正在加载...', //等待对话框上显示的提示内容 
							//autoShow:false
						}
					})
					self.close();
				},100);
//			var nwaiting = plus.nativeUI.showWaiting();
//			webviewShow = plus.webview.create('myInfo.html'); 
//			self.close();
			}else{
				var r=confirm('您还没登录，暂时不能访问该页面，请前往登录！');
				if (r==true)
				{
				  	setTimeout(function(){//延后显示可避免低端机上动画时白屏
						mui.openWindow(openWinParam('login.html'));
						self.close();
					},200);
		//		    location.href='login.html';	
				}
			}
		},
		shoppingcartBtn:function(){
			if(checkIsLogin() == true){
				setTimeout(function(){//延后显示可避免低端机上动画时白屏
					mui.openWindow({
						url: 'shoppingcart.html',
						id: 'shoppingcart',
						preload: true,
						createNew:true,
						show: {
							autoShow: true, //页面loaded事件发生后自动提示，默认为true
							aniShow: "none", //页面显示动画，默认为“slide-in-right”
                            duration: 100 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒
						},
						styles: {
							popGesture: 'hide'
						},
						waiting:{
							autoShow: true, //自动显示等待框，默认为true  
				        	title: '正在加载...', //等待对话框上显示的提示内容 
//												autoShow:false
						}
					})
					self.close();
				},100);
				//location.href="relative.html";
//				var nwaiting = plus.nativeUI.showWaiting();
//				webviewShow = plus.webview.create('shoppingcart.html'); 
//				self.close();
			}
			else{
				var r=confirm('您还没登录，暂时不能访问该页面，请前往登录！');
				if (r==true)
				{
				  	setTimeout(function(){//延后显示可避免低端机上动画时白屏
							mui.openWindow(openWinParam('login.html'));
							self.close();
					},200);
		//		    location.href='login.html';	
				}

			}
		},
		getCartCount :function(){
			var that = this;
			that.$http.post('/o2app/getCartCount',{}, VUE_HEADER).then(function(response){
				var json  = toJSON(response.data);
				if(json.result==0){
					$("#Count").hide();
				}else{
					var number = json.data[0].number;
					if(number==0){
						$("#Count").hide();
					}else{
						$("#Count").html(json.data[0].number);
						$("#Count").show();
					}
					
				}
				
			})
			.catch(function(){
				setTimeout(function(){
					alert("网络错误,请检查网络是否连接");
				},1000);
			});	
		}	
	}
})
