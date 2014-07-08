package com.oge.spu.action;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oge.spu.bean.BaseResultBean;
import com.oge.spu.service.LogFileService;
import com.oge.spu.util.ProUtil;

/**
 * Servlet implementation class LogFileServlet
 */
public class LogFileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private LogFileService service = new LogFileService();

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
		if(operation.equals("query")){
			query(request,response);
		}else if(operation.equals("download")){
			download(request,response);
		}
	}
	
	private void query(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String key = request.getParameter("key");
		BaseResultBean result = new BaseResultBean();
		String msg = null;
		try {
			msg = service.readAll(key);
			result.setSuccess(true);
		} catch (Exception ex) {
			ex.printStackTrace();
			msg = "读取配置出错！";
		} finally {
			result.setMsg(msg);
		}
		response.setContentType("text/html;charset=utf-8");
		response.getWriter().write(result.toJSONStr());	
		response.getWriter().flush();
	}
	
	private void download(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String key = request.getParameter("key");
		String path = ProUtil.getString(key);
		File file = new File(path);
		response.setContentType("application/octet-stream");
		response.setHeader("Content_Length", String.valueOf(file.length()));
		response.setHeader("Content-Disposition", "attachment; filename="
				+ file.getName());

		// 下载
		DataInputStream dis = new DataInputStream(new FileInputStream(file));
		byte[] bt = new byte[1024];
		int r = -1;
		while ((r = dis.read(bt)) != -1) {
			response.getOutputStream().write(bt, 0, r);
		}
		dis.close();
		response.getOutputStream().flush();
	}

}
