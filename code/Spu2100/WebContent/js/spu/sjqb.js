var Sjqb = function() {
	return {
		init : function() {

			var keys = [ "AD", "JCL", "BX" ];
			keys.forEach(function(key) {
				load(key);
			});

			function load(key) {
				$.post("../SjqbServlet", {
					"operation" : "query",
					"key" : key,
					"type" : "multi"
				}, function(data) {
					var $tbody = $("#" + key).find("tbody").empty();
					for ( var config in data) {
						var $tr = $('<tr>');
						$tr.append($('<td>').text(config));
						var items = data[config].items;
						for ( var i in items) {
							var item = items[i];
							$tr.append($('<td>').text(item.value));
						}
						$tbody.append($tr);
					}
				}, "json");
			}
		},

	};
}();