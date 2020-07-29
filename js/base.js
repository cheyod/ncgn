var REMOTE_SERVER_HOST = "http://o2.schoolwo.cn";
//var REMOTE_SERVER_HOST = "http://116.26.94.160:9003";
//var REMOTE_SERVER_HOST ="http://o2.newft.nft:8080";
var VUE_HEADER = {
	headers: {
		'Content-Type':'application/x-www-form-urlencoded',
		'X-Requested-With':'XMLHttpRequest'
	},
	emulateJSON:true
};
var VUE_HEADER_JSON = {
	headers: {
		'Content-Type':'application/x-www-form-urlencoded',
		'X-Requested-With':'XMLHttpRequest'
	},
	emulateJSON:true
};
Vue.url.options.root = REMOTE_SERVER_HOST +"";

function getUrlParam(field){				//获取地址参数
	var str = location.search;
	return urlQueryParam(str, field);
}
function urlQueryParam(str,field){
	if(str==null || str==undefined)str="";
	str = str.replace("?", "");
	var arr = str.split('&');
	var rv = {};
	for(var i in arr){
		if(!arr[i])continue;
		var tmp = arr[i].split("=");
		rv[tmp[0]] = tmp.length>1 ? tmp[1] : null;
	}
	if(!field){
		return rv;
	}else{
		return rv[field] ? rv[field] : null;
	}
}

function toJSON(str){
	if(str){
		str = str.replace(/^\s|^\t|\s$|\t$/g,"");//把首尾空格跟tab空格去掉
	}else{
		str = "";
	}
	if(/^\{|^\[|\}$|\]$/g.test(str))//正则表达式：判断是否以 { 开头或 [ 开头或 }结尾或 ]结尾
		return JSON.parse(str);
		
	return {result:0,msg:'parse error',data:[]};
}

function RemoteImageSrc(src){
	if(typeof src=="string" && src.match(/^https?:\/\//))return src;
	return REMOTE_SERVER_HOST + src;
}

Vue.filter("RemoteImage", function(src){
	return RemoteImageSrc(src);
});




function openWinParam(url,obj){
	var def = {
		url:url,
		id:url.replace(/\.html/,''),
		preload:true,
		createNew:true,
		show:{
			autoShow: true, //页面loaded事件发生后自动提示，默认为true
	        aniShow: "slide-in-left", //页面显示动画，默认为“slide-in-right”
            duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒
		},
		styles:{
			popGesture:'hide'
		},
		waiting:{
//			autoShow: true, //自动显示等待框，默认为true  
//      	title: '正在加载...', //等待对话框上显示的提示内容  
//			autoShow:false
			autoShow: true, //页面loaded事件发生后自动提示，默认为true
			aniShow: false,
		}
	};
	if(obj && typeof obj=='object'){
		for(var i in obj){
			def[i] = obj[i];
		}
	}
	return def;
}
//修改不同的动画效果，左入右出
function openWinParam_back(url,obj){
	var def = {
		url:url,
		id:url.replace(/\.html/,''),
		preload:true,
		createNew:true,
		show:{
			autoShow: true, //页面loaded事件发生后自动提示，默认为true
	        aniShow: "slide-in-right", //页面显示动画，默认为“slide-in-right”
            duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒
		},
		styles:{
			popGesture:'hide'
		},
		waiting:{
//			autoShow: true, //自动显示等待框，默认为true  
//      	title: '正在加载...', //等待对话框上显示的提示内容  
//			autoShow:false
			autoShow: true, //页面loaded事件发生后自动提示，默认为true
			aniShow: false, 
		}
	};
	if(obj && typeof obj=='object'){
		for(var i in obj){
			def[i] = obj[i];
		}
	}
	return def;
}



/**
 *javascript.cookie
 * @example Cookie.setCookie('cookie_name', 'value', expires);
 * @desc Set the value of a cookie.
 * @example Cookie.setCookie('cookie_name', 'value', expires, path, domain, true);
 * @desc Create a cookie with all available options.
 * @example Cookie.delCookie('cookie_name');
 * @desc Delete a cookie.
 * @example Cookie.getCookie('cookie_name');
 * @desc Get the value of a cookie.
 * @author hydrogen 2012-06-27
*/
var Cookie = {
	setCookie : function(name, value, expires, path, domain ,secure){
		if(!this.check()){
			return;
		}
		if(arguments[2]){
			if(typeof(expires) !='number'){
				return;
			}
		}else{
			expires = 0;
		}

		var e,p,d,s;
		var exdate = new Date();
		exdate.setHours(exdate.getHours()+expires*24);
		e = (expires == null) ? '': ";expires="+exdate.toGMTString();
		p = path ? path : '/';
		d = domain ? ';domain='+domain : '';
		s = secure ? ';secure' : '';
		document.cookie = name+"="+ encodeURIComponent(value) + e +";path="+ p + d + s;
	},
	getCookie : function(name){
		if(this.check() && document.cookie.length >0){
			var cookiestr = document.cookie;
			var start = cookiestr.indexOf(name+"=");
			if(start != -1){
				start = start + name.length+1;
				var end = cookiestr.indexOf(";",start);
				if(end == -1)end = cookiestr.length;
				return decodeURIComponent(cookiestr.substring(start,end));
			}
		}
		return "";
	},
	delCookie : function(name){
		this.setCookie(name,'',-1);
	},
	check : function(){
		if(document.cookie)return true;
		return false;
	}
};



function cacheLogin(user,psw){
	localStorage.setItem("u_name",user);
	localStorage.setItem("u_psw",psw);
	sessionStorage.IsLogin = 1;
//	plus.storage.setItem("u_name",user);
//	plus.storage.setItem("u_psw",psw);
//	plus.storage.setItem("IsLogin", "1");

//	var check = document.getElementById("chkRem"); 
//	if(check.checked) //判断记住密码项是否勾选，是则记住密码到本地缓存 
//  { 
//		localStorage.setItem("u_name",user);
//		localStorage.setItem("u_psw",psw);
//  } else //否则就移除本地缓存 
//  { 
//      localStorage.removeItem("u_name"); 
//      localStorage.removeItem("u_psw"); 
//      
//  } 
//  var Id = localStorage.getItem("u_name"); 
//  if(Id != null) //如果缓存中有数据，则加载出来
//  { 
//      document.getElementById("num").value = Id; 
//      document.getElementById("password").value = localStorage.getItem("u_psw"); 
//      document.getElementById("chkRem").checked = "checked"; 
//  } 
}
function clearLogin(){
	localStorage.setItem("u_name",'');
	localStorage.setItem("u_psw",'');
	sessionStorage.IsLogin = 0;
	
	
//	plus.storage.setItem("u_name",'');
//	plus.storage.setItem("u_psw",'');
//	plus.storage.setItem("IsLogin", '');
}
//将账号与密码保存到Localstore 
//function remPwd() { 
//  var check = document.getElementById("chkRem"); 
//  if(check.checked) //判断记住密码项是否勾选，是则记住密码到本地缓存 
//  { 
//      var id = document.getElementById("num").value; 
//      var pwd = document.getElementById("password").value; 
//      localStorage.setItem("num", id); 
//      localStorage.setItem("password", pwd); 
//  } else //否则就移除本地缓存 
//  { 
//      localStorage.removeItem("num"); 
//      localStorage.removeItem("password"); 
//  } 
//} 

//function checkIsLogin(){
//	var isLogin = plus.storage.getItem("IsLogin");
//	return isLogin && (isLogin=='1' || isLogin==1);
//}
//mui.plusReady(function(){
//	var u=plus.storage.getItem("u_name"),
//	p=plus.storage.getItem("u_psw"),
//	isLogin=plus.storage.getItem("IsLogin");
//
//	if(u && p && (!isLogin || isLogin=="0" || isLogin==0))
//	Vue.http.post('/o2app/memberLoad', 
//	{'username':u,'password':p}, VUE_HEADER_JSON).then(function(res){
//		var json=toJSON(res.data);
//		if(json.result == 1){
//			plus.storage.setItem("IsLogin",'1');
//		}
//	});


function checkIsLogin(){
	var isLogin = sessionStorage.IsLogin;
	return isLogin && (isLogin=='1' || isLogin==1);
}
(function(){
	var u=localStorage.getItem("u_name"),
	p=localStorage.getItem("u_psw"),
	isLogin=sessionStorage.IsLogin;

	if(u && p && (!isLogin || isLogin=="0" || isLogin==0))
	Vue.http.post('/o2app/memberLoad', 
	{'username':u,'password':p}, VUE_HEADER_JSON).then(function(res){
		var json=toJSON(res.data);
		if(json.result == 1){
			sessionStorage.IsLogin = 1;
		}
	});
})();


//// 预创建二级页面
//var preate={};
//function preateWebivew(id){
//	if(!preate[id]){
//		var w=plus.webview.create(id,id,{scrollIndicator:'none',scalable:false,popGesture:'hide'},{preate:true});
//		preate[id]=w;
//		w.addEventListener('close',function(){//页面关闭后可再次打开
//			_openw=null;
//			preate[id]&&(preate[id]=null);//兼容窗口的关闭
//		},false);
//	}
//}
//// 判断预载打开
//var _openw=null;
//function pclicked(id){
//	if(_openw){return;}
//	_openw=preate[id];
//	if(_openw){
//		if(_openw.showded){
//			_openw.show('auto');
//		}else{
//			_openw.show(as);
//			_openw.showded=true;
//		}
//		_openw=null;
//	}else{
//		_openw=plus.webview.create(id,id,{scrollIndicator:'none',scalable:false,popGesture:'hide'});
//		preate[id]=_openw;
//		_openw.addEventListener('loaded',function(){//叶面加载完成后才显示
////			setTimeout(function(){
//			_openw.show(as);
//			_openw.showded=true;
//			_openw=null;
////			},10);
//		},false);
//		_openw.addEventListener('close',function(){//页面关闭后可再次打开
//			_openw=null;
//			preate[id]&&(preate[id]=null);//兼容窗口的关闭
//		},false);
//	}
//}
//// H5 plus事件处理
//var as='pop-in';// 默认动画类型
//function plusReady(){
////	preateWebivew('webview_animation.html');
////	preateWebivew('webview_pullhead.html');
//}
//if(window.plus){
//	plusReady();
//}else{
//	document.addEventListener('plusready',plusReady,false);
//}