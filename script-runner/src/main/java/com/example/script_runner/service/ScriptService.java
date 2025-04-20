package com.example.script_runner.service;

import com.example.script_runner.config.ScriptConfig;
import com.example.script_runner.config.ScriptRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public List<ScriptConfig> listConfigs() {
        return new ArrayList<>(registry.listConfigs());
    }

    /**
     * @param name the script identifier
     * @return its config (parameter definitions)
     * @throws 404 if not found
     */
    public ScriptConfig getConfigFor(String name) {
        return registry.getConfig(name)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Script not found: " + name
                ));
    }
}
