package com.example.script_runner.config;

import com.example.script_runner.service.ScriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class AppConfig {

    private final ScriptService scriptService;

    @Bean
    public String utilsScript() {
        return scriptService.getScriptConfigByName("UtilsScript").getScriptBody();
    }
}