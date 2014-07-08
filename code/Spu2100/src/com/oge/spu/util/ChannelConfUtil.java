package com.oge.spu.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.channels.FileLock;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 操作channel.conf文件
 * 
 * @author guilin
 *
 */
public class ChannelConfUtil {

	private static File file = new File(ProUtil.getString("channel"));

	/**
	 * 加载所有配置
	 * 
	 * @return
	 */
	public static Map<String, Map<String, String>> loadAll() {
		Map<String, Map<String, String>> result = new LinkedHashMap<String, Map<String, String>>();
		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new InputStreamReader(
					new FileInputStream(file)));
			String str = null;
			Map<String, String> config = null;
			while ((str = reader.readLine()) != null) {
				str = str.trim();
				if (str.startsWith("[") && str.endsWith("]")) {
					String key = str.substring(1, str.length() - 1);
					config = new LinkedHashMap<String, String>();
					result.put(key, config);
				} else if (str.contains("=") && str.length() > 1) {
					String[] strs = str.split("=");
					String value = strs.length == 2 ? strs[1] : "";
					config.put(strs[0], value);
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e) {
					e.printStackTrace();
				} finally {
					reader = null;
				}
			}
		}
		return result;
	}

	/**
	 * 将配置写入文件
	 * 
	 * @param maps
	 * @throws Exception
	 */
	public static void writeToConf(Map<String, Map<String, String>> maps)
			throws Exception {
		BufferedWriter writer = null;
		try {
			FileOutputStream fos = new FileOutputStream(file);
			writer = new BufferedWriter(new OutputStreamWriter(
					new DataOutputStream(fos), "gb2312"));
			FileLock lock = fos.getChannel().tryLock();
			if (lock != null) {
				Iterator<String> iter = maps.keySet().iterator();
				while (iter.hasNext()) {
					String key = iter.next();
					writer.write("[" + key + "]");
					Map<String, String> items = maps.get(key);
					Iterator<String> iter2 = items.keySet().iterator();
					while (iter2.hasNext()) {
						String name = iter2.next();
						String value = items.get(name);
						writer.newLine();
						writer.write(name + "=" + value);
					}
					writer.newLine();
				}
				lock.release();
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		} finally {
			if (writer != null) {
				try {
					writer.close();
				} catch (IOException e) {
					e.printStackTrace();
					throw e;
				} finally {
					writer = null;
				}
			}
		}
	}

	/**
	 * 更新配置
	 * 
	 * @param key
	 * @param items
	 * @return
	 */
	public static boolean updateConfig(String key, Map<String, String> items) {
		boolean result = false;
		Map<String, Map<String, String>> maps = loadAll();
		Map<String, String> map = maps.get(key);
		Iterator<String> iter = items.keySet().iterator();
		while (iter.hasNext()) {
			String keyStr = iter.next();
			String valueStr = items.get(keyStr);
			map.put(keyStr, valueStr);
		}
		try {
			writeToConf(maps);
			result = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

}
