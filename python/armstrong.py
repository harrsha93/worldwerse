# write the program to check the given number is armstrong number or not
#1.store the original value into a temp
#2.store the count of digit int a power variable
#3.sum=o,repeat the below steps until n!=0
#   -extract the digit one by one
#   -Take the extracted digit=base and power=power to find the exponent value
#   -sum up the exponent value of each digit
#   -remove the utilized extracted digit
#4.compare temp==sum

##ittreative method
# n=int(input("Enter the number"))
# temp=n
# temp1=n
# power=0
# b=0
# while n!=0:
#     n= n//10
#     power+=1
# while temp!=0:
#     rem=0
#     rem=temp%10
#     a=rem**power
#     b=b+a
#     temp//=10
# if b==temp1:
#      print("ASN")
# else:
#      print("Not Asn")

#############################################################
###########################################################

#function

n=int(input("Enter the number"))
temp=n
temp1=n
def count(n):
    power=0
    while n!=0:
        n= n//10
        power+=1
    return power
def armstrong(temp,power):
    b=0
    while temp!=0:
        rem=0
        rem=temp%10
        a=rem**power
        b=b+a
        temp//=10
    return b
z=count(n)
b=armstrong(temp,z)
if b==temp1:
     print("ASN")
else:
     print("Not Asn")
