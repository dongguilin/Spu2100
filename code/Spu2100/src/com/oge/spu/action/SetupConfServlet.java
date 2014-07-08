package com.oge.spu.action;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import net.sf.json.JSONObject;

import com.oge.spu.bean.Config;
import com.oge.spu.util.ConfigUtil;
import com.oge.spu.util.Constants;

/**
 * Servlet implementation class SetupConfServlet
 */
public class SetupConfServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
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
		response.setContentType("text/html;charset=utf-8");
		String operation=request.getParameter("operation");
		if(operation.equals("query")){
			query(request,response);
		}else if(operation.equals("add")){
			add(request,response);
		}else if(operation.equals("update")){
			update(request,response);
		}else if(operation.equals("delete")){
			delete(request,response);
		}
	}
	
	private void query(HttpServletRequest request, HttpServletResponse response) throws IOException{
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
			Map<String,Map<String,String>> maps=ConfigUtil.load(key);
			data=JSONObject.fromObject(maps).toString();
		}
		response.getWriter().write(data);
		response.getWriter().flush();
	}
	
	private void add(HttpServletRequest request, HttpServletResponse response) throws IOException{
		@SuppressWarnings("unchecked")
		Map<String,String> map=request.getParameterMap();
		Map<String,String> itemMap=new LinkedHashMap<String, String>();
		
		Iterator<String> iter=map.keySet().iterator();
		while(iter.hasNext()){
			String key=iter.next();
			itemMap.put(key, request.getParameter(key));
		}
		String key=itemMap.get("key");
		itemMap.remove("operation");
		itemMap.remove("key");
		
		boolean result=ConfigUtil.addConfig(key, itemMap);
		Map<String,Object> maps = new HashMap<String,Object>();
		if(result){
			maps.put("success", true);
			maps.put("msg", "添加成功！");
		}else{
			maps.put("success", false);
			maps.put("msg", "添加失败！");
		}
		response.getWriter().write(JSONObject.fromObject(maps).toString());
	}
	
	private void delete(HttpServletRequest request, HttpServletResponse response) throws IOException{
		String key = request.getParameter("key");
		boolean result=ConfigUtil.deleteConfig(key);
		Map<String,Object> maps = new HashMap<String,Object>();
		if(result){
			maps.put("success", true);
			maps.put("msg", "删除成功！");
		}else{
			maps.put("success", false);
			maps.put("msg", "删除失败！");
		}
		response.getWriter().write(JSONObject.fromObject(maps).toString());
	}
	
	private void update(HttpServletRequest request, HttpServletResponse response) throws IOException{
		@SuppressWarnings("unchecked")
		Map<String,String> map=request.getParameterMap();
		Map<String,String> itemMap=new LinkedHashMap<String, String>();
		
		Iterator<String> iter=map.keySet().iterator();
		while(iter.hasNext()){
			String key=iter.next();
			itemMap.put(key, request.getParameter(key));
		}
		String key=itemMap.get("key");
		itemMap.remove("key");
		itemMap.remove("operation");
		
		boolean result=ConfigUtil.updateConfig(key, itemMap);
		Map<String,Object> maps = new HashMap<String,Object>();
		if(result){
			maps.put("success", true);
			maps.put("msg", "更新成功！");
		}else{
			maps.put("success", false);
			maps.put("msg", "更新失败！");
		}
		response.getWriter().write(JSONObject.fromObject(maps).toString());
	}

}
