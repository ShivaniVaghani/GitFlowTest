package com.example.script_runner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ScriptDataDTO {
    private final String name;
    private final String description;
    private final String scriptBody;
    private final List<ScriptParameterDTO> params;
}