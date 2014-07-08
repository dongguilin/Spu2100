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

import com.oge.spu.util.ChannelConfUtil;
import com.oge.spu.util.ConfigUtil;

/**
 * Servlet implementation class ChannelConfServlet
 */
public class ChannelConfServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

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
		String operation = request.getParameter("operation");
		response.setContentType("text/html;charset=utf-8");
		if (operation.equals("queryAll")) {
			query(request, response);
		} else if (operation.equals("update")) {
			update(request, response);
		}
	}

	private void query(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		Map<String, Map<String, String>> map = ChannelConfUtil.loadAll();
		String data = JSONObject.fromObject(map).toString();
		response.getWriter().write(data);
		response.getWriter().flush();
	}

	private void update(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String key = request.getParameter("key");
		Map<String, String> itemMap = new LinkedHashMap<String, String>();
		itemMap.put("k", request.getParameter("k"));
		itemMap.put("B", request.getParameter("B"));

		boolean result = ChannelConfUtil.updateConfig(key, itemMap);

		Map<String, Object> maps = new HashMap<String, Object>();
		if (result) {
			maps.put("success", true);
			maps.put("msg", "更新成功！");
		} else {
			maps.put("success", false);
			maps.put("msg", "更新失败！");
		}
		String data = JSONObject.fromObject(maps).toString();
		response.getWriter().write(data);
		response.getWriter().flush();

	}

}
