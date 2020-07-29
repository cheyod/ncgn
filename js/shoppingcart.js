document.getElementById('showDel').addEventListener('tap',function () {
if(this.innerHTML=='编辑'){
    this.innerHTML='完成';
}else{
    this.innerHTML='编辑';
}

var goodsInfo=document.getElementsByClassName('goodsInfo');
var goodsOpreation=document.getElementsByClassName('goodsOpreation');

if(goodsInfo.length>0){
    var goodsInfoStyles=goodsInfo[0].getAttribute("style");
    var goodsInfoStatus=goodsInfoStyles.split(':')[1];
}else{
    document.getElementById("shopCart").innerHTML='<p style="text-align:center;font-size:18px;">您的购物车是空的哟</p>';
}

//切换删除按钮
if(goodsInfoStatus!='none'){
    for(var i=0;i<goodsInfo.length;i++){
        goodsInfo[i].setAttribute('style','display:none');
        goodsOpreation[i].setAttribute('style','display:block');
    }
}else{
    for(var j=0;j<goodsInfo.length;j++){
        goodsOpreation[j].setAttribute('style','display:none');
        goodsInfo[j].setAttribute('style','display:block');
    }
}   
});
mui('.goodsOpreation').on('tap','.shopDel',function(){
    var btnArr=['确定','再看看'];
    //获取到当前删除节点
    var thisNode=this.parentNode.parentNode;
    mui.confirm(' ','确定删除该商品？',btnArr,function(e){
        if(e.index==0){
            thisNode.remove();
        }
    });
});
	//获取到当前商品ID，以便购买时将商品信息发送到服务器
    var goodsIdArr=[];
    var goodId;
    
    //所勾选商品的价格
    var priceArr=[];
    var price=0;
	//所勾选的商品数量
	var num = 1;
	var Nums = [];
	
	function checkCart(){
		//购物车中复选框
	    var iptSelect=document.getElementsByClassName('iptSelect');
	    //判断是否选择
	    var checked=false;
	    
	   
		
	    //添加之前先清空数组，防止之前添加的还在，比如当你已经勾选了了四个，现在要放弃两个，那么那个就不应该再在这里面
	    goodsIdArr.splice(0,goodsIdArr.length);
	    priceArr.splice(0,priceArr.length);
	    Nums.splice(0,Nums.length);
	
		
	    for (var j=0;j<iptSelect.length;j++) {
	        if(iptSelect[j].checked){
	        //如果勾选了获取所勾选商品的ID和价格
	        goodId=parseInt(iptSelect[j].getAttribute('value'));    
	            			priceStr=iptSelect[j].parentNode.children[2].children[1].children[1].innerHTML;
	            
			num = iptSelect[j].parentNode.children[2].children[2].children[1].innerHTML;
				
				
	            var reg=/[0-9]+/g;
	            //将&yen;符号过滤，并且强制转换为数字类型
	//          price=parseFloat(priceStr.match(reg));
	            price=parseFloat(priceStr)*num;
				
	            //如果不为空，且已经不存在于数组，才添加至数组
	            if(goodId !=undefined && goodsIdArr.indexOf(goodId)==-1　){
	                goodsIdArr.push(goodId);
	                priceArr.push(price);
	            }
	        }
	    };
     	//总计
        var hj=0;
        for(var z=0;z<priceArr.length;z++){
            hj=hj+priceArr[z];  
        }
        document.getElementById("hj").innerHTML= hj;
	
	
        //获取当前有INPUT框勾选，如有则将buyNowbtn设为可用的
//      for(var i=0;i<iptSelect.length;i++){
//          if(iptSelect[i].checked){
//              checked=true;
//              mui('#buyNowbtn')[0].disabled=false;
//              
//          	return;
//          }else{
//              checked=false;
//              mui('#buyNowbtn')[0].disabled=true;
//          }
//      }
	}
	
    //单选
	mui(document.body).on('change','.iptSelect',function(){
    	checkCart();
    });
    // 处理全选  
   	var checkAllDom = document.querySelector("input[name='checkAll']");
    var spanDom = document.getElementsByTagName("span")[0];
    var items = document.getElementsByName("items");
    checkAllDom.onclick = function(){
        var isFlag = this.checked;
        checkAll(isFlag);
    };
    //全选
    function checkAll(flag){
        if(flag){
            for(var i=0;i<items.length;i++){
                //debugger;
                items[i].checked = true; 
            }
            checkCart();
        }else{
            for(var i=0;i<items.length;i++){
                items[i].checked = false;
            }   
           	document.getElementById("hj").innerHTML='0';
        }};
