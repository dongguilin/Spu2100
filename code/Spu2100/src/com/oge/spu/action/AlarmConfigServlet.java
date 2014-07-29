package com.oge.spu.action;

import java.io.IOException;
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
		if (operation.equals("queryAllAlarmElement")) {
			queryAllAlarmElement(request, response);
		} else if (operation.equals("updateAlarmElement")) {
			addOrUpdateAlarmElement(request, response);
		} else if (operation.equals("addAlarmElement")) {
			addOrUpdateAlarmElement(request, response);
		} else if (operation.equals("deleteAlarmElement")) {
			deleteAlarmElement(request, response);
		} else if (operation.equals("queryAllAlarmCombine")) {
			queryAllAlarmCombine(request, response);
		} else if (operation.equals("addAlarmCombine")) {
			addAlarmCombine(request, response);
		} else if (operation.equals("removeAlarmCombine")) {
			removeAlarmCombine(request, response);
		} else if (operation.equals("updateAlarmCombine")) {
			updateAlarmCombine(request, response);
		}
	}

	private void updateAlarmCombine(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String alarmKey = request.getParameter("alarmKey");
		String itemKey = request.getParameter("itemKey");
		String itemValue = request.getParameter("itemValue");
		boolean flag = service.updateAlarmCombine(alarmKey, itemKey, itemValue);
		BaseResultBean result = new BaseResultBean();
		response.setContentType("text/html;charset=utf-8");
		result.setSuccess(flag);
		response.getWriter().write(JSONObject.fromObject(result).toString());
	}

	private void addAlarmCombine(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String alarmKey = request.getParameter("alarmKey");
		String itemKey = request.getParameter("itemKey");
		String itemValue = request.getParameter("itemValue");
		boolean flag = service.addAlarmCombine(alarmKey, itemKey, itemValue);
		BaseResultBean result = new BaseResultBean();
		response.setContentType("text/html;charset=utf-8");
		result.setSuccess(flag);
		response.getWriter().write(JSONObject.fromObject(result).toString());
	}

	private void removeAlarmCombine(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String alarmKey = request.getParameter("alarmKey");
		String itemKey = request.getParameter("itemKey");
		String itemValue = request.getParameter("itemValue");
		boolean flag = service.removeAlarmCombine(alarmKey, itemKey, itemValue);
		BaseResultBean result = new BaseResultBean();
		response.setContentType("text/html;charset=utf-8");
		result.setSuccess(flag);
		response.getWriter().write(JSONObject.fromObject(result).toString());
	}

	private void queryAllAlarmCombine(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<String, Map<String, String>> map = service.queryAllAlarmCombine();
		response.setContentType("text/html;charset=utf-8");
		response.getWriter().write(JSONObject.fromObject(map).toString());
	}

	private void deleteAlarmElement(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String alarmKey = request.getParameter("alarmKey");
		String itemKey = request.getParameter("itemKey");
		boolean flag = service.deleteAlarmElement(alarmKey, itemKey);
		BaseResultBean result = new BaseResultBean();
		response.setContentType("text/html;charset=utf-8");
		result.setSuccess(flag);
		response.getWriter().write(JSONObject.fromObject(result).toString());
	}

	private void addOrUpdateAlarmElement(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String alarmKey = request.getParameter("alarmKey");
		String itemKey = request.getParameter("itemKey");
		String value = request.getParameter("value");
		boolean flag = service
				.addOrUpdateAlarmElement(alarmKey, itemKey, value);
		BaseResultBean result = new BaseResultBean();
		response.setContentType("text/html;charset=utf-8");
		result.setSuccess(flag);
		response.getWriter().write(JSONObject.fromObject(result).toString());
	}

	private void queryAllAlarmElement(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		response.setContentType("text/html;charset=utf-8");
		response.getWriter().write(
				JSONObject.fromObject(service.queryAllAlarmElement())
						.toString());
	}

}
