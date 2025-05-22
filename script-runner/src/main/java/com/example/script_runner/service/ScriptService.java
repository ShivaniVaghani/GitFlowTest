package com.example.script_runner.service;

import com.example.script_runner.dto.ScriptDataDTO;
import com.example.script_runner.dto.ScriptParameterDTO;
import com.example.script_runner.model.ScriptData;
import com.example.script_runner.repository.ScriptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScriptService {

    private final ScriptRepository repository;

    public List<ScriptDataDTO> listConfigs() {
        return repository.findAll().stream()
                .map(this::toConfig)
                .collect(Collectors.toList());
    }

    public ScriptDataDTO getScriptConfigByName(String name) {
        ScriptData e = repository.findByName(name)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Script not found: " + name));
        return toConfig(e);
    }

    public ScriptDataDTO getConfigFor(String name) {
        ScriptData e = repository.findByNameAndActiveTrue(name)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Script not found: " + name));
        return toConfig(e);
    }

    private ScriptDataDTO toConfig(ScriptData scriptData) {
        List<ScriptParameterDTO> params = scriptData.getParameters().stream()
                .map(p -> new ScriptParameterDTO(
                        p.getName(),
                        p.getDefaultValue(),
                        p.isRequired(),
                        p.getDescription()))
                .collect(Collectors.toList());
        return new ScriptDataDTO(scriptData.getName(), scriptData.getDescription(), scriptData.getScriptBody(), params);
    }
}
