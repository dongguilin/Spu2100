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

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;

import com.oge.spu.bean.Config;
import com.oge.spu.bean.Item;

public class ConfigUtil {

	private static File file = new File(ProUtil.getString("setup"));

	public static void writeToConf(
			Map<String, Map<String, String>> maps) throws Exception {
		BufferedWriter writer = null;
		try {
			FileOutputStream fos=new FileOutputStream(file);
			writer = new BufferedWriter(new OutputStreamWriter(
					new DataOutputStream(fos), "gb2312"));
			FileLock lock=fos.getChannel().tryLock();
			if(lock!=null){
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

	public static boolean deleteConfig(String key) {
		boolean result = false;
		Map<String, Map<String, String>> maps = loadAll();
		maps.remove(key);
		try {
			writeToConf(maps);
			result = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

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

	public static boolean addConfig(String key, Map<String, String> items) {
		boolean result = false;
		Map<String, Map<String, String>> maps = loadAll();
		Map<String, String> map = new LinkedHashMap<String, String>();
		Iterator<String> iter = items.keySet().iterator();
		while (iter.hasNext()) {
			String keyStr = iter.next();
			String valueStr = items.get(keyStr);
			map.put(keyStr, valueStr);
		}
		maps.put(key, map);
		try {
			writeToConf(maps);
			result = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

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
					new FileInputStream(file),"gb2312"));
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

	public static Map<String, Map<String, String>> load(String key){
		Map<String, Map<String, String>> result = new LinkedHashMap<String, Map<String,String>>();
		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new InputStreamReader(
					new FileInputStream(file),"gb2312"));
			String str = null;
			String currentKey = null;
			boolean flag = false;
			while ((str = reader.readLine()) != null) {
				if (str.startsWith("[")) {
					String temp = "[" + key;
					if (str.startsWith(temp)) {
						flag = true;
						Map<String,String> items=new LinkedHashMap<String,String>();
						String name = str.substring(1, str.length() - 1);
						currentKey = name;
						result.put(name, items);
					} else {
						flag = false;
					}
				} else if (flag) {
					if (str.contains("=") && str.length() > 1) {
						String[] strs = str.split("=");
						String value = strs.length == 2 ? strs[1] : "";
						result.get(currentKey).put(strs[0], value);
					}
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
	
	public static Map<String, Config> loadConfigs(String key) {
		Map<String, Config> result = new LinkedHashMap<String, Config>();
		if (StringUtils.isEmpty(key)) {
			return result;
		}
		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new InputStreamReader(
					new FileInputStream(file),"gb2312"));
			String str = null;
			String currentKey = null;
			boolean flag = false;
			while ((str = reader.readLine()) != null) {
				if (str.startsWith("[")) {
					String temp = "[" + key;
					if (str.startsWith(temp)) {
						flag = true;
						Config cf = new Config();
						String name = str.substring(1, str.length() - 1);
						cf.setName(name);
						currentKey = name;
						result.put(name, cf);
						System.out.println(name);
					} else {
						flag = false;
					}
				} else if (flag) {
					if (str.contains("=") && str.length() > 1) {
						String[] strs = str.split("=");
						String value = strs.length == 2 ? strs[1] : "";
						result.get(currentKey).getItems()
								.add(new Item(strs[0], "", value));
						System.out.println(strs[0] + "=" + value);
					}
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
	 * 根据key加载配置
	 * 
	 * @param key
	 * @return
	 */
	public static Config loadConfig(String key) {
		if (StringUtils.isEmpty(key)) {
			return null;
		}
		Config result = null;
		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new InputStreamReader(
					new FileInputStream(file),"gb2312"));
			String str = null;

			while ((str = reader.readLine()) != null) {
				if (result == null && str.startsWith("[" + key)) {
					result = new Config();
					result.setName(key);
					result.setDescription(ProUtil.getString(key));
				} else if (result != null && str.contains("=")) {
					String[] strs = str.split("=");
					String name = strs[0];
					String des = ProUtil.getString(key + "." + name);
					String value = strs.length == 2 ? strs[1] : "";
					result.getItems().add(new Item(name, des, value));
				} else if (result != null && str.startsWith("[")) {
					break;
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
	
}
