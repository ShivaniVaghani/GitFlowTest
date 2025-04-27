package com.example.script_runner.model.entity;


import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ScriptParamDTO {
    private String name;
    private String defaultValue;
    private boolean required;
    private String description;

    // default ctor, getters & setters
}