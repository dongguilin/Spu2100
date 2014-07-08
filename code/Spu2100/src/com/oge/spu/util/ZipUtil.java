package com.oge.spu.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

public class ZipUtil {

	/**
	 * 将dir文件夹的所有文件及文件夹压缩为zipFile
	 * 
	 * @param dir
	 * @param zipFile
	 * @throws Exception
	 */
	public static void zip(String dir, File zipFile) throws IOException {
		zip(new File(dir), zipFile);
	}

	/**
	 * 将dir文件夹下的所有文件及文件夹压缩为zipFile
	 * 
	 * @param dir
	 * @param zipFile
	 * @throws Exception
	 */
	public static void zip(File dir, File zipFile) throws IOException {
		ZipOutputStream out = new ZipOutputStream(zipFile);
		zip(out, dir, "");
		out.close();
	}
	
	public static void zip(File dir, OutputStream os) throws IOException {
		ZipOutputStream out = new ZipOutputStream(os);
		zip(out, dir, "");
		out.close();
	}

	private static void zip(ZipOutputStream out, File f, String base)
			throws IOException {
		if (f.isDirectory()) { // 判断是否为目录
			File[] fl = f.listFiles();
			base = base.length() == 0 ? "" : base + File.separator;
			out.putNextEntry(new ZipEntry(base));
			for (int i = 0; i < fl.length; i++) {
				zip(out, fl[i], base + fl[i].getName());
			}
		} else { // 压缩目录中的所有文件
			out.putNextEntry(new ZipEntry(base));
			BufferedInputStream in = new BufferedInputStream(
					new FileInputStream(f));
			byte[] buff = new byte[1000];
			int b = -1;
			while ((b = in.read(buff)) != -1) {
				out.write(buff, 0, b);
			}
			in.close();
		}
	}

}
