package com.oge.spu.action;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;

import com.oge.spu.bean.Config;
import com.oge.spu.util.ConfigUtil;
import com.oge.spu.util.Constants;

/**
 * Servlet implementation class SjqbServlet
 */
public class SjqbServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String operation = request.getParameter("operation");
		response.setContentType("text/html;charset=utf-8");
		if(operation.equals("query")){
			query(request,response);
		}
		
	}
	
	private void query(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String key = request.getParameter("key");
		String type= request.getParameter("type");
		if(StringUtils.isEmpty(key)||StringUtils.isEmpty(type)){
			return;
		}
		
		String data="";
		if(type.equals(Constants.SINGLE_TYPE)){
			Config config = ConfigUtil.loadConfig(key);
			data=JSONObject.fromObject(config).toString();
		}else if(type.equals(Constants.MULTI_TYPE)){
			Map<String,Config> maps=ConfigUtil.loadConfigs(key);
			data=JSONObject.fromObject(maps).toString();
		}
		response.getWriter().write(data);
		response.getWriter().flush();
	}


}
