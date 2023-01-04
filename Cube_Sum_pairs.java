import java.io.*;
import java.util.Scanner;
class Cube_Sum_pairs {
    static Scanner s = new Scanner(System.in);
    public static int countCubeSumPairs(int n) {
		// Write your code here.
        int count = 0;
        for(int i=1; i<=n; i++) {
            for(int j=0;j<=n;j++) {
                int a = i*i*i;
                int b = j*j*j;
                int c = a+b;
                if(c==n) {
                    count++;
                }
            }
        }
        return count;
	}
	public static void main (String[] args) {
		int testcases = s.nextInt();
		while(testcases > 0) {
		    int num = s.nextInt();
		    System.out.println(countCubeSumPairs(num));
		    testcases--;
		}
	}
}