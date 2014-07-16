/*
 * jQuery File Upload Plugin JS Example 7.0
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global $, window, document */

$(function () {
    'use strict';

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
    	autoUpload:false,//是否自动上传
    	dataType:'json',
    	done:function(e,data){//上传完毕事件的回调函数
    		console.log(data.result);
    		if(data.result.success==true){
    			var keys = [ "setup_backup","channel_backup"];
    			keys.forEach(function(key) {
    				$.post("../BackupConfServlet", {
    					"operation" : "query",
    					"key" : key
    				}, function(data) {
    					$tbody=$("#"+key).find("tbody").empty();
    					data.forEach(function(obj){
    						$tr=$('<tr>');
    						$tr0=$('<td>').text(obj.dir);
    						$tr1=$('<td>').text(obj.size+"byte");
    						
    						var href="../BackupConfServlet?operation=download&key="+key+"&dir="+obj.dir+"&name="+obj.name;
    						$tr2=$('<td><a title="download"  href='+href+'><i class="icon-download"></i>下载</a>'
    								+'&nbsp;&nbsp;&nbsp;<a title="restore" href="javascript:;"><i class="icon-share-alt"></i>还原到当前备份</a>'
    								+'&nbsp;&nbsp;&nbsp;<a title="delete" href="javascript:;"><i class="icon-trash"></i>删除</a></td>');
    						$tbody.append($tr.append($tr0).append($tr1).append($tr2));
    					});
    					
    				}, "json");
    			});
    		}
    	},
    	progressall: function (e, data) {//设置上传进度事件的回调函数  
            var progress = parseInt(data.loaded / data.total * 5, 10);  
            $('#progress .bar').css(  
                'width',  
                progress + '%'  
            );  
        }  
    
    });


});
