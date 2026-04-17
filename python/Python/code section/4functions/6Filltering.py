###############################################################################
##########################################################################

##without using filter
# def even(num):
#     if(num%2==0):
#         return True
#     else:
#         return False
# L=[]
# i=0
# while(i<=4):
#     print("Enter a number")
#     num=int(input())
#     L.insert(i,num)
#     i=i+1
# print(L)
# i=0
# while (i<=4):
#     data=L[i]
#     status = even(data)
#     if(status==True):
#         print(L[i])
#     i=i+1

#################################################################################
#################################################################################

# #using filtering function
# def even(num):
#     if(num%2==0):
#         return True
#     else:
#         return False
# L=[]
# i=0
# while(i<=4):
#     print("Enter a number")
#     num=int(input())
#     L.insert(i,num)
#     i=i+1
# print(L)
# k=list(filter(even,L))
# print(k)

###########################################################################################
###########################################################################################

# #filtering using lambda function
# L=[]
# i=0
# while(i<=4):
#     print("Enter a number")
#     num=int(input())
#     L.insert(i,num)
#     i=i+1
# print(L)
# k=list(filter(lambda num:num%2==0,L))
# print(k)


    