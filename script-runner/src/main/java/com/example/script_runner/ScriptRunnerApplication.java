package com.example.script_runner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource(value = "file:/Users/Shared/secret/secret.env", ignoreResourceNotFound = true)
public class ScriptRunnerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ScriptRunnerApplication.class, args);
    }
}
