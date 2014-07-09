var Login = function () {

	var handleLogin = function() {
		$('.login-form').validate({
	            errorElement: 'label', //default input error message container
	            errorClass: 'help-inline', // default input error message class
	            focusInvalid: false, // do not focus the last invalid input
	            rules: {
	                username: {
	                    required: true
	                },
	                password: {
	                    required: true
	                }
	            },

	            messages: {
	                username: {
	                    required: "用户名不能为空."
	                },
	                password: {
	                    required: "密码不能为空."
	                }
	            },

	            highlight: function (element) { // hightlight error inputs
	                $(element)
	                    .closest('.control-group').addClass('error'); // set error class to the control group
	            },

	            success: function (label) {
	                label.closest('.control-group').removeClass('error');
	                label.remove();
	            },

	            errorPlacement: function (error, element) {
	                error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
	            },

	            submitHandler: function (form) {
	                //form.submit();
	            	ajaxsubmit();
	            }
	        });
		
			function ajaxsubmit(){
				var username=$(':input[name="username"]').val();
            	var password=$(':input[name="password"]').val();
            	var data={"username":username,"password":password};
            	$.ajax({
         		   type: "GET",
         		   url: "../LoginServlet",
         		   dataType:"json",
         		   data: data,
         		   success: function(data){
         		     if(data.success==true){
         		    	 window.location.assign("version_info.html");
         		     }else if(data['success']==false){
         		    	$('.alert-error span').text(data.msg);
         		    	$('.alert-error').show();
         		     }
         		   }
         		});
			}

	        $('.login-form input').keypress(function (e) {
	            if (e.which == 13) {
	                if ($('.login-form').validate().form()) {
	                    //$('.login-form').submit();
	                	ajaxsubmit();
	                }
	                return false;
	            }
	        });
	}

    return {
        //main function to initiate the module
        init: function () {
        	
            handleLogin();

            $.backstretch([
		        "../img/1.jpg",
		        "../img/2.jpg",
		        "../img/3.jpg",
		        "../img/4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		    });
	       
        }

    };

}();