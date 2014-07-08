package com.oge.spu.action;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import com.oge.spu.util.ProUtil;

/**
 * Servlet implementation class IfcfgServlet
 */
public class IfcfgServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String device=ProUtil.getString("DEVICE");
		String onboot=ProUtil.getString("ONBOOT");
		String bootproto=ProUtil.getString("BOOTPROTO");
		String ipaddr=ProUtil.getString("IPADDR");
		String netmask=ProUtil.getString("NETMASK");
		String gateway=ProUtil.getString("GATEWAY");
		Map<String,String> maps = new HashMap<String,String>();
		maps.put("device", device);
		maps.put("onboot", onboot);
		maps.put("bootproto", bootproto);
		maps.put("ipaddr", ipaddr);
		maps.put("netmask", netmask);
		maps.put("gateway", gateway);
		JSONObject obj = JSONObject.fromObject(maps);
		response.getWriter().write(obj.toString());
	}

}
