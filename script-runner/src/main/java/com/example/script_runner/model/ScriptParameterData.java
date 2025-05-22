package com.example.script_runner.model;


import lombok.Data;

@Data
public class ScriptParameterData {
    private String name;
    private String defaultValue;
    private boolean required;
    private String description;
}