var UserManager = function () {

    return {

        //main function to initiate the module
        init: function () {
        	var url="../UserServlet";
        	
        	$.post(url,{"operation":"queryAll"},function(data){
        		var $ul=$('#userList').find('ul').empty();
        		$.each(data,function(i,val){
        			var $li=$("<li><span >"+val+"</span></li>");
        			$ul.append($li);
        		});
        	},"json");
        	
        	var $addform=$("form[name='add_user']");
        	
        	//修改成功提示窗口
		    $("#dialog_updatesuccess").dialog({
		      dialogClass: 'ui-dialog-blue',
		      autoOpen: false,
		      resizable: false,
		      modal: true,
		      buttons: [
		      	{
		      		"text" : "关闭",
		      		'class' : 'btn green',
		      		click: function() {
	        			$(this).dialog( "close" );
	      			}
		      	}
		      ]
		    });
		    
		  //修改失败提示窗口
		    $("#dialog_updatefail").dialog({
		      dialogClass: 'ui-dialog-red',
		      autoOpen: false,
		      resizable: false,
		      modal: true,
		      buttons: [
		      	{
		      		"text" : "关闭",
		      		'class' : 'btn green',
		      		click: function() {
	        			$(this).dialog( "close" );
	      			}
		      	}
		      ]
		    });
		    
		  //添加成功提示窗口
		    $("#dialog_addsuccess").dialog({
		      dialogClass: 'ui-dialog-blue',
		      autoOpen: false,
		      resizable: false,
		      modal: true,
		      buttons: [
		      	{
		      		"text" : "关闭",
		      		'class' : 'btn green',
		      		click: function() {
	        			$(this).dialog( "close" );
	      			}
		      	}
		      ]
		    });
		    
		  //添加失败提示窗口
		    $("#dialog_addfail").dialog({
		      dialogClass: 'ui-dialog-red',
		      autoOpen: false,
		      resizable: false,
		      modal: true,
		      buttons: [
		      	{
		      		"text" : "关闭",
		      		'class' : 'btn green',
		      		click: function() {
	        			$(this).dialog( "close" );
	      			}
		      	}
		      ]
		    });
        	
        	var addValidate=$addform.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                    username: {
                        rangelength: [2,25],
                        required: true
                    },
                    password: {
                    	rangelength: [3,25],
                        required: true
                    },
                    repassword: {
                    	rangelength: [3,25],
                        equalTo:'#password',
                        required: true
                    }
                },
                messages:{
                	username:{
                		rangelength:$.validator.format("用户名长度范围{0}-{1}"),
                		required: "用户名不能为空",
                	},
                	password:{
                		rangelength:$.validator.format("密码长度范围{0}-{1}"),
                		required: "密码不能为空",
                	},
                	repassword:{
                		rangelength:$.validator.format("密码长度范围{0}-{1}"),
                		equalTo:"两次输入密码不一致",
                		required: "密码不能为空",
                	}
                },
                
                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },

                success: function (label) {
                    label
                        .addClass('valid').addClass('help-inline ok') // mark the current input as valid and display OK icon
                    .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                }
    		});
        	
        	$addform.find("button[title='ok']").live('click',function(e){
        		e.preventDefault();
        		
        		var valid=$addform.valid();
        		if(valid==true){
        			var data={"operation":"add"};
        			data.username=$('#username').val();
        			data.password=$('#password').val();
        			
	        		$.post(url, data, function(obj) {
						if (obj.success==true) {
							$( "#dialog_addsuccess" ).dialog( "open" );
							addValidate.resetForm();
							var $ul=$('#userList').find('ul');
							var $li=$("<li><span >"+data.username+"</span></li>");
	            			$ul.append($li);
						}else{
							$( "#dialog_addfail" ).dialog( "open" );
						}
					}, "json");
        		}
        	});
        	
        	var $updateform=$("form[name='update_pwd']");
        	
        	var updateValidate=$updateform.validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",
                rules: {
                	old_pwd: {
                        rangelength: [3,25],
                        required: true
                    },
                    new_pwd: {
                    	rangelength: [3,25],
                        required: true
                    },
                    new_pwd2: {
                    	rangelength: [3,25],
                        equalTo:'#new_pwd',
                        required: true
                    }
                },
                messages:{
                	old_pwd:{
                		rangelength:$.validator.format("密码长度范围{0}-{1}"),
                		required: "密码不能为空"
                	},
                	new_pwd:{
                		rangelength:$.validator.format("密码长度范围{0}-{1}"),
                		required: "密码不能为空",
                	},
                	new_pwd2:{
                		rangelength:$.validator.format("密码长度范围{0}-{1}"),
                		equalTo:"两次输入密码不一致",
                		required: "密码不能为空",
                	}
                },
                
                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.help-inline').removeClass('ok'); // display OK icon
                    $(element)
                        .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.control-group').removeClass('error'); // set error class to the control group
                },

                success: function (label) {
                    label
                        .addClass('valid').addClass('help-inline ok') // mark the current input as valid and display OK icon
                    .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
                }
    		});
        	
        	$updateform.find("button[title='ok']").live('click',function(e){
        		e.preventDefault();
        		
        		var valid=$updateform.valid();
        		if(valid==true){
        			var data={"operation":"update"};
        			data.old_pwd=$('#old_pwd').val();
        			data.new_pwd=$('#new_pwd').val();
        			
	        		$.post(url, data, function(obj) {
	        			if(obj.success=true){
	        				$( "#dialog_updatesuccess" ).dialog( "open" );
	        				window.location.assign("login-soft.html");
	        			}else{
	        				$( "#dialog_updatefail" ).dialog( "open" );
	        			}
					}, "json");
        		}
        	});
        }

    };

}();