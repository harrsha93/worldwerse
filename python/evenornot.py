###################################################################
###################################################################

# n=int(input("Enter the number"))
# if n%2==0:
#     print("Even")
# else:
#     print("not a even")

###############################################################
###############################################################

def checkeven(n):
    if n%2==0:
        return True
    
num=int(input("enter the number"))
flag=checkeven(num)
if flag==True:
    print("Even")
else:
    print("not a even")