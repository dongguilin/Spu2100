package com.oge.spu.action;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oge.spu.bean.BaseResultBean;
import com.oge.spu.bean.MapResultBean;
import com.oge.spu.service.InfoService;
import com.oge.spu.util.ProUtil;

/**
 * Servlet implementation class InfoServlet
 */
public class InfoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private InfoService service = new InfoService();

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String key = request.getParameter("key");
		
		BaseResultBean result = new BaseResultBean();
		if(key.equals("spu2100_version")){
			String msg=null;
			try{
			   msg=service.getSpuVersionInfo();
			   result.setSuccess(true);
			}catch(Exception ex){
				msg="读取配置出错！";
			}finally{
				result.setMsg(msg);
			}
		}else if(key.equals("sys_version")){
			String msg=null;
			try{
			   msg=service.getSysVersionInfo();
			   result.setSuccess(true);
			}catch(Exception ex){
				msg="读取配置出错！";
			}finally{
				result.setMsg(msg);
			}
		}
		response.setContentType("text/html;charset=utf-8");
		response.getWriter().write(result.toJSONStr());
	}

}
