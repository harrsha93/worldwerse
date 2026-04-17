##########################################################
###########################################################

##example1
# a=10                           #global variable
# def func1():
#     a=20                       #non local variable -
#     b=30                       #when there is another funtion inside a function  
#     print(a)
#     def func2():
#         a=25                   #local variable
#         print(a)
#     func2()
# func1()
# print(a)

###############################################################
##############################################################

# #example2
# def fun1():
#     a=10
#     b=20
#     print(b)
#     print(a)
#     def fun2():
#         c=25
#         print(a)
#     fun2()
# fun1()

###############################################################
##############################################################

# #example 3-error
# #def fun1():
# #   a=10
# #   b=20
# #   print(c)
# #   def fun2():               #error because local variable cannot be accesed outisde the function
# #       c=25
# #       print(a)
# #   fun2()
# #fun1()

##############################################################
##############################################################