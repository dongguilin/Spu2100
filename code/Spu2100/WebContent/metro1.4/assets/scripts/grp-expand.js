//弹出模态窗口，选择图标，并返回图标名称（icon-xxx）
var cengrp_url_path = "/cengrp";		//默认的cengrp发布路径

function getIcon($obj){
	var returnVal = window.showModalDialog( cengrp_url_path + '/main/selector/icon.jsp?value=' + $obj.val()
				,window,'dialogWidth:800px;dialogHeight:800px');
	return returnVal;
}



//为字符串增加trim、ltrim、rtrim函数
String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim=function(){
	return this.replace(/(^\s*)/g,"");
}
String.prototype.rtrim=function(){
	return this.replace(/(\s*$)/g,"");
}