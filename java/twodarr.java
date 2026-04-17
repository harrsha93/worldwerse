import java.util.Scanner;

public class twodarr{
    public static void main(String[] args) {
        Scanner ip = new Scanner(System.in);
        int r,c,i,j;
        System.out.println("Enter dimension of the matrix:");
        r=ip.nextInt();
        c=ip.nextInt();
        int[][] x = new int[3][3];
        System.out.println("Enter the elements of matrix");
        for(i=0;i<r;i++){
            for(j=0;j<c;j++){
                x[i][j]=ip.nextInt();
            }
        }
    }
}