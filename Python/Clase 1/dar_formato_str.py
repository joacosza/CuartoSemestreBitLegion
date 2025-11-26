# Dar formato a un string

nombre = 'Daiana'
edad = 25
mensaje_con_formato = 'Mi nombre es %s y tengo %d años'% (nombre, edad)
print(mensaje_con_formato)


# Creamos una tupla
persona = ('Carla', 'Gómez', 5000.00)
mensaje_con_formato = 'Hola, %s %s. Tu sueldo es $%.2f' % persona
print(mensaje_con_formato)

nombre = 'Martín'
edad = 81
sueldo = 30000
# mensaje_con_formato = 'Nombre {} Edad {} Sueldo {:.2f}'.format(nombre, edad, sueldo)
# print(mensaje_con_formato)

#mensaje = 'Nombre {0} Edad {1} Sueldo {:.2f}'.format(nombre, edad, sueldo)

mensaje = 'Nombre {n} Edad {e} Sueldo {s:.2f}'.format(n=nombre, e=edad, s=sueldo)
# print(mensaje)

diccionario = {'nombre': 'Ivan', 'edad': 35, 'sueldo': 8000}
mensaje = 'Nombre: {dic[nombre]} Edad: {dic[edad]} Sueldo: {dic[sueldo]:.2f}'.format(dic=diccionario)
print(mensaje)
