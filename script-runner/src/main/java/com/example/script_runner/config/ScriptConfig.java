package com.example.script_runner.config;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ScriptConfig {
    private final String name;
    private final String description;
    private final String scriptBody;
    private final List<ScriptParameter> params;
}