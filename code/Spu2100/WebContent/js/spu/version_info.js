var Version_info = function() {

	return {
		init : function() {

			// 请求系统版本信息
			$.post("../InfoServlet", {
				"key" : "sys_version"
			}, function(data) {
				$('#sys_version').text(data.msg);
			}, "json");

			// 请求软件版本信息
			$.post("../InfoServlet", {
				"key" : "spu2100_version"
			}, function(data) {
				$('#spu2100_version').text(data.msg);
			}, "json");

		}
	};

}();