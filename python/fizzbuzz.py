def fizzbuzz(sr,er):
    print("fizzbuzz")
    for i in range(sr,er+1): 
        if i%3==0 and i%5==0:
            print(i,end=" ")
    print("\nfizz")
    for i in range(sr,er+1): 
        if i%3==0:
            print(i,end=" ")
    print("\nbuzz")
    for i in range(sr,er+1):
        if i%5==0:
            print(i,end=" ")
    print("\nnon fizzbuzz")
    for i in range(sr,er+1):
        if i%3!=0 and i%5!=0:
            print(i,end=" ")
sr=int(input("Enter the starting range"))
er=int(input("Enter the ending range"))
if sr > er :
	print("invalid input")
else:
	fizzbuzz(sr,er)