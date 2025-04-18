package com.example.script_runner.service;

import com.example.script_runner.config.ScriptConfig;
import com.example.script_runner.config.ScriptRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ScriptService {

    private final ScriptRegistry registry;

    @Autowired
    public ScriptService(ScriptRegistry registry) {
        this.registry = registry;
    }

    /**
     * @return list of all available script names
     */
    public List<String> getAvailableScripts() {
        return List.copyOf(registry.listScriptNames());
    }

    /**
     * @param name the script identifier
     * @return its config (parameter definitions)
     * @throws 404 if not found
     */
    public ScriptConfig getConfigFor(String name) {
        ScriptConfig cfg = registry.getConfig(name);
        if (cfg == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Script not found: " + name
            );
        }
        return cfg;
    }
}
