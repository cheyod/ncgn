var shares=null;
var Intent=null,File=null,Uri=null,main=null;

//分享链接
var sharehref = "http://baidu.com";
//分享链接标题
var sharehrefTitle = "title";
//分享链接描述
var sharehrefDes = "测试";

// H5 plus事件处理
function plusReady(){
    updateSerivces();
    if(plus.os.name=="Android"){
        main = plus.android.runtimeMainActivity();
        Intent = plus.android.importClass("android.content.Intent");
        File = plus.android.importClass("java.io.File");
        Uri = plus.android.importClass("android.net.Uri");
    }
}
if(window.plus){
    plusReady();
}else{
    document.addEventListener("plusready",plusReady,false);
}

/**
 * 
 * 更新分享服务
 */
function updateSerivces(){
    plus.share.getServices( function(s){
        shares={};
        for(var i in s){
            var t=s[i];
            shares[t.id]=t;
        }
    }, function(e){
        alert("获取分享服务列表失败："+e.message );
    } );
}



/**
   * 分享操作
   * @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)
   * @param {Boolean} bh 是否分享链接
   */
function shareAction(sb,bh) {
    if(!sb||!sb.s){
        alert("无效的分享服务！");
        return;
    }
    
    var msg={content:sharehrefDes,extra:{scene:sb.x}};
    if(bh){
        msg.href=sharehref;
        if(sharehrefTitle!=""){
            msg.title=sharehrefTitle;
        }
        if(sharehrefDes!=""){
            msg.content=sharehrefDes;
        }
        msg.thumbs=["images/icon.png"];
        msg.pictures=["images/icon.png"];
    }else{
        if(pic&&pic.realUrl){
            msg.pictures=[pic.realUrl];
        }
    }
    // 发送分享
    if ( sb.s.authenticated ) {
        mui.toast("已授权");
        shareMessage(msg,sb.s);
    } else {
        mui.toast("未授权");
        sb.s.authorize( function(){
                shareMessage(msg,sb.s);
            },function(e){
                mui.toast("认证授权失败："+e.code+" - "+e.message );
            
        });
    }
}
/**
   * 发送分享消息
   * @param {JSON} msg
   * @param {plus.share.ShareService} s
   */
function shareMessage(msg,s){
    
//  alert(JSON.stringify(msg));
    s.send( msg, function(){
        alert("分享到\""+s.description+"\"成功！ " );
        
    }, function(e){
        alert( "分享到\""+s.description+"\"失败: "+JSON.stringify(e) );
    
    } );
}
// 分析链接
function shareHref(){
    var shareBts=[];
    // 更新分享列表
    var ss=shares['weixin'];
    ss&&ss.nativeClient&&(shareBts.push({title:'微信朋友圈',s:ss,x:'WXSceneTimeline'}),
    shareBts.push({title:'微信好友',s:ss,x:'WXSceneSession'}));
    ss=shares['qq'];
    ss&&ss.nativeClient&&shareBts.push({title:'QQ',s:ss});
    // 弹出分享列表
    shareBts.length>0?plus.nativeUI.actionSheet({title:'分享',cancel:'取消',buttons:shareBts},function(e){
        (e.index>0)&&shareAction(shareBts[e.index-1],true);
    }):plus.nativeUI.alert('当前环境无法支持分享链接操作!');
}