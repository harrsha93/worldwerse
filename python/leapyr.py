


# n=int(input("Enter the number"))
# if n%100==0:
#     if n%400==0:
#         print("leap year")
#     else:
#         print("not")
# if n%100!=0:
#     if n%4==0:
#         print("leap year")
#     else:
#         print("not")

##########################################################
################################################################

# #function
# n=int(input("Enter the number"))
# def leapyear(n):
#     if n%100==0:
#         if n%400==0:
#             return True
#         else:
#             return False
#     if n%100!=0:
#         if n%4==0:
#             return True
#         else:
#             return False
# a=leapyear(n)
# if a==True:
#     print("Leap year")
# else:
#     print("non -Leap year")

##################################################################
################################################################

#using range
sr=int(input("Enter the starting range"))
er=int(input("Enter the ending range"))
def leapyear(n):
    if n%100==0:
        if n%400==0:
            return True
        else:
            return False
    if n%100!=0:
        if n%4==0:
            return True
        else:
            return False
if sr>er:
    print("Invalid")
else:
    print("Leap year")
    for i in range(sr,er+1):
        a=leapyear(i)
        if a==True:
            print(i,end=" ")
    print("\nnon-leap year")
    for i in range(sr,er+1):
        a=leapyear(i)
        if a==False:
            print(i,end=" ")
    