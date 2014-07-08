package com.oge.spu.action;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jodd.io.FileUtil;
import net.sf.json.JSONArray;

import com.oge.spu.bean.BaseResultBean;
import com.oge.spu.service.BackupConfService;
import com.oge.spu.util.ProUtil;

/**
 * 处理配置文件setup.conf和channel.conf的备份、下载、还原 Servlet implementation class
 * BackupConfServlet
 */
public class BackupConfServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private BackupConfService service = new BackupConfService();

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String operation = request.getParameter("operation");
		if (operation.equals("query")) {// 查询备份
			query(request, response);
		} else if (operation.equals("delete")) {// 删除备份
			delete(request, response);
		} else if (operation.equals("download")) {// 下载备份
			download(request, response);
		}else if(operation.equals("restore")){//还原备份
			restore(request, response);
		}
	}
	
	private void restore(HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String key = request.getParameter("key");
		String dir = request.getParameter("dir");
		String name = request.getParameter("name");
		String src = ProUtil.getString(key) + File.separator + dir
				+ File.separator + name;
		String str="";
		if(key.equals("setup_backup")){
			str="setup";
		}else if(key.equals("channel_backup")){
			str="channel";
		}
		String dest=ProUtil.getString(str);
		BaseResultBean result=new BaseResultBean();
		response.setContentType("text/html;charset=utf-8");
		try{
			FileUtil.copy(src, dest);
			result.setSuccess(true);
			result.setMsg("还原成功！");
		}catch(IOException e){
			result.setSuccess(false);
			result.setMsg("还原失败！");
		}
		response.getWriter().write(result.toJSONStr());
		response.getWriter().flush();
	}

	private void download(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String key = request.getParameter("key");
		String dir = request.getParameter("dir");
		String name = request.getParameter("name");
		String path = ProUtil.getString(key) + File.separator + dir
				+ File.separator + name;
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

	private void delete(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		response.setContentType("text/html;charset=utf-8");
		String key = request.getParameter("key");
		String dirname = request.getParameter("name");
		BaseResultBean result = new BaseResultBean();
		try {
			service.delete(key, dirname);
			result.setSuccess(true);
			result.setMsg("删除成功！");
		} catch (IOException e) {
			result.setSuccess(false);
			result.setMsg("删除失败！");
		} finally {
			response.getWriter().write(result.toJSONStr());
			response.getWriter().flush();
		}
	}

	private void query(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=utf-8");
		String key = request.getParameter("key");
		response.getWriter().write(
				JSONArray.fromObject(service.query(key)).toString());
		response.getWriter().flush();
	}

}
