print("Enter the text")
a=input()
b=""
for i in a:
    b=i+b
if b==a:
    print(a,"is a palindrom")
else:
    print(a,"is not a palindrom")