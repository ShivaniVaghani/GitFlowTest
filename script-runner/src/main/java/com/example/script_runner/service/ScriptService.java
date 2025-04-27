package com.example.script_runner.service;

import com.example.script_runner.config.ScriptConfig;
import com.example.script_runner.config.ScriptParameter;
import com.example.script_runner.model.entity.ScriptEntity;
import com.example.script_runner.model.entity.ScriptParamDTO;
import com.example.script_runner.repository.ScriptRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScriptService {

    private final ScriptRepository repository;

    @Autowired
    public ScriptService(ScriptRepository repository) {
        this.repository = repository;
    }

    public List<ScriptConfig> listConfigs() {
        return repository.findAllByActiveTrue().stream()
                .map(this::toConfig)
                .collect(Collectors.toList());
    }

    public ScriptConfig getConfigFor(String name) {
        ScriptEntity e = repository.findByNameAndActiveTrue(name)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Script not found: " + name));
        return toConfig(e);
    }

    private ScriptConfig toConfig(ScriptEntity e) {
        List<ScriptParameter> params = e.getParameters().stream()
                .map(p -> new ScriptParameter(
                        p.getName(),
                        p.getDefaultValue(),
                        p.isRequired(),
                        p.getDescription()))
                .collect(Collectors.toList());
        return new ScriptConfig(e.getName(), e.getDescription(), params);
    }
}
