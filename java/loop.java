import java.util.Scanner;

public class ifelse {
    public static void main(String[] args) {
        
        Scanner console = new Scanner(System.in);  
        
        double gpa = console.nextDouble();         
        
        if (gpa <= 2.0) {
            System.out.println("Your application is denied");
        } else {
            System.out.println("Welcome to the Mars University");
        }

        console.close();  
    }
}
