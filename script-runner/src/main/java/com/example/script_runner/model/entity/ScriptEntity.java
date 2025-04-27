package com.example.script_runner.model.entity;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;


@NoArgsConstructor
@AllArgsConstructor
@Getter@Setter
@Builder
@Entity
@Table(name = "scripts")
public class ScriptEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(name = "script_body", columnDefinition = "TEXT", nullable = false)
    private String scriptBody;

    // Explicitly tell Hibernate 6 to use JsonBinaryType and JDBC JSON type
    @Type(JsonBinaryType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private List<ScriptParamDTO> parameters;

    @Column(nullable = false)
    private int version;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    // getters & setters
}