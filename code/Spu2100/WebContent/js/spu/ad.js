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
				$('#AD_key').empty();
				jsondata = data;
				var i = 0;
				for ( var config in data) {
					$('#AD_key').append($('<option>').text(config));
					// 填充表单
					if (i == 0) {
						// 选中第一个
						$("#AD_key").first().attr("selected", "selected");
						fillForm(jsondata[config]);
						i++;
					}
				}

			}, "json");

			// 下拉列表change事件
			$('#AD_key').change(function() {
				var key = $(this).val();
				var items = jsondata[key];
				fillForm(items);
			});

			// 填充表单数据
			function fillForm(items) {
				for ( var i in items) {
					var name = i;
					var value = items[i];
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
			$('#cancel').live(
					'click',
					function() {
						var key = $('#AD_key').val();
						var items = jsondata[key];
						fillForm(items);

						$("#AD form").find("select").attr("disabled",
								"disabled");
						$("#AD form").find("input")
								.attr("disabled", "disabled");
						$("#AD_key").removeAttr("disabled");
						$('#AD .form-actions').hide();
					});

			// 编辑
			$('#edit').live('click', function() {
				$("#AD form").find("select").removeAttr("disabled");
				$("#AD form").find("input").removeAttr("disabled");
				$("#AD_key").attr("disabled", "disabled");
				$('#AD .form-actions').show();
			});

			// 保存
			$('#save').live(
					'click',
					function() {
						var data = $('#AD form').serialize();
						var key = $('#AD_key').val();
						var array = data.split('&');
						$.post('../SetupConfServlet?operation=update&key='
								+ key, data, function(data) {
							alert(data.msg);
							if (data.success == true) {
								// 请求数据
								$.post("../SetupConfServlet", {
									"operation" : "query",
									"key" : "AD",
									"type" : "multi"
								}, function(data) {
									$('#AD_key').empty();
									jsondata = data;
									var i = 0;
									for ( var config in data) {
										$('#AD_key').append(
												$('<option>').text(config));
										if(key==config){
											$("#AD_key").find("option:contains('"+key+"')").attr("selected",
											"selected");
											fillForm(jsondata[config]);
										}
									}

								}, "json");
							} else {
								fillForm(jsondata[key]);
							}
							$("#AD form").find("select").attr("disabled",
									"disabled");
							$("#AD form").find("input").attr("disabled",
									"disabled");
							$("#AD_key").removeAttr("disabled");
							$('#AD .form-actions').hide();

						}, "json");
					});

		}
	};

}();