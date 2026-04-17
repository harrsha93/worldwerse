# student={"name":"kiran",
#          "id":420,
#          "girlfriend":"dingi",
#          "addr":{"resi":"banglore",
#                 "perm":"Hassan"},
#          "phone":{"mob":636123,
#                   "Land":100}
#          }        
# print(student)
# s1=student
# print(s1)
# print(student)
# student["girlfriend"]="sundri"
# print(s1)
# print(student)

#####deep in a nested dictionary

# student={"name":"kiran",
#          "id":420,
#          "girlfriend":"dingi",
#          "addr":{"resi":"banglore",
#                 "perm":"Hassan"},
#          "phone":{"mob":636123,
#                   "Land":100}
#          }       
# print(student)
# s1=student.copy()
# print(s1)
# print(student)
# student["phone"]["Land"]=108
# print(s1)
# print(student)

##achiving deepcopy in nested dictionary
# import  copy
# student={"name":"kiran",
#          "id":420,
#          "girlfriend":"dingi",
#          "addr":{"resi":"banglore",
#                 "perm":"Hassan"},
#          "phone":{"mob":636123,
#                   "Land":100}
#          }       
# print(student)
# s1=copy.deepcopy(student)
# print(s1)
# print(student)
# student["phone"]["Land"]=108
# print(s1)
# print(student)

#####################################################
#####################################################

##zip funtion in dictionary

emp_id=[101,102,103,104]
name =["kiran","preethesh","akash","anuj"]
result=dict(zip(emp_id,name))
print(result)

emp_id=[101,102,103,104]
name=["kiran","preethesh","akash","anuj"]
mob=[1111,2222,3333,4444]
addr=["hassan","goa","banglore","russia"]
data=list(zip(name,mob,addr))                                      
res=dict(zip(emp_id,data))
print(res)

##file handling in core python
##file processing in core python
# 1.text file > charecter
# 2.binary file > 0 & 1  
#                            