package com.example.script_runner.model.entity;


import lombok.Data;

@Data
public class ScriptParamDTO {
    private String name;
    private String defaultValue;
    private boolean required;
    private String description;

    // default ctor, getters & setters
}