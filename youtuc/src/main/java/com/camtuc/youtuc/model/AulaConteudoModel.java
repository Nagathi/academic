package com.camtuc.youtuc.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "aula_conteudo")
@Getter
@Setter
public class AulaConteudoModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;
    private String titulo;
    private String descricao;
    private String url;


    @ManyToOne
    @JoinColumn(name = "aula_id")
    private AulaModel aula;
}
