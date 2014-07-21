package com.oge.spu.action;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import com.oge.spu.bean.BaseResultBean;
import com.oge.spu.service.AlarmConfigService;

/**
 * Servlet implementation class AlarmConfigServlet
 */
public class AlarmConfigServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private AlarmConfigService service = new AlarmConfigService();

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AlarmConfigServlet() {
		super();
	}

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
		if (operation.equals("add")) {
			add(request, response);
		} else if (operation.equals("queryAll")) {
			queryAll(request, response);
		}
	}

	private void add(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String alarmKey = request.getParameter("alarmKey");
		String itemKey = request.getParameter("itemKey");
		String itemValue = request.getParameter("itemValue");
		boolean flag = service.addAlarmItem(alarmKey, itemKey, itemValue);
		BaseResultBean result = new BaseResultBean();
		response.setContentType("text/html;charset=utf-8");
		result.setSuccess(flag);
		response.getWriter().write(JSONObject.fromObject(result).toString());
	}

	private void queryAll(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		System.out.println("hehe");
		response.setContentType("text/html;charset=utf-8");
		response.getWriter().write(
				JSONObject.fromObject(service.queryAllAlarmElement())
						.toString());
	}

}
