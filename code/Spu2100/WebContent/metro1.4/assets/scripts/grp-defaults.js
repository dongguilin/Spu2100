/* 设置默认行为 */

/* 设置验证器的默认行为 */

jQuery.extend(
	jQuery.validator.messages, {
	  required: "必填字段",
	  remote: "请修正该字段",
	  email: "请输入正确的电子邮件",
	  url: "请输入正确的网址",
	  date: "请输入正确的日期",
	  dateISO: "请输入正确的日期 ",
	  number: "请输入正确的数字",
	  digits: "只能输入整数",
	  creditcard: "请输入正确的信用卡号",
	  equalTo: "请再次输入相同内容",
	  accept: "请输入拥有正确后缀名的字符串",
	  maxlength: jQuery.validator.format("请输入一个最长{0}位的字符串"),
	  minlength: jQuery.validator.format("请输入一个最短 {0}位的字符串"),
	  rangelength: jQuery.validator.format("请输入一个最短{0}位最长{1}位的字符串"),
	  range: jQuery.validator.format("请输入一个在最小为{0}最大为{1}之间的数"),
	  max: jQuery.validator.format("请输入一个最大为{0}的数"),
	  min: jQuery.validator.format("请输入一个最小为{0}的数")
	}
);

jQuery.validator.setDefaults({   
	errorElement: 'span', //default input error message container
    errorClass: 'valid-inline', // default input error message class
    focusInvalid: false, // do not focus the last invalid input
    ignore: '[readonly]',
    errorPlacement: function (error, element) { // render error placement for each input type
        if (element.attr("name") == "education") { // for chosen elements, need to insert the error after the chosen container
            error.insertAfter("#form_2_education_chzn");
        } else if (element.attr("name") == "membership") { // for uniform radio buttons, insert the after the given container
            error.addClass("no-left-padding").insertAfter("#form_2_membership_error");
        } else if (element.attr("name") == "service") { // for uniform checkboxes, insert the after the given container
            error.addClass("no-left-padding").insertAfter("#form_2_service_error");
        } else {
            error.insertAfter(element); // for other inputs, just perform default behavoir
        }
    },
   invalidHandler: function (event, validator) { 
        $('.alert-error').show();
        App.scrollTo($('.alert-error'), -200);
   },
   highlight: function (element) { // hightlight error inputs
        $(element)
            .closest('.valid-inline').removeClass('ok'); // display OK icon
        $(element)
            .closest('.control-group').removeClass('success').addClass('error'); // set error class to the control group
    },
	unhighlight: function (element) { // revert the change dony by hightlight
        $(element)
            .closest('.control-group').removeClass('error'); // set error class to the control group
    },
    success: function (label) {
        if (label.attr("for") == "service" || label.attr("for") == "membership") { // for checkboxes and radip buttons, no need to show OK icon
            label
                .closest('.control-group').removeClass('error').addClass('success');
            label.remove(); // remove error label here
        } else { // display success icon for other inputs
            label
                .addClass('valid').addClass('valid-inline ok') // mark the current input as valid and display OK icon
            .closest('.control-group').removeClass('error').addClass('success'); // set success class to the control group
            //label.parent().find(".help-inline").attr("style","");
    	}
    }
}); 

//$.metadata.setType("attr", "validate");		//设置metadata使用控件的validate属性，默认使用class属性。在validate中使用

/* 设置遮罩插件的默认值 */
$.fn.overlay.defaults = {
    color: '#000',
    overlayClass: 'overlay',
    opacity: 0.7,
    effect: 'none',
    onShow: null,
    onHide: null,
    closeOnClick: true,
    glossy: false,
    zIndex: 10000,
    container: 'body'
  };

// BEGIN: 设置按钮点击后的遮罩效果效果 
$(function(){			
	$('.click-mask').click(function() {
	   $(this).overlay({container:'.portlet-body'});
	});
})
//END: 设置按钮点击后的遮罩效果效果 
