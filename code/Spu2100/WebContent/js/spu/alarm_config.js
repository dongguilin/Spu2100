var Alarm_config = function() {

	return {

		init : function() {

			$.post("../AlarmConfigServlet", {
				"operation" : "queryAll"
			}, function(data) {
				initBaseTable(data);
			}, "json");

			$.post("../AlarmConfigServlet", {
				"operation" : "queryAllAlarmCombine"
			}, function(data) {
				combinedata = data;
				$('#form_combine_table').find('tbody').empty()
				var key = $('#key').val();
				$.each(data, function(index, d) {
					if (index == key) {
						initCombineTable(d);
					}
				});
			}, "json");

			// 新增或修改的标志
			var form_flag = "";
			var CMax = "C0";
			var TMax = "T0";

			/*
			 * $('#form_base').find('form').validate({ errorElement: 'span',
			 * //default input error message container errorClass:
			 * 'help-inline', // default input error message class focusInvalid:
			 * false, // do not focus the last invalid input ignore: "", rules: {
			 * v2: { required: true, digits:true }, v4: { required: true,
			 * number:true }, v5: { required: true, number:true }, v6: {
			 * required: true, digits:true } },
			 * 
			 * messages:{ v2:{ required:'字段不能为空', digits:'必须输入整数' }, v4:{
			 * required:'字段不能为空', number:'必须有效数字' }, v5:{ required:'字段不能为空',
			 * number:'必须有效数字' }, v6:{ required:'字段不能为空', digits:'必须输入整数' } },
			 * 
			 * highlight: function (element) { // hightlight error inputs
			 * $(element) .closest('.help-inline').removeClass('ok'); // display
			 * OK icon $(element)
			 * .closest('.control-group').removeClass('success').addClass('error'); //
			 * set error class to the control group },
			 * 
			 * unhighlight: function (element) { // revert the change done by
			 * hightlight $(element)
			 * .closest('.control-group').removeClass('error'); // set error
			 * class to the control group },
			 * 
			 * success: function (label) { label
			 * .addClass('valid').addClass('help-inline ok') // mark the current
			 * input as valid and display OK icon
			 * .closest('.control-group').removeClass('error').addClass('success'); //
			 * set success class to the control group }
			 * 
			 * });
			 */

			// 根据后台返回的json数据初始化表格
			function initBaseTable(data) {
				var $tbody = $('#form_base_table').find('tbody').empty();
				$
						.each(
								data,
								function(index, d) {
									if (index.indexOf('C') != -1) {
										CMax = "C"
												+ (Number(index.substring(1)) + 1);
									}
									if (index.indexOf('T') != -1) {
										TMax = "T"
												+ (Number(index.substring(1)) + 1);
									}
									var $tr = $('<tr>');
									$tr.append($('<td>').text(index));
									for ( var i in d) {
										$td = $('<td>').text(d[i]);
										$tr.append($td);
									}
									var $con = $('<td><a title="edit" data-toggle="modal" href="#form_base"><i class="icon-edit"></i>编辑</a>'
											+ '&nbsp;&nbsp;<a title="delete" href="javascript:;"><i class="icon-trash"></i>删除</a></td>');
									$tr.append($con);
									$tbody.append($tr);
								});
			}

			var combinedata = {};

			function initCombineTable(d) {
				var $tbody = $('#form_combine_table').find('tbody').empty();
				if (d['CC']) {
					var $tr = $('<tr>');
					$tr.append($('<td>CC</td>'));
					$tr.append($('<td>').text(d['CC']));
					var $con = $('<td><a title="edit" data-toggle="modal" href="#CCModal"><i class="icon-edit"></i>编辑</a>'
							+ '&nbsp;&nbsp;<a title="delete" href="javascript:;"><i class="icon-trash"></i>删除</a></td>');
					$tr.append($con);
					$tbody.append($tr);
				}
				if (d['TT']) {
					var $tr = $('<tr>');
					$tr.append($('<td>TT</td>'));
					$tr.append($('<td>').text(d['TT']))
					var $con = $('<td><a title="edit" data-toggle="modal" href="#TTModal"><i class="icon-edit"></i>编辑</a>'
							+ '&nbsp;&nbsp;<a title="delete" href="javascript:;"><i class="icon-trash"></i>删除</a></td>');
					$tr.append($con);
					$tbody.append($tr);
				}
			}

			$('#form_combine_table').find("a[title='edit']").live('click',
					function() {
						form_flag = "updateAlarmCombine";
						var $tds = $(this).parents('tr:first').find('td');
						var key = $($tds[0]).text();
						if (key == "CC") {
							$('#CC').val($($tds[1]).text());
						} else if (key == "TT") {
							$('#TT').val($($tds[1]).text());
						}
					});

			$('#add_TT').click(function() {
				form_flag = "addAlarmCombine";
				var key = $('#key').val();
				if (combinedata[key]['TT']) {
					$('#dialog_TTexist').dialog("open");
				} else {
					$('#TTModal').modal('show');
					form_flag = "addAlarmCombine";
					$('#TTModal').find('form')[0].reset();
				}
			});

			$('#add_CC').click(function() {
				form_flag = "addAlarmCombine";
				var key = $('#key').val();
				if (combinedata[key]['CC']) {
					$('#dialog_CCexist').dialog("open");
				} else {
					$('#CCModal').modal('show');
					form_flag = "addAlarmCombine";
					$('#CCModal').find('form')[0].reset();
				}
			});

			$('#CCModal_ok').click(function() {
				$.post("../AlarmConfigServlet", {
					"operation" : form_flag,
					"alarmKey" : $('#key').val(),
					"itemKey" : "CC",
					"itemValue" : $('#CC').val()
				}, function(data) {
					if (data.success == true) {
						$.post("../AlarmConfigServlet", {
							"operation" : "queryAllAlarmCombine"
						}, function(data) {
							combinedata = data;
							$('#form_combine_table').find('tbody').empty()
							var key = $('#key').val();
							$.each(data, function(index, d) {
								if (index == key) {
									initCombineTable(d);
								}
							});
						}, "json");
						$('#CCModal').modal('hide');
						if (form_flag == "addAlarmCombine") {
							$("#dialog_addsuccess").dialog("open");
						} else {
							$("#dialog_updatesuccess").dialog("open");
						}
					} else {
						$('#CCModal').modal('hide');
						if (form_flag == "addAlarmCombine") {
							$("#dialog_addfail").dialog("open");
						} else {
							$("#dialog_updatefail").dialog("open");
						}
					}
				}, "json");
			});
			
			$('#TTModal_ok').click(function() {
				$.post("../AlarmConfigServlet", {
					"operation" : form_flag,
					"alarmKey" : $('#key').val(),
					"itemKey" : "TT",
					"itemValue" : $('#TT').val()
				}, function(data) {
					if (data.success == true) {
						$.post("../AlarmConfigServlet", {
							"operation" : "queryAllAlarmCombine"
						}, function(data) {
							combinedata = data;
							$('#form_combine_table').find('tbody').empty()
							var key = $('#key').val();
							$.each(data, function(index, d) {
								if (index == key) {
									initCombineTable(d);
								}
							});
						}, "json");
						$('#TTModal').modal('hide');
						if (form_flag == "addAlarmCombine") {
							$("#dialog_addsuccess").dialog("open");
						} else {
							$("#dialog_updatesuccess").dialog("open");
						}
					} else {
						$('#TTModal').modal('hide');
						if (form_flag == "addAlarmCombine") {
							$("#dialog_addfail").dialog("open");
						} else {
							$("#dialog_updatefail").dialog("open");
						}
					}
				}, "json");
			});
			
			$('#form_combine_table').find("a[title='delete']").live('click',
					function() {
						form_flag = "removeAlarmCombine";
						var $tds = $(this).parents('tr:first').find('td');
						$.post('../AlarmConfigServlet',{
							"operation":form_flag,
							"alarmKey" : $('#key').val(),
							"itemKey" : $($tds[0]).text(),
							"itemValue" : $($tds[1]).text()
						},function(data){
							if(data.success==true){
								$.post("../AlarmConfigServlet", {
									"operation" : "queryAllAlarmCombine"
								}, function(data) {
									combinedata = data;
									$('#form_combine_table').find('tbody').empty()
									var key = $('#key').val();
									$.each(data, function(index, d) {
										if (index == key) {
											initCombineTable(d);
										}
									});
								}, "json");
								$("#dialog_deletesuccess").dialog("open");
							}else{
								$("#dialog_deletefail").dialog("open");
							}
						},"json");
					});

			$('#key').change(function() {
				var key = $(this).val();
				initCombineTable(combinedata[key]);
			});

			// 添加监测量条件
			$('#add_T').click(function() {
				form_flag = "addAlarmElement";
				$('#form_base').find('form')[0].reset();
				$('#v0').val(TMax);
			});

			// 添加工况条件
			$('#add_C').click(function() {
				form_flag = "addAlarmElement";
				$('#form_base').find('form')[0].reset();
				$('#v0').val(CMax);
			});

			// 编辑
			$('#form_base_table').find("a[title='edit']").live(
					'click',
					function() {
						form_flag = "updateAlarmElement";
						var $tds = $(this).parents('tr:first').find('td');
						for (var i = 0; i < $tds.length - 1; i++) {
							var $td = $($tds[i]);
							var value = $td.text().trim();
							if (i == 0) {
								$("#v" + i).val(value);
							} else if (i == 1 || i == 3) {
								$("#v" + i).find(
										'option[value="' + value + '"]').attr(
										"selected", "selected");
							} else {
								$("#v" + i).val(value);
							}
						}
					});

			// 删除
			$('#form_base_table').find("a[title='delete']").live(
					'click',
					function() {
						var key = $(this).parents('tr:first').find('td:first')
								.text().trim();
						$.post("../AlarmConfigServlet", {
							"operation" : "deleteAlarmElement",
							"key" : key
						}, function(data) {
							if (data.success == true) {
								$.post("../AlarmConfigServlet", {
									"operation" : "queryAll"
								}, function(data) {
									initBaseTable(data);
								}, "json");
								$("#dialog_deletesuccess").dialog("open");
							} else if (data.success == false) {
								$("#dialog_deletefail").dialog("open");
							}
						}, "json");
					});

			// 提交新增或更新的表单
			$('#form_base').find("button[title='ok']").click(function() {
				var flag = $('#form_base').find('form').valid();
				if (flag == true) {
					var key = $('#v0').val();
					var value = "";
					for (var i = 1; i < 7; i++) {
						value = value + $('#v' + i).val().trim() + ",";
					}
					value = value.substring(0, value.length - 1);
					$.post("../AlarmConfigServlet", {
						"operation" : form_flag,
						"key" : key,
						"value" : value
					}, function(data) {
						$('#form_base').modal('hide');
						if (data.success == true) {
							$.post("../AlarmConfigServlet", {
								"operation" : "queryAll"
							}, function(data) {
								initBaseTable(data);
							}, "json");
							if (form_flag == "updateAlarmElement") {
								$("#dialog_updatesuccess").dialog("open");
							} else if (form_flag == "addAlarmElement") {
								$("#dialog_addsuccess").dialog("open");
							}
						} else {
							if (form_flag == "updateAlarmElement") {
								$("#dialog_updatefail").dialog("open");
							} else if (form_flag == "addAlarmElement") {
								$("#dialog_addfail").dialog("open");
							}
						}
					}, "json");
				}
			});

			// 添加成功提示窗口
			$("#dialog_addsuccess").dialog({
				dialogClass : 'ui-dialog-blue',
				autoOpen : false,
				resizable : false,
				modal : true,
				buttons : [ {
					"text" : "关闭",
					'class' : 'btn green',
					click : function() {
						$(this).dialog("close");
					}
				} ]
			});

			// 添加失败提示窗口
			$("#dialog_addfail").dialog({
				dialogClass : 'ui-dialog-red',
				autoOpen : false,
				resizable : false,
				modal : true,
				buttons : [ {
					"text" : "关闭",
					'class' : 'btn green',
					click : function() {
						$(this).dialog("close");
					}
				} ]
			});

			// 修改成功提示窗口
			$("#dialog_updatesuccess").dialog({
				dialogClass : 'ui-dialog-blue',
				autoOpen : false,
				resizable : false,
				modal : true,
				buttons : [ {
					"text" : "关闭",
					'class' : 'btn green',
					click : function() {
						$(this).dialog("close");
					}
				} ]
			});

			// 修改失败提示窗口
			$("#dialog_updatefail").dialog({
				dialogClass : 'ui-dialog-red',
				autoOpen : false,
				resizable : false,
				modal : true,
				buttons : [ {
					"text" : "关闭",
					'class' : 'btn green',
					click : function() {
						$(this).dialog("close");
					}
				} ]
			});

			// 删除成功提示窗口
			$("#dialog_deletesuccess").dialog({
				dialogClass : 'ui-dialog-blue',
				autoOpen : false,
				resizable : false,
				modal : true,
				buttons : [ {
					"text" : "关闭",
					'class' : 'btn green',
					click : function() {
						$(this).dialog("close");
					}
				} ]
			});

			// 删除失败提示窗口
			$("#dialog_deletefail").dialog({
				dialogClass : 'ui-dialog-red',
				autoOpen : false,
				resizable : false,
				modal : true,
				buttons : [ {
					"text" : "关闭",
					'class' : 'btn green',
					click : function() {
						$(this).dialog("close");
					}
				} ]
			});

			$("#dialog_CCexist").dialog({
				dialogClass : 'ui-dialog-red',
				autoOpen : false,
				resizable : false,
				modal : true
			});

			$("#dialog_TTexist").dialog({
				dialogClass : 'ui-dialog-red',
				autoOpen : false,
				resizable : false,
				modal : true
			});

		}

	};

}();