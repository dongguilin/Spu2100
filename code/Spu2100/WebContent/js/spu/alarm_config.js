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
			// 选中的通道号
			var selected_td_num = "0";

			// 加载基本元素配置信息
			$.post("../AlarmConfigServlet", {
				"operation" : "queryAllAlarmElement"
			}, function(data) {
				elementData = data;
				initElementTable();
				// 加载组合元素配置信息
				$.post("../AlarmConfigServlet", {
					"operation" : "queryAllAlarmCombine"
				}, function(data) {
					combinedata = data;
					initCombineTable();
				}, "json");
			}, "json");

			// 基本元素通道切换处理
			$("#td_num").change(function() {
				selected_td_num = $(this).val();
				initElementTable();
				initCombineTable();
			});

			// 添加工况条件
			$('#add_T').click(function() {
				form_flag = "addAlarmElement";
				$('#form_base').find('form')[0].reset();
				var td = $("#td_num").val();
				
				var data=elementData[selected_td_num];
				if(!data["T0"]){
					$('#v0').val("T0");
				}else{
					$('#v0').val(TMax[td]);
				}
				$('#v1').val(td);// 通道号
			});

			// 添加监测量条件
			$('#add_C').click(function() {
				form_flag = "addAlarmElement";
				$('#form_base').find('form')[0].reset();
				var td = $("#td_num").val();
				
				var data=elementData[selected_td_num];
				if(!data["C0"]){
					$('#v0').val("C0");
				}else{
					$('#v0').val(CMax[td]);
				}
				$('#v1').val(td);// 通道号
			});

			// 编辑基本元素
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

			// 删除基本元素
			$('#form_base_table').find("a[title='delete']").live(
					'click',
					function() {
						var key = $(this).parents('tr:first').find('td:first')
								.text().trim();
						$.post("../AlarmConfigServlet", {
							"operation" : "deleteAlarmElement",
							"alarmKey" : $("#td_num").val(),
							"itemKey" : key
						}, function(data) {
							if (data.success == true) {
								// 加载基本元素配置信息
								$.post("../AlarmConfigServlet", {
									"operation" : "queryAllAlarmElement"
								}, function(data) {
									elementData = data;
									initElementTable();
									// 加载组合元素配置信息
									$.post("../AlarmConfigServlet", {
										"operation" : "queryAllAlarmCombine"
									}, function(data) {
										combinedata = data;
										initCombineTable();
									}, "json");
								}, "json");
								$("#dialog_deletesuccess").dialog("open");
							} else if (data.success == false) {
								$("#dialog_deletefail").dialog("open");
							}
						}, "json");
					});

			// 新增或修改基本元素
			$('#form_base').find("button[title='ok']").click(function() {
				var flag = $('#form_base').find('form').valid();
				if (flag == true) {
					var key = $('#v0').val();
					var value = "";
					for (var i = 1; i < 7; i++) {
						var v = $('#v' + i).val().trim();
						if (v == "") {
							v = "0";
						}
						value = value + v + ",";
					}
					value = value.substring(0, value.length - 1);

					$.post("../AlarmConfigServlet", {
						"operation" : form_flag,
						"alarmKey" : $("#v1").val(),
						"itemKey" : key,
						"value" : value
					}, function(data) {
						$('#form_base').modal('hide');
						if (data.success == true) {
							// 加载基本元素配置信息
							$.post("../AlarmConfigServlet", {
								"operation" : "queryAllAlarmElement"
							}, function(data) {
								elementData = data;
								initElementTable();
								// 加载组合元素配置信息
								$.post("../AlarmConfigServlet", {
									"operation" : "queryAllAlarmCombine"
								}, function(data) {
									combinedata = data;
									initCombineTable();
								}, "json");
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

			/**
			 * 根据选中的通道号构建基本报警元素数据表格
			 */
			function initElementTable() {
				var items = elementData[selected_td_num];
				var $tbody = $('#form_base_table').find('tbody').empty();
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

			/**
			 * 根据选中的通道号构建组合报警配置数据表格
			 */
			function initCombineTable() {
				var $tbody = $('#form_combine_table').find('tbody').empty();
				$
						.each(
								combinedata,
								function(index, d) {
									if (index == selected_td_num) {
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
										return false;
									}
								});
			}

			//编辑组合元素
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

			// 添加工况组合元素
			$('#add_TT').click(function() {
				var data=elementData[selected_td_num];
				if(!data["T0"]){
					$('#dialog_T_item_noexist').dialog("open");
					return;
				}
				form_flag = "addAlarmCombine";
				if (combinedata[selected_td_num]['TT']) {
					$('#dialog_TTexist').dialog("open");
				} else {
					$('#TTModal').modal('show');
					form_flag = "addAlarmCombine";
					$('#TTModal').find('form')[0].reset();
				}
			});

			/*$("#cc_del")
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
*/
			/*$("#dd_del")
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
							});*/

			function initTButtons() {
				var $tbuttons = $("#tbuttons").empty();
				var tmax = TMax[$("#td_num").val()];
				if (!tmax) {
					//TMax[$("#td_num").val()] = "T1";
					tmax = "T1";
				}
				tmax = tmax.substring(1);
				for (var i = 0; i < tmax; i++) {
					var value = "T" + i;
					var id=selected_td_num+"_"+value;
					$a = $("<a>").text(value).attr({
						"id" : id,
						"class" : "btn purple-stripe",
						"href" : "javascript:;"
					});
					$tbuttons.append($a);
//					$("#"+id).live('click', function(e) {
//						var text = $("#TT").val().trim();
//						text = text + $(this).text();
//						$("#TT").val(text);
//					});
				}
			}

			function initCButtons() {
				var $cbuttons = $("#cbuttons").empty();
				var cmax = CMax[$("#td_num").val()];
				if (!cmax) {
					//CMax[$("#td_num").val()] = "C1";
					cmax = "C1";
				}
				cmax = cmax.substring(1);
				for (var i = 0; i < cmax; i++) {
					var value = "C" + i;
					var id=selected_td_num+"_"+value;
					$a = $("<a>").text(value).attr({
						"id" : id,
						"class" : "btn purple-stripe",
						"href" : "javascript:;"
					});
//					$("#" + id).live('click', function(e) {
//						var text = $("#CC").val().trim();
//						text = text + $(this).text();
//						console.log($(this).text());
//						$("#CC").val(text);
//					});
					$cbuttons.append($a);
				}
			}

			// 添加监测量组合元素
			$('#add_CC').click(function() {
				var data=elementData[selected_td_num];
				if(!data["C0"]){
					$('#dialog_C_item_noexist').dialog("open");
					return;
				}
				form_flag = "addAlarmCombine";
				if (combinedata[selected_td_num]['CC']) {
					$('#dialog_CCexist').dialog("open");
				} else {
					$('#CCModal').modal('show');
					form_flag = "addAlarmCombine";
					$('#CCModal').find('form')[0].reset();
				}
			});

			$('#CCModal_ok').click(function() {
				var value=$('#CC').val();
				if(value.trim().length==0){
					return;
				}
				$.post("../AlarmConfigServlet", {
					"operation" : form_flag,
					"alarmKey" : selected_td_num,
					"itemKey" : "CC",
					"itemValue" : value
				}, function(data) {
					if (data.success == true) {
						// 加载组合元素配置信息
						$.post("../AlarmConfigServlet", {
							"operation" : "queryAllAlarmCombine"
						}, function(data) {
							combinedata = data;
							initCombineTable();
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
				var value=$('#TT').val();
				if(value.trim().length==0){
					return;
				}
				$.post("../AlarmConfigServlet", {
					"operation" : form_flag,
					"alarmKey" : selected_td_num,
					"itemKey" : "TT",
					"itemValue" : value
				}, function(data) {
					if (data.success == true) {
						// 加载组合元素配置信息
						$.post("../AlarmConfigServlet", {
							"operation" : "queryAllAlarmCombine"
						}, function(data) {
							combinedata = data;
							initCombineTable();
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

			//删除组合元素
			$('#form_combine_table').find("a[title='delete']").live(
					'click',
					function() {
						form_flag = "removeAlarmCombine";
						var $tds = $(this).parents('tr:first').find('td');
						$.post('../AlarmConfigServlet', {
							"operation" : form_flag,
							"alarmKey" : selected_td_num,
							"itemKey" : $($tds[0]).text(),
							"itemValue" : $($tds[1]).text()
						}, function(data) {
							if (data.success == true) {
								// 加载组合元素配置信息
								$.post("../AlarmConfigServlet", {
									"operation" : "queryAllAlarmCombine"
								}, function(data) {
									combinedata = data;
									initCombineTable();
								}, "json");
								$("#dialog_deletesuccess").dialog("open");
							} else {
								$("#dialog_deletefail").dialog("open");
							}
						}, "json");
					});
			
			$("#dialog_T_item_noexist").dialog({
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
			
			$("#dialog_C_item_noexist").dialog({
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