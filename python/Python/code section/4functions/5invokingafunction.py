##################################################
##################################################

# #invoking a function 
# def fun1():
#     print("hello")
# def fun2():
#     print("hi")
# print(fun1)             #address of fun1
# print(fun2)

# a=fun1                #invoking a function 
# a()
# b=fun2
# b()

#########################################################
#######################################################

# #accesing global variable and modifying the value
# a=10
# def fun1():
#     global a                #global a is set to 20
#     a=20
#     b=25
#     print(a)
#     print(b)
# def fun2():
#     global a                #global a is set to 999
#     a=999
#     b=888
#     print(a)
# print(a)
# fun1()
# print(a)
# fun2()
# print(a)

#############################################################
#############################################################

#acessing an local variable ouside the function
def fun1():
    a=10
    print(a)
    def fun2():
        nonlocal a           #non local
        a=20
        b=30
        print(b)
        print(a)
    fun2()
    print(a)
fun1()

#####################################################################
#####################################################################
