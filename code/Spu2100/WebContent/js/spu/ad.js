var AD = function() {

	return {
		init : function() {

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
					var $select = $("#AD form").find(
							"select[name=" + name + "]");
					$select.attr("disabled", "disabled");
					$select.find('option[value="' + value + '"]').attr({
						"selected" : "selected"
					});
					$("#AD form").find("input[name=" + name + "]").val(value)
							.attr("disabled", "disabled");
				}
			}

			// 取消
			$('#AD .form-actions button[title="cancel"]').live(
					'click',
					function() {
						var key = $('#AD_key').val();
						var items = jsondata[key].items;
						fillForm(items);

						$("#AD form").find("select").attr("disabled",
								"disabled");
						$("#AD form").find("input")
								.attr("disabled", "disabled");
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
								$('#AD_key')
										.remove(
												$('#AD_key option[text="' + key
														+ '"]'));
								console.log($(
										'#AD_key option[text="' + key + '"]')
										.text());
								delete jsondata.key;
								$("#AD_key").first().attr("selected",
										"selected");
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
						$.post('../SetupConfServlet?operation=update&key='
								+ key, data, function(data) {
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
	};

}();