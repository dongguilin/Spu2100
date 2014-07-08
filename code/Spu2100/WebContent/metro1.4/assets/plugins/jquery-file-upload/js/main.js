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
//    	url:上传地址
    	dataType:'json',
    	done:function(e,data){//上传完毕事件的回调函数
    		console.log(data.result);
//    		console.log(JOSN.stringfy(result.result));
//    		$.each(data.result.files, function (index, file) {  
//                $("#myimg").attr({src:data.result.imgurl});  
//                $("#myimg").css({width:"290px",height:"218px"});  
//                //alert(data.result);  
//    		});
    	},
    	progressall: function (e, data) {//设置上传进度事件的回调函数  
            var progress = parseInt(data.loaded / data.total * 5, 10);  
            $('#progress .bar').css(  
                'width',  
                progress + '%'  
            );  
        }  
    
    });

    // Enable iframe cross-domain access via redirect option(only if you uplaod to another domain):
    /*
    $('#fileupload').fileupload(
        'option',
        'redirect',
        'assets/jquery-file-upload/cors/result.html?%s'
    );
    */

    if (window.location.hostname === 'localhost:8080') {
        // Demo settings:
        $('#fileupload').fileupload('option', {
            url: '//localhost:8080/Spu2100/UploadServlet/',
            maxFileSize: 5000000,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            process: [
                {
                    action: 'load',
                    fileTypes: /^image\/(gif|jpeg|png)$/,
                    maxFileSize: 20000000 // 20MB
                },
                {
                    action: 'resize',
                    maxWidth: 1440,
                    maxHeight: 900
                },
                {
                    action: 'save'
                }
            ]
        });
        // Upload server status check for browsers with CORS support:
        if ($.support.cors) {
            $.ajax({
                url: '//localhost:8080/Spu2100/UploadServlet/',
                type: 'HEAD'
            }).fail(function () {
                $('<span class="alert alert-error"/>')
                    .text('Upload server currently unavailable - ' +
                            new Date())
                    .appendTo('#fileupload');
            });
        }
    } else {
        // Load existing files:
        // Demo settings:
        $.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: $('#fileupload').fileupload('option', 'url'),
            dataType: 'json',            
            context: $('#fileupload')[0],
            maxFileSize: 5000000,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            process: [
                {
                    action: 'load',
                    fileTypes: /^image\/(gif|jpeg|png)$/,
                    maxFileSize: 20000000 // 20MB
                },
                {
                    action: 'resize',
                    maxWidth: 1440,
                    maxHeight: 900
                },
                {
                    action: 'save'
                }
            ]
        }).done(function (result) {
            $(this).fileupload('option', 'done')
                .call(this, null, {result: result});
        });

        // Upload server status check for browsers with CORS support:
//        if ($.support.cors) {
//            $.ajax({
//                url: '//localhost:8080/Spu2100/WebContent/imgs/',
//                type: 'HEAD'
//            }).fail(function () {
//                $('<span class="alert alert-error"/>')
//                    .text('Upload server currently unavailable - ' +
//                            new Date())
//                    .appendTo('#fileupload');
//            });
//        }
    }

});
