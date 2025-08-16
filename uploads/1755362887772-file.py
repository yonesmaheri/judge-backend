a = int(input())
b = int(input())
c = int(input())

zel = [a,b,c]
zel.sort()

if zel[0]**2 + zel[1]**2 == zel[2]**2:
    print("YES")
else:
    print('NO')