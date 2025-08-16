n = input()
number = 0

while len(str(n)) > 1:
    for i in n:
        number += int(i)
    n = str(number)
    number = 0
print(n)


n = input().strip()
while len(n) > 1:
    n = str(sum(map(int, n)))
print(n)
