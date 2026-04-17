class student:
     def __init__(self):
        self.__name=" "
     (self):
        return self.__name
     def setter(self,value):
         self.__name=value
     getset=property(getter,setter)
s1=student()
s1.getset="rama"
res=s1.getset                                                             
print(res)