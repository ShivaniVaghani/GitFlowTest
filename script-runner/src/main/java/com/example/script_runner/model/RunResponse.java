package com.example.script_runner.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter@Setter@ToString
public class RunResponse {
    private String script;
    private String result;   // e.g. Base64 or file path
    // + constructors, getters, setters
}
