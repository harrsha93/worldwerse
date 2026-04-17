class student:
     def __init__(self):
        self.__name=" "
     def getter(self):
        return self.__name
     def setter(self,value):
         self.__name=value
s1=student()
s1.setter("rama")
res=s1.getter()
print(res)