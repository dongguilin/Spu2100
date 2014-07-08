var Serial = function() {

	return {
		init : function() {
			
			var key = "Serial";

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
					$("#" + key + " form").find("input[name=" + name + "]")
							.val(value).attr("disabled", "disabled");
				}
			}

			// 编辑
			$('#' + key + ' .actions a[title="edit"]').live(
					'click',
					function() {
						$("#" + key + " form").find("input").removeAttr(
								"disabled");
						$("#"+key+" .form-actions").show();
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
						$.post('../SetupConfServlet?operation=update&key='
								+ key, data, function(data) {
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
	};

}();