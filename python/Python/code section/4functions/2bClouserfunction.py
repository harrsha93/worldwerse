###################################################################
#####################################################################

##sample example to call funtion at anyplace of the function

def fun1():                         #firstclass function
    print("fun1")
def fun2(x,y):                      #firstclass function
    z=x+y
    print(z)
def fun3(ptr1,ptr2):                #higherorder function
    print(ptr1)
    print(ptr2)
    ptr1()
    ptr2(10,20)
print(fun1)
print(fun2)

fun1()
fun2(40,50)

ptr3=fun1
ptr4=fun2

ptr3()
ptr4(50,100)

fun3(ptr3,ptr4)

######################################################################################
########################################################################################

# #calling the inner function outide the outer funtion
# def outer():
#     print("a")
#     def inner():
#         print("b")
#     return inner
# d=outer()
# d()                     #calling the inner function outide the outer funtion

#########################################################################################
#########################################################################################

