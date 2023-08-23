

import sys
import math


głoski = ['a','ą','b','cz','ch','c','ć','dz','dź','dż','d','e','ę','f','g','h','i','j','k','l','ł','m','n','ń','o','ó','p','rz','r','sz','s','ś','t','u','w','y','z','ź','ż']

następstwo = {}
for g in głoski:
    następstwo[g] = {}
    for h in głoski:
        następstwo[g][h] = 0

def splitWord(word):
    stos = []
    i = 0
    while i < len(word):
        if word[i:(i+2)] in głoski:
            stos.append(word[i:(i+2)])
            i += 1
        elif word[i:(i+1)] in głoski:
            stos.append(word[i:(i+1)])
        else:
            stos.append('#')
            
        i += 1
        
    return stos

with open('lista.txt') as f:
    pierwszaLinia = True
    ix = 0
    for line in f:
        ix+=1
        if ix > 10000:
            break
        
        if pierwszaLinia:
            pierwszaLinia = False
            continue
        s = line.strip().split(';')
        słowo = s[0]
        liczba = int(s[1])
        splitty = splitWord(słowo)
        
        last = None
        for g in splitty:
            if last != None and last != '#' and g != '#':
                następstwo[last][g] += liczba
                
            last = g

    sys.stdout.write('\t')
for x in następstwo:
    sys.stdout.write(x)
    sys.stdout.write('\t')
print()
for x in następstwo:
    sys.stdout.write(x)
    sys.stdout.write('\t')
    for y in następstwo[x]:
        liczba = następstwo[x][y]
        sys.stdout.write(str(math.floor(math.log10(liczba+1))))
        sys.stdout.write('\t')
    print()
    
for x in następstwo:
    
    for y in następstwo[x]:
        liczba = następstwo[x][y]
        if liczba == 0 and x+y not in głoski and x in 'abcdefghijklmnopqrstuvwxyz' and y in 'abcdefghijklmnopqrstuvwxyz':
            print(x+' '+y)
