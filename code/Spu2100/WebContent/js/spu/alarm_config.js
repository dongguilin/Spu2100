var Alarm_config = function() {

	return {

		init : function() {

			$.post("../AlarmConfigServlet", {
				"operation" : "queryAll"
			}, function(data) {
				$.each(data,function(index,d){
					console.log(index);
					console.log(d);
				});
				
			}, "json");

		}

	};

}();