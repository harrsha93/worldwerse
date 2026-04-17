n=int(input("Enter the number"))
rev=0
if n<0:               #to convert negative integer to positive integer
    n=n*-1
while n!=0:
    rem=n%10            #extraction
    rev=(rev*10)+rem    #alignment
    n=n//10             #remove used digit
print(rev)

##############################################################################
##############################################################################

#function method
def reverse(num):
    rev=0
    if num<0:               #to convert negative integer to positive integer
        n=num*-1
    while n!=0:
        rem=n%10            #extraction
        rev=(rev*10)+rem    #alignment
        n=n//10             #remove used digit
    return rev
num=int(input("Enter the number"))
rev=reverse(num)
print(rev)