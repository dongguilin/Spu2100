package com.oge.spu.action;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jodd.io.FileUtil;
import net.sf.json.JSONObject;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.oge.spu.util.ProUtil;

/**
 * Servlet implementation class UploadServlet
 */
public class UploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 * 
	 */
	@Override
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 * 
	 */
	@SuppressWarnings("unchecked")
	@Override
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		if (!ServletFileUpload.isMultipartContent(request)) {
			throw new IllegalArgumentException(
					"Request is not multipart, please 'multipart/form-data' enctype for your form.");
		}

		ServletFileUpload uploadHandler = new ServletFileUpload(
				new DiskFileItemFactory());
		response.setContentType("text/html;charset=utf-8");
		Map<String, Object> maps = new HashMap<String, Object>();
		boolean result = false;
		try {
			List<FileItem> items = uploadHandler.parseRequest(request);
			for (FileItem item : items) {
				if (!item.isFormField()) {
					handleUpload(item);
					result=true;
				}
			}
		} catch (FileUploadException e) {
			throw new RuntimeException(e);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
		
		maps.put("success", result);
		if (result) {
			maps.put("msg", "上传成功！");
		} else {
			maps.put("msg", "上传失败！");
		}
		String data = JSONObject.fromObject(maps).toString();
		response.getWriter().write(data);
		response.getWriter().flush();
	}

	private void handleUpload(FileItem item) throws Exception {
		String pattern = "yyyyMMddHHmm";
		SimpleDateFormat format = new SimpleDateFormat(pattern);
		String dirname = format.format(new Date());

		if (item.getName().equals("setup.conf")) {
			File src = new File(ProUtil.getString("setup"));
			File dest = new File(ProUtil.getString("setup_backup")
					+ File.separator + dirname + File.separator
					+ item.getName());
			FileUtil.copy(src, dest);
			File file = new File(ProUtil.getString("setup"));
			item.write(file);
		} else if (item.getName().equals("channel.conf")) {
			File src = new File(ProUtil.getString("channel"));
			File dest = new File(ProUtil.getString("channel_backup")
					+ File.separator + dirname + File.separator
					+ item.getName());
			FileUtil.copy(src, dest);
			File file = new File(ProUtil.getString("channel"));
			item.write(file);
		}
	}

}
