//����ģ̬���ڣ�ѡ��ͼ�꣬������ͼ�����ƣ�icon-xxx��
var cengrp_url_path = "/cengrp";		//Ĭ�ϵ�cengrp����·��

function getIcon($obj){
	var returnVal = window.showModalDialog( cengrp_url_path + '/main/selector/icon.jsp?value=' + $obj.val()
				,window,'dialogWidth:800px;dialogHeight:800px');
	return returnVal;
}



//Ϊ�ַ�������trim��ltrim��rtrim����
String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim=function(){
	return this.replace(/(^\s*)/g,"");
}
String.prototype.rtrim=function(){
	return this.replace(/(\s*$)/g,"");
}