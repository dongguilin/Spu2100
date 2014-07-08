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
