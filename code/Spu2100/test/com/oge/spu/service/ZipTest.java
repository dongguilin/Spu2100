package com.oge.spu.service;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

public class ZipTest {

	/**
	 * 
	 * @param inputFileName
	 *            输入一个文件夹
	 * @param zipFileName
	 *            输出一个压缩文件夹，打包后文件名字
	 * @throws Exception
	 */
	public static void zip(String inputFileName, String zipFileName)
			throws Exception {
		zip(new File(inputFileName), zipFileName);
	}

	public static void zip(File inputFile, String zipFileName)
			throws Exception {
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(
				zipFileName));
		zip(out, inputFile, "");
		out.close();
	}
	
	public static void zip(File inputFile, File zipFile)
			throws Exception {
		ZipOutputStream out = new ZipOutputStream(zipFile);
		zip(out, inputFile, "");
		out.close();
	}

	private static void zip(ZipOutputStream out, File f, String base)
			throws Exception {
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

	public static void main(String[] temp) {
		String inputFileName = "d:/test/upload"; // 你要压缩的文件夹
		String zipFileName = "D:/test1.zip"; // 压缩后的zip文件
		
		File infile=new File(inputFileName);
		File zipfile=new File(zipFileName);

		ZipTest book = new ZipTest();
		try {
			book.zip(infile, zipfile);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println("heh");
	}

}
