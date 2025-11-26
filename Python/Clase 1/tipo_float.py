# PROFUNDIZANDO EN EL TIPO FLOAT

a = 3.0
print(f'a: {a:.2f}')

# Constructor de tipo float (recibe int && str)
a = float(10) 
a = float('10')
print(f'a: {a:.2f}')

# Notación exponencial (+-)
a = 3e5
print(f'a: {a:.2f}')

a = 3e-5
print(f'a: {a:.5f}')


# Cualquier cálculo que incluya un float cambiará a float
a = 4.0 + 5
print(a)
print(type(a))

