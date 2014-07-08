package com.oge.spu.util;

import java.io.IOException;
import java.io.OutputStream;

public class SocketUtil {
	
//	public static void write(OutputStream write,byte[] length,short type_id,byte[] msn) throws IOException{
//		if(length.length!=4||msn.length!=4)
//			return;
//		write.write(length,0,4);//数据总长度
//		write.write(1);//版本协议号
//		write.write(b);
//	}
	
	
	public static void write(OutputStream write) throws IOException{
		//包头
		byte[] length=new byte[13];
		length[0] = 0x01;
		write.write(length,0,length.length);
		
		write.write(1);
		
		write.write(0x01);
		write.write(0);
		
		write.write(0);
		write.write(0);
		write.write(0);
		write.write(0);
		
		//包体
		write.write(0x01);
		write.write(0);
		
		write.close();
	}

}
