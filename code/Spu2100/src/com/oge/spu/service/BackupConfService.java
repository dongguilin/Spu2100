package com.oge.spu.service;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.io.OutputStream;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import jodd.io.FileUtil;

import com.oge.spu.util.ProUtil;
import com.oge.spu.util.ZipUtil;

public class BackupConfService {

	/**
	 * 查询备份目录下的备份文件
	 * 
	 * @param key
	 *           
	 */
	public List<Map<String,String>> query(String key) {
		List<Map<String,String>> result = new LinkedList<Map<String,String>>();
		String path = ProUtil.getString(key);
		File dir = new File(path);
		if (dir.isDirectory() && dir.canRead()) {
			File[] files = dir.listFiles(new FileFilter() {
				@Override
				public boolean accept(File pathname) {
					if (pathname.isDirectory()) {
						return true;
					}
					return false;
				}
			});
			
			String name="";
			if(key.equals("setup_backup")){
				name="setup.conf";
			}else if(key.equals("channel_backup")){
				name="channel.conf";
			}

			for (File f : files) {
				File confFile=new File(f.getAbsoluteFile()+File.separator+name);
				Map<String,String> map = new LinkedHashMap<String, String>();
				map.put("dir", f.getName());
				map.put("size", confFile.length()+"");
				map.put("name", name);
				result.add(map);
			}
		}
		return result;
	}

	/**
	 * 下载备份
	 * 
	 * @param key
	 *            setup_backup/channel_backup
	 * @param dirname
	 *            备份文件夹名称
	 * @param output
	 *            输出流
	 * @throws Exception 
	 */
	public void download(String key, File file, OutputStream output)
			throws IOException {
//		String path = ProUtil.getString(key) + File.separator + dirname;
		ZipUtil.zip(file, output);
//		File file = new File(path+"/setup.conf");
//		System.out.println(file.getAbsolutePath());
//		BufferedInputStream input = null;
//		try {
//			input = new BufferedInputStream(new FileInputStream(file));
////			IOUtils.copy(input, output);
//			byte[] buff=new byte[1000];
//			int length=-1;
//			while((length=input.read(buff))!=-1){
//				output.write(buff,0,length);
//			}
//		} catch (IOException e) {
//			throw e;
//		} finally {
//			if (input != null) {
//				try {
//					input.close();
//				} catch (IOException e) {
//					input = null;
//					throw e;
//				}
//			}
//		}
	}

	/**
	 * 删除备份
	 * 
	 * @param key
	 * @param dirname
	 * @throws IOException
	 */
	public void delete(String key, String dirname) throws IOException {
		String path = ProUtil.getString(key) + File.separator + dirname;
		File file = new File(path);
		FileUtil.deleteDir(file);
	}

}
