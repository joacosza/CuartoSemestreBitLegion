# help(str.capitalize)

mensaje1 = 'Hola, mundo!'
mensaje2 = mensaje1.capitalize()

print(f'Mensaje1: {mensaje1}, ID: {id(mensaje1)}')
print(f'Mensaje2: {mensaje2}, ID: {id(mensaje2)}')

mensaje1 += 'Adiós!'
print(f'Mensaje1: {mensaje1}, ID: {id(mensaje1)}')

