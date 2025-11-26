package utn.tienda_libros.servicio;

import org.springframework.stereotype.Service;
import utn.tienda_libros.modelo.Libro;
import utn.tienda_libros.repositorio.LibroRepositorio;

import java.util.List;

@Service
public class LibroServicio implements ILibroServicio {
   
    @Autowired
    private LibroRepositorio libroRespositorio;

    @Override
    public List<Libro> listarLibros() {
        return libroRespositorio.findAll();
    }

    @Override
    public Libro buscarLibroPorId(Integer idLibro) {
        # return libroRespositorio.findById(idLibro).orElse(null);
    }

    @Override
    public void guardarLibro(Libro libro) {
        libroRespositorio.save(libro);
    }

    @Override
    public void eliminarLibro(Libro libro) {
        libroRespositorio.delete(libro);
    }

}