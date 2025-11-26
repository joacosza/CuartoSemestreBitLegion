# 0 = false, 1 = true (exit code)

valor = 0
resultado = bool(valor)
print(f'valor: {valor}, resultado: {resultado}')

valor = 0.1
resultado = bool(valor)
print(f'valor: {valor}, resultado: {resultado}')

# Tipo string: False '', True anything else
valor = ''
resultado = bool(valor)
print(f'valor: {valor}, resultado: {resultado}')


valor = 'Hola'
resultado = bool(valor)
print(f'valor: {valor}, resultado: {resultado}')

# Tipo colecciones: False para colecciones vacías
# True para todas las demás
# Lista
valor = []
resultado = bool(valor)
print(f'valor de una lista vacía: {valor}, resultado: {resultado}')

valor = [2, 3, 4]
resultado = bool(valor)
print(f'valor de una lista con elementos: {valor}, resultado: {resultado}')

# Tupla
valor = ()
resultado = bool(valor)
print(f'valor de una tupla vacía: {valor}, resultado: {resultado}')

valor = (5,)
resultado = bool(valor)
print(f'valor de una tupla con elementos: {valor}, resultado: {resultado}')

# Diccionario
valor = {}
resultado = bool(valor)
print(f'valor de un diccionario vacío: {valor}, resultado: {resultado}')

valor = {'Nombre': 'Daiana', 'Apellido': 'Cazón'}
resultado = bool(valor)
print(f'valor de un diccionario con elementos: {valor}, resultado: {resultado}')

# Sentencias de control con bool
if bool(''):
    print('Regresa verdadero')
else:
    print('Regresa falso')

# Ciclos
variable = 17
while variable:
    print('Regresa verdadero')
else:
    print('Regresa falso')

