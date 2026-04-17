n=int(input("enter the number")) 
count=1
for i in range(1,n+1):
    for j in range(1,i+1):
            if i%2!=0:
                print(count,end=" ")
                count2=count
            else:
                print(count2+1,end=" ")
                count2=count2-1
            count=count+1
    print()
    count2=count2+i