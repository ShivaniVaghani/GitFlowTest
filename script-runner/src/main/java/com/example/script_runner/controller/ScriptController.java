package com.example.script_runner.controller;

import com.example.script_runner.config.ScriptConfig;
import com.example.script_runner.config.ScriptParameter;
import com.example.script_runner.service.ScriptService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.*;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;



@RestController
@RequestMapping("/scripts")
public class ScriptController {

    @Value("${script.python.interpreter}")
    private String pythonInterpreter;
    private static final Logger logger = LoggerFactory.getLogger(ScriptController.class);

    private final ScriptService scriptService;

    public ScriptController(ScriptService scriptService) {
        this.scriptService = scriptService;
    }

    @Value("${scripts.directory:./scripts}")
    private String scriptsDir;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ScriptConfig> listScripts() {
        return scriptService.listConfigs();
    }
    @PostMapping("/{name}/run")
    public ResponseEntity<?> runScript(
            @PathVariable String name,
            @RequestBody Map<String, String> params
    ) {
        logger.info("Received request to run script '{}'", name);

        // 1) Lookup script configuration
        ScriptConfig cfg;
        try {
            cfg = scriptService.getConfigFor(name);
        } catch (ResponseStatusException ex) {
            logger.error("Script not found: {}", name);
            throw ex;
        }

        // 2) Build command dynamically
        List<String> cmd = new ArrayList<>();
        cmd.add(pythonInterpreter);
        cmd.add("-m");
        cmd.add("scripts." + name);

        for (ScriptParameter p : cfg.getParams()) {
            String key = p.getName();
            String val = params.getOrDefault(key, p.getDefaultValue());
            if (val != null) {
                cmd.add("--" + key);
                cmd.add(val);
            } else if (p.isRequired()) {
                String msg = "Missing required parameter: " + key;
                logger.warn(msg);
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("error", msg));
            }
        }

        logger.debug("Executing command: {}", String.join(" ", cmd));

        try {
            // 3) Start the process in project root (parent of scriptsDir)
            ProcessBuilder pb = new ProcessBuilder(cmd)
                    .directory(new File(scriptsDir).getParentFile())
                    .redirectErrorStream(true);

            Process proc = pb.start();

            // 4) Capture full stdout/stderr
            String output;
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(proc.getInputStream())
            )) {
                output = reader.lines().collect(Collectors.joining("\n"));
            }
            int exitCode = proc.waitFor();
            logger.debug("Process exited with code {}", exitCode);

            if (exitCode != 0) {
                logger.error("Script '{}' failed with exit {}: {}", name, exitCode, output);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of(
                                "error",  "Script failed (" + name + "), exit=" + exitCode,
                                "output", output
                        ));
            }

            // 5) Parse the printed file path
            String filePath = output.trim();
            File outFile = new File(filePath);
            if (!outFile.exists()) {
                logger.error("Expected output file not found: {}", filePath);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Output file not found: " + filePath));
            }

            // 6) Build and return public URL under /files/
            String filename = outFile.getName();
            String link = "/output/" + filename;
            logger.info("Script '{}' completed successfully, output stored at {}", name, filePath);

            return ResponseEntity.ok(Map.of(
                    "link", link
            ));

        } catch (IOException | InterruptedException e) {
            logger.error("Error running script '{}': {}", name, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

}
