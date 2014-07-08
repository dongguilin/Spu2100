package com.oge.spu.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import jodd.io.FileUtil;

import org.junit.Test;

public class IOTest {

	@Test
	public void test1() throws Exception {
		File file = new File("d:/Test/test1.txt");
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(
				new DataOutputStream(new FileOutputStream(file)), "UTF-8"));
		writer.write("abc");
		writer.newLine();
		writer.write("呵呵");
		writer.close();

	}

	@Test
	public void test2() throws IOException {
		// System.out.println(IOTest.class.getResource("/user").getPath());
		// System.out.println(FileUtil.copyFileToDir("d:/setup.conf",
		// "d:/spu"));
		File file = new File("d:/setup(2).conf");
		BufferedReader reader = new BufferedReader(new InputStreamReader(
				new DataInputStream(new FileInputStream(file)),"ANSI"));
		String str = null;
		while((str=reader.readLine())!=null){
			System.out.println(str);
		}
		reader.close();
	}
	
	public static void main(String[] args) throws IOException {
		File file = new File("d:/setup(2).conf");
		BufferedReader reader = new BufferedReader(new InputStreamReader(
				new DataInputStream(new FileInputStream(file))));
		String str = null;
		while((str=reader.readLine())!=null){
			System.out.println(str);
		}
		reader.close();
	}

}
