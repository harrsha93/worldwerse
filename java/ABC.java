public class ABC
{
    int num=100;
    void M1()
    {
      int num1=10;
      System.out.println(num+num1);
    }
    void M2()
    {
        int num2=20;
        System.out.println(num+num2);
    }
public static void main(String[] args)
 {
  ABC obJ=new ABC();  
  obJ.M2();  
 }
}