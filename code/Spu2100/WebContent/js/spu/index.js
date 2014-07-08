var Index = function() {

	return {

		// main function to initiate the module
		init : function() {

			// 请求系统版本信息
			$.post("InfoServlet", {
				"key" : "sys_version"
			}, function(data) {
				$('#sys_version').text(data.msg);
			}, "json");

			// 请求软件版本信息
			$.post("InfoServlet", {
				"key" : "spu2100_version"
			}, function(data) {
				$('#spu2100_version').text(data.msg);
			}, "json");

			//请求IP地址及端口信息
			$.post('IfcfgServlet', function(data) {
				for ( var i in data) {
					$('div[title="ifcfg"]').find('span[title="' + i + '"]')
							.text(data[i]);
				}
			},"json");

		}

	};

}();
