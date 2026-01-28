package com.gestioneventos.cofira.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "registro_comida_consumida", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"usuario_id", "fecha", "tipo_comida"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroComidaConsumida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "tipo_comida", nullable = false)
    private String tipoComida;

    @Column(name = "comida_menu_id")
    private Integer comidaMenuId;

    @Column(name = "consumio_menu", nullable = false)
    @Builder.Default
    private Boolean consumioMenu = false;

    @Column(name = "comida_alternativa", columnDefinition = "TEXT")
    private String comidaAlternativa;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(name = "calorias_reales")
    private Integer caloriasReales;

    @Column(name = "proteinas_reales")
    private Integer proteinasReales;

    @Column(name = "carbohidratos_reales")
    private Integer carbohidratosReales;

    @Column(name = "grasas_reales")
    private Integer grasasReales;

    @Column(name = "creado_en", nullable = false)
    @Builder.Default
    private LocalDateTime creadoEn = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (creadoEn == null) {
            creadoEn = LocalDateTime.now();
        }
    }
}
