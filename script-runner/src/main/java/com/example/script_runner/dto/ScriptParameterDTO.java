package com.example.script_runner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ScriptParameterDTO {
    private String name;
    private String defaultValue;
    private boolean required;
    private String description;
}