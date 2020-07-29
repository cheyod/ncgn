$(function(){
	$("#password_ul1").click(function(){
		$("#password1").val("");
		$("#password1").focus();
		$("#password_ul1 li").text("");
	});
	$("#password1").on("input",function(e){ //标签为password下的input添加oninput事件
		var number = 6;   //定义输入最大值
		var pw = $("#password1").val(); //定义pw为name是password的input框的输入值
		var list = $("#password_ul1 li");  //定义list是li
		for(var i = 0; i < number ; i++){    //for循环遍历将·放入li标签
			if(pw[i]){
				$(list[i]).text("•");
			}else{
				$(list[i]).text("");
			};
		};
	});
	
	$("#password_ul2").click(function(){
		$("#password2").val("");
		$("#password2").focus();
		$("#password_ul2 li").text("");
	});
	$("#password2").on("input",function(e){ //标签为password下的input添加oninput事件
		var number = 6;   //定义输入最大值
		var pw = $("#password2").val(); //定义pw为name是password的input框的输入值
		var list = $("#password_ul2 li");  //定义list是li
		for(var i = 0; i < number ; i++){    //for循环遍历将·放入li标签
			if(pw[i]){
				$(list[i]).text("•");
			}else{
				$(list[i]).text("");
			};
		};
	});
	$("#next").click(function(){
		var pwd1 = $('#password1').val();
		if(pwd1.length<6){
			mui.toast("密码不能少于6位数字");
			$('#password1').val('');
			$("#password_ul1 li").text('');
			return;
		} 
		
		var patrn = /^(-)?\d+(\.\d+)?$/;
	    if (patrn.exec(pwd1) == null || pwd1 == "") {
	        mui.toast("密码只能是6位数字");
	        $('#password1').val('');
	        $("#password_ul1 li").text('');
	        return;
	    }
		$("#commodity1").hide();
		$("#commodity2").show();
	});
});
