package com.oge.spu.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.RandomAccessFile;

import com.oge.spu.util.ProUtil;

/**
 * 日志文件
 * 
 * @author guilin
 *
 */
public class LogFileService {

	/**
	 * 读取文件所有内容，换行处加html的换行标签<br>
	 * 
	 * @param key
	 * @return
	 * @throws IOException
	 */
	public String readAll(String key) throws IOException {
		StringBuffer result = new StringBuffer();
		File file = new File(ProUtil.getString(key));
		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new InputStreamReader(
					new FileInputStream(file), "gb2312"));
			String temp = null;
			while ((temp = reader.readLine()) != null) {
				result.append(temp).append("<br>");
			}
		} catch (IOException e) {
			throw e;
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e) {
					throw e;
				} finally {
					reader = null;
				}
			}
		}
		return result.toString();
	}

	/**
	 * 读取文件最后至多2000字节的数据
	 * 
	 * @param key
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("resource")
	public String readLastContent(String key) throws Exception {
		String result = "";
		RandomAccessFile raf = null;
		try {
			File file = new File(ProUtil.getString(key));
			raf = new RandomAccessFile(file, "r");
			int buffsize = 2000;
			long length = file.length();
			long start = 0;
			if (length > buffsize) {
				start = length - buffsize;
			}
			raf.seek(start);// 定位到(length-buffsize)
			raf.readLine();// 读取一行

			byte[] buff = new byte[buffsize];
			while (raf.read(buff) != -1) {
				result = new String(buff, "GBK");
			}
		} catch (Exception e) {
			throw e;
		} finally {
			if (raf != null) {
				try {
					raf.close();
				} catch (IOException e) {
					throw e;
				} finally {
					raf = null;
				}
			}
		}
		return result;
	}

}
