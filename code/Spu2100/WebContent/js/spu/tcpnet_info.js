var Tcpnet_info = function() {

	return {
		init : function() {

			//请求IP地址及端口信息
			$.post('../IfcfgServlet', function(data) {
				for ( var i in data) {
					$('div[title="ifcfg"]').find('span[title="' + i + '"]')
							.text(data[i]);
				}
			},"json");

		}
	};

}();