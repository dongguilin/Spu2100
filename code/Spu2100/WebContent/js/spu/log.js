var Log=function(){
	
	return{
		
		//main function to initiate the module
		init:function(){
			
			$.post("../LogFileServlet",{"operation":"query","key":"em_new_log"},function(data){
				$("#em_new_log").html(data.msg);
			},"json");
		}
	};
	
}();