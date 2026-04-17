def data(num):
    return num+10
L=[]
i=0
while(i<=4):
    print("Enter a number")
    num=int(input())
    L.insert(i,num)
    i=i+1
print(L)
k=list(map(data,L))
print(k)
