package com.oge.spu.util;

import java.io.File;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.configuration.reloading.FileChangedReloadingStrategy;

public class ProUtil {

	private static PropertiesConfiguration proConfiguration = new PropertiesConfiguration();

	static {
		try {
			proConfiguration.load(new File(ProUtil.class.getResource(
					"/global.properties").getPath()));
			
			proConfiguration.load(new File(proConfiguration.getString(
					"ifcfg-eth0", "/etc/sysconfig/network-scrips/ifcfg-eth0")));
			
			//操作系统版本信息
			proConfiguration.load(new File(proConfiguration.getString(
					"sys_version", "/proc/version")));
			//软件版本信息
			proConfiguration.load(new File(proConfiguration.getString(
					"spu2100_version", "/usr/local/em_new/Utility/config/version")));

			proConfiguration
					.setReloadingStrategy(new FileChangedReloadingStrategy());
		} catch (ConfigurationException e) {
			e.printStackTrace();
		}
	}

	public static PropertiesConfiguration getProConfiguration() {
		return proConfiguration;
	}

	public static void setProConfiguration(
			PropertiesConfiguration proConfiguration) {
		ProUtil.proConfiguration = proConfiguration;
	}

	public static String getString(String key) {
		return proConfiguration.getString(key);
	}

	public static String getString(String key, String defaultValue) {
		return proConfiguration.getString(key, defaultValue);
	}

}
