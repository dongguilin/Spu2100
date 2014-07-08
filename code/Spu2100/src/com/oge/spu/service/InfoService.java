package com.oge.spu.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.List;

import org.apache.commons.io.IOUtils;

import com.oge.spu.util.ProUtil;

/**
 * 
 * @author guilin
 *
 */
public class InfoService {

	/**
	 * 获取Spu2100软件版本信息
	 * 
	 * @return
	 * @throws Exception
	 */
	public String getSpuVersionInfo() throws Exception {
		return this.getInfo("spu2100_version");
	}

	/**
	 * 获取Linux系统版本信息
	 * 
	 * @return
	 * @throws Exception
	 */
	public String getSysVersionInfo() throws Exception {
		return this.getInfo("sys_version");
	}

	public String getInfo(String key) throws Exception {
		String result = null;
		BufferedReader reader=null;
		try{
			String filePath = ProUtil.getString(key);
			File file = new File(filePath);
			reader = new BufferedReader(new InputStreamReader(
					new FileInputStream(file)));
			@SuppressWarnings("unchecked")
			List<String> list = IOUtils.readLines(reader);
			if (list.size() > 0) {
				result = list.get(0);
			}
		}catch(Exception e){
			throw e;
		}finally{
			if(reader!=null){
				reader.close();
			}
		}
		return result;
	}

}
