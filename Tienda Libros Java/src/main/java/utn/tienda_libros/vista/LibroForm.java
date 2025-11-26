package utn.tienda_libros.vista;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utn.tienda_libros.modelo.Libro;
import utn.tienda_libros.servicio.LibroServicio;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@Component
public class LibroForm extends JFrame {

    private final LibroServicio libroServicio;
    private JPanel panel;
    private JTable tablaLibros;
    private JTextField libroTexto;
    private JTextField autorTexto;
    private JTextField precioTexto;
    private JTextField existenciasTexto;
    private JButton eliminarButton;
    private JButton modificarButton;
    private JButton agregarButton;
    private JLabel actualizacion;
    private JLabel totalLibros;
    private JLabel totalEstimado;
    private DefaultTableModel tablaModeloLibros;

    @Autowired
    public LibroForm(LibroServicio libroServicio) {
        this.libroServicio = libroServicio;
        inicializar();
    }

    private void inicializar() {
        setContentPane(panel);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(900, 700);
        centrarVentana();
        setVisible(true);

        agregarButton.addActionListener(e -> agregarLibro());
        eliminarButton.addActionListener(e -> eliminarLibro());
        modificarButton.addActionListener(e -> modificarLibro());
        tablaLibros.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                detectarSeleccionCelda();
            }
        });

        actualizarTodo();
    }

    private void centrarVentana() {
        Dimension pantalla = Toolkit.getDefaultToolkit().getScreenSize();
        int x = (pantalla.width - getWidth()) / 2;
        int y = (pantalla.height - getHeight()) / 2;
        setLocation(x, y);
    }

    private void agregarLibro() {
        if (camposVacios(libroTexto, autorTexto, precioTexto, existenciasTexto)) {
            mostrarMensaje("Completa todos los campos antes de agregar un libro.");
            return;
        }

        Double precio = convertirADouble(precioTexto.getText());
        Integer existencias = convertirAEntero(existenciasTexto.getText());

        if (precio == null || existencias == null) {
            mostrarMensaje("Precio o existencias inválidas. Deben ser números.");
            return;
        }

        Libro libro = new Libro(null,
                libroTexto.getText(),
                autorTexto.getText(),
                precio,
                existencias
        );

        libroServicio.guardarLibro(libro);
        mostrarMensaje("Se agregó el libro: " + libro.getNombreLibro() + " (Autor: " + libro.getAutor() + ")");
        limpiarFormulario();
        listarLibros();
    }

    private void modificarLibro() {
        Libro libro = detectarSeleccionCelda();
        if (libro == null) {
            mostrarMensaje("Selecciona un libro antes de modificar.");
            return;
        }

        if (camposVacios(libroTexto, autorTexto, precioTexto, existenciasTexto)) {
            mostrarMensaje("Todos los campos deben estar completos.");
            return;
        }

        Double precio = convertirADouble(precioTexto.getText());
        Integer existencias = convertirAEntero(existenciasTexto.getText());
        if (precio == null || existencias == null) {
            mostrarMensaje("Precio o existencias inválidas.");
            return;
        }

        libro.setNombreLibro(libroTexto.getText().trim());
        libro.setAutor(autorTexto.getText().trim());
        libro.setPrecio(precio);
        libro.setExistencias(existencias);

        libroServicio.guardarLibro(libro);
        listarLibros();
        mostrarMensaje("Se ha modificado el libro.");
    }

    private Libro detectarSeleccionCelda() {
        int fila = tablaLibros.getSelectedRow();
        if (fila == -1) return null;

        int id = Integer.parseInt(tablaLibros.getValueAt(fila, 0).toString());
        Libro libro = libroServicio.buscarLibroPorId(id);
        if (libro == null) return null;

        libroTexto.setText(libro.getNombreLibro());
        autorTexto.setText(libro.getAutor());
        precioTexto.setText(libro.getPrecio().toString());
        existenciasTexto.setText(libro.getExistencias().toString());
        return libro;
    }

    private void eliminarLibro() {
        int fila = tablaLibros.getSelectedRow();
        if (fila == -1) {
            mostrarMensaje("Selecciona un libro para eliminar.");
            return;
        }

        int id = Integer.parseInt(tablaLibros.getValueAt(fila, 0).toString());
        Libro libro = libroServicio.buscarLibroPorId(id);
        if (libro == null) return;

        int opcion = JOptionPane.showConfirmDialog(
                this,
                "¿Eliminar el libro \"" + libro.getNombreLibro() + "\"?",
                "Confirmar eliminación",
                JOptionPane.YES_NO_OPTION
        );

        if (opcion == JOptionPane.YES_OPTION) {
            libroServicio.eliminarLibro(libro);
            mostrarMensaje("Libro eliminado correctamente.");
            listarLibros();
        }
    }

    private void createUIComponents() {
        String[] columnas = {"Id", "Libro", "Autor", "Precio", "Existencias"};
        tablaModeloLibros = new DefaultTableModel(columnas, 0);
        tablaLibros = new JTable(tablaModeloLibros) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        tablaLibros.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        listarLibros();
    }

    private void listarLibros() {
        tablaModeloLibros.setRowCount(0);
        List<Libro> libros = libroServicio.listarLibros();

        for (Libro libro : libros) {
            Object[] fila = {
                    libro.getIdLibro(),
                    libro.getNombreLibro(),
                    libro.getAutor(),
                    libro.getPrecio(),
                    libro.getExistencias()
            };
            tablaModeloLibros.addRow(fila);
        }
        actualizarTodo();
    }

    private void actualizarTodo() {
        actualizarFechaHora();
        actualizarTotalExistencias();
        actualizarValorEstimado();
    }

    private void actualizarFechaHora() {
        if (actualizacion == null) return;
        String fechaHora = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
        actualizacion.setText("Última actualización BD: " + fechaHora);
    }

    private void actualizarTotalExistencias() {
        if (totalLibros == null) return;
        int total = libroServicio.listarLibros()
                .stream()
                .mapToInt(Libro::getExistencias)
                .sum();
        totalLibros.setText("Total de existencias: " + total);
    }

    private void actualizarValorEstimado() {
        if (totalEstimado == null) return;
        double total = libroServicio.listarLibros()
                .stream()
                .mapToDouble(libro -> libro.getPrecio() * libro.getExistencias())
                .sum();
        totalEstimado.setText("Total estimado: $" + total);
    }

    // Métodos auxiliares

    private void limpiarFormulario() {
        libroTexto.setText("");
        autorTexto.setText("");
        precioTexto.setText("");
        existenciasTexto.setText("");
    }

    private void mostrarMensaje(String mensaje) {
        JOptionPane.showMessageDialog(this, mensaje);
    }

    private boolean camposVacios(JTextField... campos) {
        for (JTextField campo : campos) {
            if (campo.getText().trim().isEmpty()) return true;
        }
        return false;
    }

    private Double convertirADouble(String texto) {
        try {
            return Double.parseDouble(texto.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Integer convertirAEntero(String texto) {
        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
