import java.util.Scanner;

interface Encryption
 {
    String encrypt(String text);
    String decrypt(String text);
 }

class SimpleEncryption implements Encryption 
{
    private final int KEY = 3;

    public String encrypt(String text)
     {
        String result = "";

        for (int i = 0; i < text.length(); i++)
         {
            char ch = text.charAt(i);

            if (Character.isLetter(ch))
            {
                ch += KEY;
            }

            result += ch;
         }

        return result;
    }

    public String decrypt(String text)
     {
        String result = "";

        for (int i = 0; i < text.length(); i++)
         {
            char ch = text.charAt(i);

            if (Character.isLetter(ch))
            {
                ch -= KEY;
            }

            result += ch;
         }

        return result;
     }
}

class User
 {
    private String username;
    private String password;

    public User(String username, String password)
     {
        this.username = username;
        this.password = password;
     }

    public boolean login(String u, String p)
    {
        return username.equals(u) && password.equals(p);
    }
 }

class VPNServer
 {
    protected String location;
    protected String ipAddress;

    public VPNServer(String location, String ipAddress)
     {
        this.location = location;
        this.ipAddress = ipAddress;
     }

    public void showServerDetails()
     {
        System.out.println("Connected to: " + location + " Server");
        System.out.println("Your IP is masked as: " + ipAddress);
     }
}

class Connection extends VPNServer
 {

    private boolean isConnected;

    public Connection(String location, String ipAddress)
     {
        super(location, ipAddress);
        isConnected = false;
     }

    public void connect()
     {
        isConnected = true;
        System.out.println("\nConnecting to VPN...");
        System.out.println("Connection Successful!");
        showServerDetails();
     }

    public void disconnect()
     {
        isConnected = false;
        System.out.println("\nVPN Disconnected Successfully.");
     }
 }

public class VPNSimulator
{

    public static void main(String[] args)
     {

        Scanner sc = new Scanner(System.in);
        User user = new User("harsha", "shetty93");

        System.out.println("=================================");
        System.out.println("      JAVA VPN SIMULATOR");
        System.out.println("=================================");

        try {

            System.out.print("Enter Username: ");
            String uname = sc.nextLine();

            System.out.print("Enter Password: ");
            String pass = sc.nextLine();

            if (!user.login(uname, pass))
             {
                throw new Exception("Invalid Username or Password!");
             }

            System.out.println("\nLogin Successful!");
            System.out.println("\nSelect VPN Server Location:");
            System.out.println("1. India");
            System.out.println("2. USA");
            System.out.println("3. UK");

            System.out.print("Enter your choice: ");
            int choice = sc.nextInt();
            sc.nextLine();

            Connection vpn;

            if (choice == 1)
             {
                vpn = new Connection("India", "103.45.67.89");
             } 
             else if (choice == 2) {
                vpn = new Connection("USA", "192.168.100.10");
             } 
             else if (choice == 3) {
                vpn = new Connection("UK", "81.92.45.21");
             }
              else {
                throw new Exception("Invalid server choice!");
             }

            vpn.connect();

            Encryption encryptObj = new SimpleEncryption();

            System.out.print("\nEnter message to send securely: ");
            String message = sc.nextLine();

            String encryptedMsg = encryptObj.encrypt(message);
            System.out.println("Encrypted Message: " + encryptedMsg);

            String decryptedMsg = encryptObj.decrypt(encryptedMsg);
            System.out.println("Decrypted Message: " + decryptedMsg);

            vpn.disconnect();

            } 
            catch (Exception e) {
            System.out.println("\nError: " + e.getMessage());
        }

        sc.close();
    }
}
