package com.oge.spu.action;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.oge.spu.service.UserService;

/**
 * Servlet implementation class UserServlet
 */
public class UserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private UserService userService = new UserService();

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
		if (operation.equals("add")) {
			add(request, response);
		} else if (operation.equals("update")) {
			update(request, response);
		} else if (operation.equals("delete")) {
			delete(request, response);
		} else if (operation.equals("queryAll")) {
			queryAll(request, response);
		} else if (operation.equals("queryInfo")) {
			queryInfo(request, response);
		}
	}

	private void add(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		boolean isExist = userService.isExist(username);
		Map<String, Object> maps = new HashMap<String, Object>();
		if (isExist) {
			maps.put("success", false);
			maps.put("msg", "已经存在该用户!");
		} else {
			try {
				userService.addUser(username, password);
				maps.put("success", true);
				maps.put("msg", "增加用户成功！");
			} catch (Exception e) {
				e.printStackTrace();
				maps.put("msg", "增加用户失败！");
			}
		}
		response.getWriter().write(JSONObject.fromObject(maps).toString());
	}

	private void update(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Map<String, Object> maps = new HashMap<String, Object>();
		String old_pwd = request.getParameter("old_pwd");
		String new_pwd = request.getParameter("new_pwd");
		String user = (String) request.getSession().getAttribute("user");
		if (userService.validate(user, old_pwd)) {
			boolean result = userService.updateUserPwd(user, new_pwd);
			maps.put("success", result);
			if (result) {
				maps.put("msg", "修改成功！");
				request.getSession().removeAttribute("user");
			} else {
				maps.put("msg", "修改失败！");
			}
		} else {
			maps.put("success", false);
			maps.put("msg", "输入的旧密码有误！");
		}
		response.getWriter().write(JSONObject.fromObject(maps).toString());
		response.getWriter().flush();
	}

	private void queryAll(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		List<String> users = userService.queryAll();
		JSONArray obj = JSONArray.fromObject(users);
		response.getWriter().write(obj.toString());
		response.getWriter().flush();
	}

	private void delete(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String username = request.getParameter("username");
		Map<String, Object> maps = new HashMap<String, Object>();
		boolean result = userService.delUser(username);
		maps.put("success", result);
		response.getWriter().write(JSONObject.fromObject(maps).toString());
	}

	private void queryInfo(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String user = (String) request.getSession().getAttribute("user");
		response.getWriter().write(user);
	}

}
