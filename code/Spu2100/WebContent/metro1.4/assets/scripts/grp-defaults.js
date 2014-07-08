/* ����Ĭ����Ϊ */

/* ������֤����Ĭ����Ϊ */

jQuery.extend(
	jQuery.validator.messages, {
	  required: "�����ֶ�",
	  remote: "���������ֶ�",
	  email: "��������ȷ�ĵ����ʼ�",
	  url: "��������ȷ����ַ",
	  date: "��������ȷ������",
	  dateISO: "��������ȷ������ ",
	  number: "��������ȷ������",
	  digits: "ֻ����������",
	  creditcard: "��������ȷ�����ÿ���",
	  equalTo: "���ٴ�������ͬ����",
	  accept: "������ӵ����ȷ��׺�����ַ���",
	  maxlength: jQuery.validator.format("������һ���{0}λ���ַ���"),
	  minlength: jQuery.validator.format("������һ����� {0}λ���ַ���"),
	  rangelength: jQuery.validator.format("������һ�����{0}λ�{1}λ���ַ���"),
	  range: jQuery.validator.format("������һ������СΪ{0}���Ϊ{1}֮�����"),
	  max: jQuery.validator.format("������һ�����Ϊ{0}����"),
	  min: jQuery.validator.format("������һ����СΪ{0}����")
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

//$.metadata.setType("attr", "validate");		//����metadataʹ�ÿؼ���validate���ԣ�Ĭ��ʹ��class���ԡ���validate��ʹ��

/* �������ֲ����Ĭ��ֵ */
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

// BEGIN: ���ð�ť����������Ч��Ч�� 
$(function(){			
	$('.click-mask').click(function() {
	   $(this).overlay({container:'.portlet-body'});
	});
})
//END: ���ð�ť����������Ч��Ч�� 
