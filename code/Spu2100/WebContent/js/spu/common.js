var Common=function(){
	
	return {
		init:function(){
			
			$.post('/Spu2100/UserServlet',{"operation":"queryInfo"},function(data){
				$('span[class="username"]').text(data);
			});
			
			
		}
	};
	
}();