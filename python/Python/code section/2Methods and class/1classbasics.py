# #############################################

# #example1
# class Student:
#     def __init__(self):
#         self.name="Usha"
#         self.age=24
#         self.height=5.2
#         self.addr="bengluru"
#     def eat(self):
#         print("student is eating")
#     def study(self):
#         print("student is studing")
# s1=Student()
# print(s1.name)
# print(s1.age)
# print(s1.height)
# print(s1.addr)
# s1.eat()
# s1.study()

# ###############################################

# #example2
# class Hero:
#     def __init__(self):
#         self.name="dboss"
#         self.age=47
#         self.height=6.2
#         self.addr="rr nagar"
#     def act(self):
#         print("student is acting")
#     def fight(self):
#         print("student is fighting")
# h1=Hero()
# print(h1.name)
# print(h1.age)
# print(h1.height)
# print(h1.addr)
# h1.movies=55
# h1.wifes=2
# h1.height=6.3
# h1.addr="mysore"
# h2=h1
# h3=h2
# print(h1.name)
# print(h2.age)
# print(h3.height)
# print(h1.addr)
# print(h1.wifes)
# print(h1.movies)
# h2.act()
# h2.fight()

# ##############################################

# #example3
# class Student:
#     def __init__(self):
#         self.name="Usha"
#         self.age=24
#         self.height=5.2
#         self.addr="bengluru"
#     def eat(self):
#         print("student is eating")
# f1=Student()
# print(f1)
# f2=f1
# print(f2)
# print(id(f1))
# print(id(f2))
# print(f1 is f2)

# #######################################################

# # Ways of declaring instance variable

# class Student:
#     a=2.5                        #type 1 static variable
#     def __init__(self):
#         self.name="Usha"         #type 2.a instance varaible
#         self.age=24           
#         self.height=5.2
#     def act(self):
#         self.addr="bengluru"      #type 2.b
#         a=(self.age*self.height)  #type 3 local variable
#         print(a)
# s1=Student()                  
# s1.act()
# s1.movies=50                       #type 2.c
# print(s1.movies)

# ##################################################

# # Standard way of declaring class

# #example 1
# class Student:
#     def __init__(self,n1,u1,b1,a1):
#         self.name=n1
#         self.age=u1
#         self.height=b1
#         self.addr=a1
# s1=Student("Usha",21,"172cm","bengaluru")
# print(s1.name)

# #example 2
# class Farmer:
#     def __init__(self,p,t,r):
#         self.principle=p
#         self.time=t
#         self.rate=r
#     def cal(self):
#         s1=(self.principle*self.time*self.rate)/100  
#         print(s1)
# f1=Farmer(2000,2,1.5)
# f2=Farmer(1000,3,3.5)
# f1.cal()
# f2.cal()

# ####################################################


# # Ways to declare static variable and call static varable

# class Farmer:
#     r=2.5  #--static variable
#     def __init__(self,p,t):
#         self.principle=p
#         self.time=t
#     def cal(self):
#         s1=(self.principle*self.time*Farmer.r)/100  #call the static varaible by using class name(Farmer.r)
#         print(s1)
# f1=Farmer(2000,2)
# f2=Farmer(1000,3)
# f1.cal()
# f2.cal()
# print(Farmer.r)

# ########################################################
# ########################################################

# #default and keyword arguments
# class cali:
#     def operation(self,x=11,y=22,z=33): #Default argument
#         print(x,y,z)
# c1=cali()
# a=10
# b=20
# c=30


# c1.operation(a,b,c)       #keyword argument
# c1.operation()
# c1.operation(z=a)
# c1.operation(z=a,y=c,x=b)
# c1.operation(z=a,y=a,x=a)

# # #############################################################
# # ##############################################################
