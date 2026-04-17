######################################################################
#####################################################################

#Nested function-A funtion inside the other function
def outer():
    print("Inside outer")
    def inner():
        print("inside inner")
    inner()
outer()   

###################################################################
###################################################################

#clouser function-calling the inner function outside the outer funtion
def outer():
    print("Inside outer")
    def inner():
        print("inside inner")
    return inner
ref=outer()   
ref()

####################################################################
#####################################################################

#Decorators function-the outer function accepts another funtion as parameter and calling the inner function in outside the outer function
def outer(function):
    print("Inside outer")
    def inner():
        print("inside inner")
    return inner
ref=outer()   
ref()

##########################################################################
#####################################################################