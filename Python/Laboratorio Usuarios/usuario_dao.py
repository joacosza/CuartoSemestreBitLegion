from usuario import Usuario
from cursor_del_pool import CursorDelPool
from logger_base import log


class UsuarioDAO:
    _SELECCIONAR = 'SELECT * FROM usuario ORDER BY id_usuario'
    _INSERTAR = 'INSERT INTO usuario (username, password) VALUES (%s, %s)'
    _ACTUALIZAR = 'UPDATE usuario SET username = %s, password = %s WHERE id_usuario = %s'
    _ELIMINAR = 'DELETE FROM usuario WHERE id_usuario = %s'


    # Definimos los métodos de clase
    @classmethod
    def seleccionar(cls):
        with CursorDelPool() as cursor:
            log.debug('Seleccionando usuarios: ')
            cursor.execute(cls._SELECCIONAR) 
            registros = cursor.fetchall()
            usuarios = [] # Creación de una lista
            for registro in registros:
                usuario = Usuario(registro[0], registro[1], registro[2])
                usuarios.append(usuario)
            return usuarios
            

    @classmethod
    def insertar(cls, usuario):
        with CursorDelPool() as cursor:
            log.debug(f'Usuario a insertar: {usuario}')
            valores = (usuario.username, usuario.password)
            cursor.execute(cls._INSERTAR, valores)
            return cursor.rowcount


    @classmethod
    def actualizar(cls, usuario):
        with CursorDelPool() as cursor:
            log.debug(f'Usuario a actualizar: {usuario}')
            valores = (usuario.username, usuario.password, usuario.id_usuario)
            cursor.execute(cls._ACTUALIZAR, valores)
            return cursor.rowcount


    @classmethod
    def eliminar(cls, usuario):
        with CursorDelPool() as cursor:
            log.debug(f'Usuario a eliminar: {usuario}')
            valores = (usuario.id_usuario,)
            cursor.execute(cls._ELIMINAR, valores)
            return cursor.rowcount


if __name__ == '__main__':

    # Insertar usuario
    #usuario = Usuario(username="kely", password="1234")
    #usuario_insertado = UsuarioDAO.insertar(usuario)
    #log.debug(f'Usuario insertado: {usuario_insertado}')

    # Actualizar usuario
    usuario = Usuario(username="aylen", password= '1234', id_usuario=2)
    usuario_actualizado = UsuarioDAO.actualizar(usuario)
    log.debug(f'Usuario actualizado: {usuario}')

    # Seleccionar objetos
    usuarios = UsuarioDAO.seleccionar()
    for usuario in usuarios:
        log.debug(usuario)