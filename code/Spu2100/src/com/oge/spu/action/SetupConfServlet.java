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

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;

import com.oge.spu.bean.Config;
import com.oge.spu.service.SetupConfigService;
import com.oge.spu.util.Constants;

/**
 * Servlet implementation class SetupConfServlet
 */
public class SetupConfServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private SetupConfigService service = new SetupConfigService();

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=utf-8");
		String operation = request.getParameter("operation");
		if (operation.equals("query")) {
			query(request, response);
		} else if (operation.equals("add")) {
			add(request, response);
		} else if (operation.equals("update")) {
			update(request, response);
		} else if (operation.equals("delete")) {
			delete(request, response);
		} else if (operation.equals("deleteJCL")) {
			deleteJCL(request,response);
		}
	}
	
	private void deleteJCL(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String key = request.getParameter("key");
		boolean result = service.deleteJCL(key);
		Map<String, Object> maps = new HashMap<String, Object>();
		if (result) {
			maps.put("success", true);
			maps.put("msg", "删除成功！");
		} else {
			maps.put("success", false);
			maps.put("msg", "删除失败！");
		}
		response.getWriter().write(JSONObject.fromObject(maps).toString());
	}

	private void query(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String key = request.getParameter("key");
		String type = request.getParameter("type");
		if (StringUtils.isEmpty(key) || StringUtils.isEmpty(type)) {
			return;
		}
		String data = "";
		if (type.equals(Constants.SINGLE_TYPE)) {
			Config config = service.loadSingleTypeConfig(key);
			data = JSONObject.fromObject(config).toString();
		} else if (type.equals(Constants.MULTI_TYPE)) {
			Map<String, Map<String, String>> maps = service
					.loadMultiTypeConfig(key);
			data = JSONObject.fromObject(maps).toString();
		}
		response.getWriter().write(data);
		response.getWriter().flush();
	}

	private void add(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		Map<String, String> itemMap = new LinkedHashMap<String, String>();
		String key = request.getParameter("key");
		if (key.startsWith("JCL")) {
			itemMap.put("monitorName", request.getParameter("monitorName"));
			itemMap.put("calcMethord", request.getParameter("calcMethord"));
			itemMap.put("DataSource", request.getParameter("DataSource"));
			itemMap.put("monitorUnit", request.getParameter("monitorUnit"));
			itemMap.put("MinValue", request.getParameter("MinValue"));
			itemMap.put("MaxValue", request.getParameter("MaxValue"));
			itemMap.put("Uploading", request.getParameter("Uploading"));
			itemMap.put("Upsequence", request.getParameter("Upsequence"));
			itemMap.put("UploadTime", request.getParameter("UploadTime"));
			itemMap.put("Upbdong", request.getParameter("Upbdong"));
			itemMap.put("MonitorCount", request.getParameter("MonitorCount"));
		} else if (key.startsWith("BX")) {
			itemMap.put("DataSource", request.getParameter("DataSource "));
			itemMap.put("MonitorFunction",
					request.getParameter("MonitorFunction"));
			itemMap.put("Uploading", request.getParameter("Uploading"));
			itemMap.put("UpQxLoading", request.getParameter("UpQxLoading"));
			itemMap.put("Upsequence", request.getParameter("Upsequence"));
			itemMap.put("BxCylc", request.getParameter("BxCylc"));
			itemMap.put("BxPoint", request.getParameter("BxPoint"));
		}
		boolean result = false;
		if (key.startsWith("JCL")) {
			result = service.addJCL(key, itemMap);
		} else if (key.startsWith("BX")) {
			result = service.addBX(key, itemMap);
		}
		Map<String, Object> maps = new HashMap<String, Object>();
		if (result) {
			maps.put("success", true);
			maps.put("msg", "添加成功！");
		} else {
			maps.put("success", false);
			maps.put("msg", "添加失败！");
		}
		response.getWriter().write(JSONObject.fromObject(maps).toString());
	}

	private void delete(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String key = request.getParameter("key");
		boolean result = service.delete(key);
		Map<String, Object> maps = new HashMap<String, Object>();
		if (result) {
			maps.put("success", true);
			maps.put("msg", "删除成功！");
		} else {
			maps.put("success", false);
			maps.put("msg", "删除失败！");
		}
		response.getWriter().write(JSONObject.fromObject(maps).toString());
	}

	private void update(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		@SuppressWarnings("unchecked")
		Map<String, String> map = request.getParameterMap();
		Map<String, String> itemMap = new LinkedHashMap<String, String>();

		Iterator<String> iter = map.keySet().iterator();
		while (iter.hasNext()) {
			String key = iter.next();
			itemMap.put(key, request.getParameter(key));
		}
		String key = itemMap.get("key");
		itemMap.remove("key");
		itemMap.remove("operation");

		boolean result = service.update(key, itemMap);
		Map<String, Object> maps = new HashMap<String, Object>();
		if (result) {
			maps.put("success", true);
			maps.put("msg", "更新成功！");
		} else {
			maps.put("success", false);
			maps.put("msg", "更新失败！");
		}
		response.getWriter().write(JSONObject.fromObject(maps).toString());
	}

}
