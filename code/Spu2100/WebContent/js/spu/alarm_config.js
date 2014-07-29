var Alarm_config = function() {

	return {

		init : function() {

			// 基本元素数据
			var elementData = {};
			// 组合元素数据
			var combinedata = {};
			// 新增或修改的标志
			var form_flag = "";
			var CMax = {};
			var TMax = {};
			var selecttd="0";

			// 加载基本元素配置信息
			$.post("../AlarmConfigServlet", {
				"operation" : "queryAllAlarmElement"
			}, function(data) {
				initBaseTable(data);
			}, "json");

			// 加载组合元素配置信息
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

			// 基本元素通道切换处理
			$("#element_td")
					.change(
							function() {
								var td = $(this).val();
								selecttd=td;
								var items = elementData[td];
								var $tbody = $('#form_base_table')
										.find('tbody').empty();
								$
								.each(
										items,
										function(index, d) {
											if (index.indexOf('C') != -1) {
												CMax[d[0]] = "C"
														+ (Number(index.substring(1)) + 1);
											}
											if (index.indexOf('T') != -1) {
												TMax[d[0]] = "T"
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
								initCButtons();
								initTButtons();
								console.log(Ts);

							});

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
				var items = data[selecttd];
				elementData = data;
				$
						.each(
								items,
								function(index, d) {
									if (index.indexOf('C') != -1) {
										CMax[d[0]] = "C"
												+ (Number(index.substring(1)) + 1);
									}
									if (index.indexOf('T') != -1) {
										TMax[d[0]] = "T"
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
				initCButtons();
				initTButtons();
			}

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

			//添加工况组合元素
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

			$("#cc_del")
					.click(
							function() {
								var text = $("#CC").val().trim();
								var length = 1;
								if (text
										.substring(text.length - 1, text.length)
										.search(/[+*()]/) != -1) {
									length = 1;
								} else {
									if (text.substring(text.length - 1,
											text.length).search(/[0-9]/) != -1) {
										length = 2;
									}
									if (text.substring(text.length - 2,
											text.length - 1).search(/[0-9]/) != -1) {
										length = 3;
									}
								}
								text = text.substring(0, text.length - length);
								$("#CC").val(text);
							});

			$("#dd_del")
					.click(
							function() {
								var text = $("#TT").val().trim();
								var length = 1;
								if (text
										.substring(text.length - 1, text.length)
										.search(/[+*()]/) != -1) {
									length = 1;
								} else {
									if (text.substring(text.length - 1,
											text.length).search(/[0-9]/) != -1) {
										length = 2;
									}
									if (text.substring(text.length - 2,
											text.length - 1).search(/[0-9]/) != -1) {
										length = 3;
									}
								}
								text = text.substring(0, text.length - length);
								$("#TT").val(text);
							});

			function initTButtons() {
				var $tbuttons = $("#tbuttons").empty();
				var tmax=TMax[$("#element_td").val()];
				tmax=tmax.substring(1);
				for(var i=0;i<tmax;i++){
					var value="T"+i;
					$a = $("<a>").text(value).attr({
						"id" : value,
						"class" : "btn purple-stripe",
						"href" : "javascript:;"
					});
					$tbuttons.append($a);
					$("#" + value).live('click', function(e) {
						var text = $("#TT").val().trim();
						text = text + $(this).text();
						$("#TT").val(text);
					});
				}
			}

			function initCButtons() {
				var $cbuttons = $("#cbuttons").empty();
				var cmax=CMax[$("#element_td").val()];
				cmax=cmax.substring(1);
				for(var i=0;i<cmax;i++){
					var val="C"+i;
					$a = $("<a>").text(val).attr({
						"id" : val,
						"class" : "btn purple-stripe",
						"href" : "javascript:;"
					});
					$("#" + val).live('click', function(e) {
						var text = $("#CC").val().trim();
						console.log($(this)[0].id);
						text = text + $(this)[0].id;
						$("#CC").val(text);
					});
					$cbuttons.append($a);
				}
				
			}

			//添加监测量组合元素
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

			$('#form_combine_table').find("a[title='delete']").live(
					'click',
					function() {
						form_flag = "removeAlarmCombine";
						var $tds = $(this).parents('tr:first').find('td');
						$.post('../AlarmConfigServlet', {
							"operation" : form_flag,
							"alarmKey" : $('#key').val(),
							"itemKey" : $($tds[0]).text(),
							"itemValue" : $($tds[1]).text()
						}, function(data) {
							if (data.success == true) {
								$.post("../AlarmConfigServlet", {
									"operation" : "queryAllAlarmCombine"
								}, function(data) {
									combinedata = data;
									$('#form_combine_table').find('tbody')
											.empty()
									var key = $('#key').val();
									$.each(data, function(index, d) {
										if (index == key) {
											initCombineTable(d);
										}
									});
								}, "json");
								$("#dialog_deletesuccess").dialog("open");
							} else {
								$("#dialog_deletefail").dialog("open");
							}
						}, "json");
					});

			$('#key').change(function() {
				var key = $(this).val();
				initCombineTable(combinedata[key]);
			});

			// 添加工况条件
			$('#add_T').click(function() {
				form_flag = "addAlarmElement";
				$('#form_base').find('form')[0].reset();
				var td=$("#element_td").val();
				if(!TMax[td]){
					TMax[td]="T0";
				}
				$('#v0').val(TMax[td]);
				$('#v1').val(td);
			});

			// 添加监测量条件
			$('#add_C').click(function() {
				form_flag = "addAlarmElement";
				$('#form_base').find('form')[0].reset();
				var td=$("#element_td").val();
				if(!CMax[td]){
					CMax[td]="C0";
				}
				$('#v0').val(CMax[td]);
				$('#v1').val(td);
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
							"alarmKey":$("#element_td").val(),
							"itemKey" : key
						}, function(data) {
							if (data.success == true) {
								$.post("../AlarmConfigServlet", {
									"operation" : "queryAllAlarmElement"
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
						var v=$('#v' + i).val().trim();
						if(v==""){
							v="0";
						}
						value = value + v + ",";
					}
					value = value.substring(0, value.length - 1);
					$.post("../AlarmConfigServlet", {
						"operation" : form_flag,
						"alarmKey":$("#v1").val(),
						"itemKey" : key,
						"value" : value
					}, function(data) {
						$('#form_base').modal('hide');
						if (data.success == true) {
							$.post("../AlarmConfigServlet", {
								"operation" : "queryAllAlarmElement"
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