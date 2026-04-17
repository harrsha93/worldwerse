# n=int(input("Enter the number"))
# num=n
# rev=0
# if num<0:               #to convert negative integer to positive integer
#     num=num*-1
# while num!=0:
#     rem=num%10            #extraction
#     rev=(rev*10)+rem    #alignment
#     num=num//10             #remove used digit
# print(rev)
# print(n)
# if n==rev:
#     print("It is a palindrom")
# else:
#     print("it is not a palindrom")

###################################################################################
####################################################################################
# #function method
# def reverse(n):
#     num=n
#     rev=0
#     if num<0:               #to convert negative integer to positive integer
#         num=num*-1
#     while num!=0:
#         rem=num%10             #extraction
#         rev=(rev*10)+rem       #alignment
#         num=num//10            #remove used digit
#     if n==rev:
#         return True
# n=int(input("Enter the number"))
# a=reverse(n)
# if a==True:                     
#     print("It is a palindrom")
# else:
#     print("it is not a palindrom")

##################################################################################
###################################################################################
####################################################################################

#TO PRINT ALL THE INTEGER PALINDROMES AND NON PALINDROMES SEPERATELY OF THE DEFINED RANGE
# def reverse(n):
#     num=n
#     rev=0
#     if num<0:               #to convert negative integer to positive integer
#         num=num*-1
#     while num!=0:
#         rem=num%10             #extraction
#         rev=(rev*10)+rem       #alignment
#         num=num//10            #remove used digit
#     if n==rev:
#         return True
# sr=int(input("Enter the starting range"))
# er=int(input("Enter the ending range"))
# if sr>er:
#     print("Invalid range")
# else:
#     for i in range(sr,er+1):
#         if reverse(i)==True: 
#             print(i,end=" ")
#             print("Pali")
#         else:
#             print(i,end=" ")
#             print("notpali")

#########################################################################
#########################################################################

def reverse(n):
    num=n
    rev=0
    if num<0:               #to convert negative integer to positive integer
        num=num*-1
    while num!=0:
        rem=num%10             #extraction
        rev=(rev*10)+rem       #alignment
        num=num//10            #remove used digit
    if n==rev:
        return True
    return False
sr=int(input("Enter the starting range"))
er=int(input("Enter the ending range"))
if sr>er:
    print("Invalid range")
else:
    print("Pali")
    for i in range(sr,er+1):
        if reverse(i)==True: 
            print(i,end=" ")
    print("\nnonPali")
    for i in range(sr,er+1):       
        if reverse(i)==False:
            print(i,end=" ")
            
        
