package com.example.script_runner.model.entity;

import lombok.Data;

import java.util.List;

@Data
public class ScriptMetadataDTO {
    private String name;
    private String description;
    private List<ScriptParamDTO> parameters;
    private int version;
    private boolean active;
}