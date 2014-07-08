package com.oge.spu.service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.nio.channels.FileLock;

public class FileLockTest {

	public static void main(String[] args) throws Exception {
		FileOutputStream fos = new FileOutputStream(new File("d:/test/user.txt"));
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(fos));
		FileLock lock= fos.getChannel().tryLock();
		if(lock!=null){
			System.out.println("获取锁");
			writer.write("heh");
			Thread.sleep(1500);
			lock.release();
			writer.close();
			System.out.println("释放");
		}
		
	}
	
	
}
