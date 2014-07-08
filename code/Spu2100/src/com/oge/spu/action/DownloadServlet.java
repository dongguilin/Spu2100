package com.oge.spu.action;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class DownloadServlet
 */
public class DownloadServlet extends HttpServlet {
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
		// TODO Auto-generated method stub
		String filename = "d:/setup.conf";
		File file = new File(filename);

		if (file.getName().equals(".zip")) {
			response.setHeader("Content-type", "application/zip");
		} else if (file.getName().equals(".rar")) {
			response.setHeader("Content-type", "application/rar");
		} else if (file.getName().equals(".xls")) {
			response.setContentType("application/vnd.ms-excel;charset=GBK");
			response.setHeader("Content-type", "application/x-msexcel");
		} else {
			response.setContentType("application/octet-stream");
		}
		response.setHeader("Content_Length", String.valueOf(file.length()));
		response.setHeader("Content-Disposition", "attachment; filename="
				+ filename);

		// 下载输入内容
		FileInputStream input = new FileInputStream(file);
		DataInputStream dis = new DataInputStream(input);
		byte[] bt = new byte[1024];
		int r = -1;
		while ((r = dis.read(bt)) != -1) {
			response.getOutputStream().write(bt, 0, r);
		}
		response.getOutputStream().flush();
	}

}
