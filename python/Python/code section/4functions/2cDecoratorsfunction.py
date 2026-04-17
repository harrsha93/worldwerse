# def print_msg():
#     print("Hello Everyone")
# def outer(a):
#     print("Entering outer")
#     def inner():
#         print("Entering inner")
#         ref=a
#         ref()
#         print("Leaving inner")
#     return inner 
# ptr3=print_msg
# ptr2=outer(ptr3)
# print("calling inner")
# ptr2()
# print("pgm end")

#############################################################
############################################################

# #example 2
# def add(a,b):
#     return a+b
# def sub(a):
#     d=a-5
#     print(d)
#     def mul():
#         e=d*2
#         print(e)
#     return mul

# x=int(input("Enter the number"))
# y=int(input("Enter the number"))
# addition=add(x,y)
# subtraction=sub(addition)
# subtraction()

##############################################################################
##########################################################################

#example 3
def hi(a):
    b=("Hello "+a)
    print(b)
    return b
def printing(b):
    def upper1():
        e=b.upper()
        print(e)
    return upper1

x=(input("Enter the name"))
name=hi(x)
uppercase=printing(name)
uppercase()

    