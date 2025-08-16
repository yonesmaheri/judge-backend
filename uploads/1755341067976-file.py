a, b, l = map(int,input().split())
time = 0

for ar in range(1,l+1):
    if ar % 2 == 0:
        time += b
    else:
        time += a
print(time)