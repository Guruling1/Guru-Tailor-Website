package sst;

import java.util.Scanner;

public class Armstrong {

	public static void main(String[] args) {
		Scanner sc=new Scanner(System.in);
		int n=sc.nextInt();
		for(int i=0;i<n;i++)
		{
			if(Armstrong(i)) {
		
		System.out.print(i+" ");
		}
		}
	}
	static boolean Armstrong(int n)
	{
		int arg=n;
		int sum=0;
		while(n>0) {
			int ele=n%10;
			int cube=ele*ele*ele;
			sum=sum+cube;
			n=n/10;
			
		}
		if(sum==arg) {
			return true;
		}
		else {
			return false;
		}
	}
}
