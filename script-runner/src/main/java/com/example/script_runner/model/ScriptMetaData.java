package com.example.script_runner.model;

import lombok.Data;

import java.util.List;

@Data
public class ScriptMetaData {
    private String name;
    private String description;
    private List<ScriptParameterData> parameters;
    private int version;
    private boolean active;
}