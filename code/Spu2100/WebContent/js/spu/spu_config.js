var SpuConfig = function() {

	return {

		// main function to initiate the module
		init : function() {

			var base = [ "DeviceInfo", "Serial" ];
			base.forEach(function(key) {
				$('a[href="#' + key + '"]').click(function() {
					baseForm(key);
				});
			});

			$('a[href="#AD"]').click(function() {
				AD();
			});

			$('a[href="#IO"]').click(function() {
				IO();
			});

		},

	};

	function baseForm(key) {
		// 存储json数据
		var jsondata = {};

		// 请求数据
		$.post("../SetupConfServlet", {
			"operation" : "query",
			"key" : key,
			"type" : "single"
		}, function(data) {
			jsondata = data;
			// 填充表单
			fillForm(jsondata.items);

		}, "json");

		// 填充表单数据
		function fillForm(items) {
			for ( var i in items) {
				var item = items[i];
				var name = item.name;
				var value = item.value;
				$("#" + key + " form").find("input[name=" + name + "]").val(
						value).attr("disabled", "disabled");
			}
		}

		// 编辑
		$('#' + key + ' .actions a[title="edit"]').live('click', function() {
			$("#" + key + " form").find("input").removeAttr("disabled");
			$('#"+key+" .form-actions').show();
		});

		// 取消
		$('#' + key + ' .form-actions button[title="cancel"]').live(
				'click',
				function() {
					var items = jsondata.items;
					fillForm(items);
					$("#" + key + " form").find("input").attr("disabled",
							"disabled");
					$('#' + key + ' .form-actions').hide();
				});

		// 保存
		$('#' + key + ' .form-actions button[title="ok"]').live(
				'click',
				function() {
					var data = $('#' + key + ' form').serialize();
					var array = data.split('&');
					$.post('../SetupConfServlet?operation=update&key=' + key,
							data, function(data) {
								var items = jsondata.items;
								if (data.success == true) {
									var index = 0;
									for ( var i in items) {
										var item = items[i];
										item.value = array[i].split('=')[1];
										index++;
									}
								} else {
									fillForm(items);
								}
								$("#" + key + " form").find("input").attr(
										"disabled", "disabled");
								$('#' + key + ' .form-actions').hide();

								alert(data.msg);
							}, "json");
				});
	}

	// 模拟通道配置
	function AD() {
		// 存储json数据
		var jsondata = {};

		// 请求数据
		$.post("../SetupConfServlet", {
			"operation" : "query",
			"key" : "AD",
			"type" : "multi"
		}, function(data) {
			jsondata = data;
			var i = 0;
			for ( var config in data) {
				$('#AD_key').append($('<option>').text(config));

				// 选中第一个
				$("#AD_key").first().attr("selected", "selected");
				// 填充表单
				if (i == 0) {
					fillForm(jsondata[config].items);
					i++;
				}
			}

		}, "json");

		// 下拉列表change事件
		$('#AD_key').change(function() {
			var key = $(this).val();
			var items = jsondata[key].items;
			fillForm(items);
		});

		// 填充表单数据
		function fillForm(items) {
			for ( var i in items) {
				var item = items[i];
				var name = item.name;
				var value = item.value;
				var $select = $("#AD form").find("select[name=" + name + "]");
				$select.attr("disabled", "disabled");
				$select.find('option[value="' + value + '"]').attr({
					"selected" : "selected"
				});
				$("#AD form").find("input[name=" + name + "]").val(value).attr(
						"disabled", "disabled");
			}
		}

		// 取消
		$('#AD .form-actions button[title="cancel"]').live('click', function() {
			var key = $('#AD_key').val();
			var items = jsondata[key].items;
			fillForm(items);

			$("#AD form").find("select").attr("disabled", "disabled");
			$("#AD form").find("input").attr("disabled", "disabled");
			$("#AD_key").removeAttr("disabled");
			$('#AD .form-actions').hide();
		});

		// 编辑
		$('#AD .actions a[title="edit"]').live('click', function() {
			$("#AD form").find("select").removeAttr("disabled");
			$("#AD form").find("input").removeAttr("disabled");
			$("#AD_key").attr("disabled", "disabled");
			$('#AD .form-actions').show();
		});

		// 删除
		$('#AD .actions a[title="del"]').live(
				'click',
				function() {
					var key = $('#AD_key').val();
					$.post('../SetupConfServlet', {
						"operation" : "delete",
						"key" : key
					}, function(data) {
						alert(data.msg);
						if (data.success == true) {
							// $('#AD_key option[text="'+key+'"]').remove();
							$('#AD_key').remove(
									$('#AD_key option[text="' + key + '"]'));
							console.log($('#AD_key option[text="' + key + '"]')
									.text());
							delete jsondata.key;
							$("#AD_key").first().attr("selected", "selected");
							console.log(jsondata);
						}
					}, "json");
				});

		// 保存
		$('#AD .form-actions button[title="ok"]').live(
				'click',
				function() {

					var data = $('#AD form').serialize();
					var key = $('#AD_key').val();
					var array = data.split('&');
					$.post('../SetupConfServlet?operation=update&key=' + key,
							data, function(data) {
								var items = jsondata[key].items;
								if (data.success == true) {
									var index = 0;
									for ( var i in items) {
										var item = items[i];
										item.value = array[i].split('=')[1];
										index++;
									}
								} else {
									fillForm(items);
								}
								$("#AD form").find("select").attr("disabled",
										"disabled");
								$("#AD form").find("input").attr("disabled",
										"disabled");
								$("#AD_key").removeAttr("disabled");
								$('#AD .form-actions').hide();

								alert(data.msg);
							}, "json");
				});
	}

	// 开关通道配置
	function IO() {
		$.post("../SetupConfServlet", {
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
				var itemsObj = jsonObj[key].items[0];
				var $tr = $('<tr>');
				var $key = $('<td>').text(key);
				var $isconfig = $('<td><select class="small m-wrap" name="isconfig">'
						+ '<option value="True">开</option><option value="False">关</option></select></td>');
				$isconfig.find('option[value="' + itemsObj.value + '"]').attr({
					"selected" : "selected"
				});
				$isconfig.find('select').attr("disabled", "disabled");
				var $control = $('<td><a title="edit" class="btn red" href="javascript:;">编辑</a></td>');
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
							$tr.find('td')[2].innerHTML = '<a title="save" class="btn red" href="javascript:;" >保存</a>'
									+ '<a title="cancel" class="btn green" href="javascript:;">取消</a>';

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

			$tds[2].innerHTML = '<td><a title="edit" class="btn red" href="javascript:;">编辑</a></td>';
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
			$.post("../SetupConfServlet",
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
							$tds[2].innerHTML = '<td><a title="edit" class="btn red" href="javascript:;">编辑</a></td>';
						} else {
							resetRow();
						}
						resetLastEditObj();
						alert(obj.msg);
					}, "json");

		});
	}

}();