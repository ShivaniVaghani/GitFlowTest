package com.example.script_runner.controller;

import com.example.script_runner.dto.ScriptDataDTO;
import com.example.script_runner.dto.ScriptParameterDTO;
import com.example.script_runner.model.ScriptData;
import com.example.script_runner.model.ScriptMetaData;
import com.example.script_runner.repository.ScriptRepository;
import com.example.script_runner.service.ScriptService;
import com.example.script_runner.transformer.ScriptTransformer;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/scripts")
@RequiredArgsConstructor
public class ScriptController {

    @Value("${script.python.interpreter}")
    private final String pythonInterpreter;

    private final String utilsScript;
    private final ScriptRepository repository;
    private final ScriptService scriptService;
    private final ScriptTransformer scriptTransformer;
    private static final Logger logger = LoggerFactory.getLogger(ScriptController.class);

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ScriptDataDTO> listScripts() {
        return scriptService.listConfigs();
    }

    private ResponseEntity<Map<String, String>> errorResponse(HttpStatus status, String message) {
        logger.error(message);
        return ResponseEntity.status(status).body(Map.of("error", message));
    }

    @SneakyThrows
    @PostMapping("/{name}/run")
    public ResponseEntity<?> runScript(@PathVariable String name, @RequestBody Map<String, String> params) {
        logger.info("Received request to run script '{}' params: {}", name, params);

        ScriptDataDTO scriptDataDTO;
        try {
            scriptDataDTO = scriptService.getConfigFor(name);
        } catch (ResponseStatusException ex) {
            return errorResponse(HttpStatus.NOT_FOUND, "Script not found: " + name);
        }

        Path tempDir;
        try {
            tempDir = Files.createTempDirectory("python_package_");
            Path scriptsDir = tempDir.resolve("scripts");
            Files.createDirectories(scriptsDir);

            Map<String, String> scripts = Map.of(
                    name + ".py", scriptDataDTO.getScriptBody(),
                    "utils.py", utilsScript,
                    "__init__.py", ""
            );

            for (Map.Entry<String, String> entry : scripts.entrySet()) {
                Files.writeString(scriptsDir.resolve(entry.getKey()), entry.getValue());
            }
        } catch (IOException e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to prepare script environment: " + e.getMessage());
        }

        List<String> command = new ArrayList<>();
        command.add(pythonInterpreter);
        command.add("-m");
        command.add("scripts." + name);

        for (ScriptParameterDTO p : scriptDataDTO.getParams()) {
            String key = p.getName();
            String val = params.getOrDefault(key, p.getDefaultValue());
            if (val != null) {
                command.add("--" + key);
                command.add(val);
            } else if (p.isRequired()) {
                return errorResponse(HttpStatus.BAD_REQUEST, "Missing required parameter: " + key);
            }
        }
        logger.debug("Executing command: {}", String.join(" ", command));

        try {
            ProcessBuilder pb = new ProcessBuilder(command)
                    .directory(tempDir.toFile())
                    .redirectErrorStream(true);

            Process proc = pb.start();

            String output;
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(proc.getInputStream()))) {
                output = reader.lines().collect(Collectors.joining("\n"));
            }

            int exitCode = proc.waitFor();
            if (exitCode != 0) {
                logger.error("Script '{}' failed with exit code {}: {}", name, exitCode, output);
                return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                        "The script failed to execute properly. Please check the script logic or parameters.");
            }

            // Handle output
            String filePath = output.trim();
            File outFile = new File(filePath);
            if (!outFile.exists()) {
                return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Output file not found: " + filePath);
            }

            Path outputDir = Paths.get("output");
            Files.createDirectories(outputDir);
            Path destination = outputDir.resolve(outFile.getName());
            Files.copy(outFile.toPath(), destination, StandardCopyOption.REPLACE_EXISTING);

            logger.info("Script '{}' completed successfully. Output: {}", name, filePath);
            return ResponseEntity.ok(Map.of("link", "/output/" + outFile.getName()));

        } catch (IOException | InterruptedException e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error running script: " + e.getMessage());
        } finally {
            FileUtils.deleteQuietly(tempDir.toFile());
        }
    }

    /**
     * List all active scripts (DB rows)
     */
    @GetMapping
    public ResponseEntity<?> listAll() {
        try {
            List<ScriptData> scriptDataList = repository.findAllByActiveTrue();
            return ResponseEntity.ok(scriptDataList);
        } catch (Exception ex) {
            String message = "An unexpected error occurred while fetching scripts. Please try again later.";
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, message);
        }
    }

    /**
     * Get a single script by its DB ID
     */
    @GetMapping("/{id}")
    public ScriptData getOne(@PathVariable Long id) {
        return repository.findById(id)
                .filter(ScriptData::isActive)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Script not found")
                );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createScript(
            @RequestPart("metadata") ScriptMetaData metadata,
            @RequestPart("file") MultipartFile file) {
        try {
            ScriptData script = scriptTransformer.toEntity(metadata);

            String code = new String(file.getBytes(), StandardCharsets.UTF_8);
            script.setScriptBody(code);

            ScriptData savedScript = repository.save(script);

            return ResponseEntity.ok(savedScript);

        } catch (DataIntegrityViolationException ex) {
            String msg = String.format(
                    "A script with the name '%s' already exists. Please choose a different name.",
                    metadata.getName()
            );
            return errorResponse(HttpStatus.CONFLICT, msg);

        } catch (IOException ex) {
            String msg = "Unable to read the uploaded script file. Please ensure the file is valid and try again.";
            return errorResponse(HttpStatus.BAD_REQUEST, msg);

        } catch (Exception ex) {
            String msg = "An unexpected error occurred while saving the script. Please try again later.";
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, msg);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ScriptData scriptData) {
        try {
            ScriptData existingScript = repository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Script with ID " + id + " not found")
                    );

            existingScript.setName(scriptData.getName());
            existingScript.setDescription(scriptData.getDescription());

            if (scriptData.getScriptBody() != null && !scriptData.getScriptBody().isEmpty()) {
                existingScript.setScriptBody(scriptData.getScriptBody());
            }
            existingScript.setParameters(scriptData.getParameters());
            existingScript.setVersion(scriptData.getVersion());
            existingScript.setActive(scriptData.isActive());

            ScriptData savedScript = repository.save(existingScript);
            return ResponseEntity.ok(savedScript);

        } catch (DataIntegrityViolationException ex) {
            String message = String.format(
                    "A script with the name '%s' already exists. Please choose a different name.",
                    scriptData.getName()
            );
            return errorResponse(HttpStatus.CONFLICT, message);

        } catch (ResponseStatusException ex) {
            throw ex;

        } catch (Exception ex) {
            String message = "An unexpected error occurred while updating the script. Please try again later.";
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, message);
        }
    }

    /**
     * Soft-delete (deactivate)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ScriptData existing = repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Script not found")
                );
        existing.setActive(false);
        repository.delete(existing);
        return ResponseEntity.noContent().build();
    }
}
