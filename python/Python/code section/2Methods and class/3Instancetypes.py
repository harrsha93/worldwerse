#################################################################

# A)Instance Method
#   1) No parameter and No Return value
#   2) No parameter and Return value
#   3) Parameter and no return value
#   4) Parameter and Return value


# A.1) No parameter and No return value

class Calculator:
    def __init__(self):
        self.x=10 
        self.y=20
    def add(self):
        a=100
        b=200
        c=a+b
        print(c)
c1=Calculator()
print(c1.x)
print(c1.y)
c1.add()


# A.2) No parameter and Return value

class Calculator:
    def __init__(self):
        self.x=10 
        self.y=20
    def add(self):
        a=100
        b=200
        c=a+b
        return c #we return the value to method
c1=Calculator()
print(c1.x)
print(c1.y)
answer=c1.add() #we can access the return value when needed
print(answer)

# A.3) Parameter and No Return value

class Calculator:
    def __init__(self):
        self.x=10 
        self.y=20
    def add(self,a,b): #we declare a,b to the method
        c=a+b
        print(c)
c1=Calculator()
print(c1.x)
print(c1.y)
c1.add(100,200) #call method by passing value for a,b

# A.4) Parameter and Return value

class Calculator:
    def __init__(self):
        self.x=10 
        self.y=20
    def add(self,a,b):
        c=a+b
        return c #we return the value to method
c1=Calculator()
print(c1.x)
print(c1.y)
answer=c1.add(100,200) #we can access the return value when needed and store value in a varaible
print(answer)

####################################################

 