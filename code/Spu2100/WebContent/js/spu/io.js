var IO = function() {

	return {
		init : function() {
			
			var url="../SetupConfServlet";

			$.post(url, {
				"operation" : "query",
				"key" : "IO",
				"type" : "multi"
			}, function(data) {
				initTable(data);
			}, "json");

			// 存储上次编辑对象，一次只能有一行为编辑状态
			var lastEditObj = {
				"isEdit" : false,
				"tr" : null,
				"data" : {}
			};

			// 重置数据
			function resetLastEditObj() {
				lastEditObj.isEdit = false;
				lastEditObj.tr = null;
				lastEditObj.data = {};
			}

			// 根据后台返回的json数据初始化表格
			function initTable(jsonObj) {
				var $tbody = $('#IO').find('tbody').empty();
				for ( var key in jsonObj) {
					var itemsObj=jsonObj[key];
					var $tr = $('<tr>');
					var $key = $('<td>').text(key);
					var $isconfig = $('<td><select class="small m-wrap" name="isconfig">'
							+ '<option value="True">开</option><option value="False">关</option></select></td>');
					$isconfig.find('option[value="' + itemsObj.isconfig + '"]').attr({
						"selected" : "selected"
					});
					$isconfig.find('select').attr("disabled", "disabled");
					var $control = $('<td><a title="edit" href="javascript:;"><i class="icon-edit"></i>编辑</a></td>');
					$tr.append($key).append($isconfig).append($control);
					$tbody.append($tr);
				}
			}

			// 编辑，使行进入编辑状态
			$('#IO a[title="edit"]')
					.live(
							'click',
							function(e) {
								e.preventDefault();

								var isEdit = lastEditObj.isEdit;
								if (isEdit == true) {
									resetRow();
								}

								var $tr = $(this).parents('tr:first');
								$tr.find('select').removeAttr("disabled");
								$tr.find('td')[2].innerHTML = '<a title="save"  href="javascript:;"><i class="icon-save"></i>保存</a>'
										+ '&nbsp;&nbsp;&nbsp;<a title="cancel" href="javascript:;">取消</a>';

								lastEditObj.isEdit = true;
								lastEditObj.tr = $tr;
								lastEditObj.data = {
									"isconfig" : $tr.find('select').val()
								};
							});

			// 取消编辑状态
			$('#IO a[title="cancel"]').live('click', function(e) {
				e.preventDefault();

				resetRow();
			});

			// 重置行内容
			function resetRow() {
				var $tr = lastEditObj.tr;
				var $tds = $tr.find('td');
				var data = lastEditObj.data;

				$tds.find('option[value="' + data.isconfig + '"]').attr({
					"selected" : "selected"
				});
				$tds.find('select').attr('disabled', 'disabled');

				$tds[2].innerHTML = '<td><a title="edit" href="javascript:;"><i class="icon-edit"></i>编辑</a></td>';
				resetLastEditObj();
			}

			// 保存
			$('#IO a[title="save"]').live('click',function(e) {
				e.preventDefault();

				var data = {
					"operation" : "update"
				};
				var $tr = $(this).parents('tr:first');

				data.key = $tr.find('td:first').text();
				data.isconfig = $tr.find('select').val();
				$.post(url,
						data,
						function(obj) {
							if (obj.success == true) {
								var $tds = $tr.find('td');
								$tds.find('option[value="'
											+ data.isconfig
											+ '"]')
										.attr(
												{
													"selected" : "selected"
												});
								$tds.find('select').attr(
										"disabled",
										"disabled");
								$tds[2].innerHTML = '<td><a title="edit" href="javascript:;"><i class="icon-edit"></i>编辑</a></td>';
							} else {
								resetRow();
							}
							resetLastEditObj();
							alert(obj.msg);
						}, "json");

			});

		}
	};

}();