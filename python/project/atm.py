print("     WELCOME         ")
print("   Insert Card       ")
print("1 Domestic")
print("2 International")
a=int(input("Enter your choice\n"))
if(a==1):        
    print("Select the language")
    b=int(input(" 1 Kannada\n 2 English\n 3 Hindi\n"))   
    if(b==2):
        pin=(int(input("Enter the pin")))
        if(pin==1234):
            print("select the type of account")
            type=int(input(" 1 Savings\n 2 Current\n"))
            if(type==1):   
               transaction=int(input(" 1 withdraw\n 2 balance \n 3 deposite\n 4 green pin\n"))
               balance=20000
               if(transaction==1):
                    amount=int(input("Enter the amount\n"))
                    if(amount>balance):
                         print("No balance")
                    else:
                         print("Wait for the transaction end") 
                         print("collect your cash")
                         print("remaining balance:",balance-amount)
                         print("Thank you Visit again")
                    balance=balance-amount
               elif(transaction==2):
                    print("remaining balance:",balance)  
               elif(transaction==3):
                    amount=int(input("Enter the amount to be deposited\n"))
                    print("deposite your cash")
                    print("**********************************************") 
                    print("**********************************************") 
                    print("**********************************************") 
                    print("remaining balance:",balance+amount)
                    balance=balance+amount
                    print("Thank you Visit again")
               elif(transaction==4):
                    newpin=int(input(" Enter the new pin\n"))
                    pin=newpin
               else:
                    print("Not available at right moment")
        else:
                print("Wrong pin")          
else:
     print("not available")
    
