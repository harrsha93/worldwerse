def binary_search(list,key):
    low=0
    high=len(list)-1

    while(low<=high):
      mid=(low+high)//2
      if(list[mid]==key):
         return mid
      elif(key>list[mid]):
        low=mid+1
      else:
        high=mid-1
    return-1
list=[12,24,44,55,76,87]
key=55
index=binary_search(list,key)
print(index)