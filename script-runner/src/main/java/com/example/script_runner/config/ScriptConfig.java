package com.example.script_runner.config;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Holds configuration for a Python script: its name, a human-readable description,
 * and the list of parameters it accepts.
 */
public class ScriptConfig {
    private final String name;
    private final String description;
    private final List<ScriptParameter> params;

    /**
     * @param name the script identifier (without .py), e.g. "get_notice_report_electric"
     * @param description a short summary of what the script does
     * @param params ordered list of parameters the script accepts
     */
    public ScriptConfig(String name, String description, List<ScriptParameter> params) {
        this.name = Objects.requireNonNull(name, "Script name cannot be null");
        this.description = Objects.requireNonNull(description, "Description cannot be null");
        this.params = Collections.unmodifiableList(
                Objects.requireNonNull(params, "Params list cannot be null")
        );
    }

    /**
     * @return the script identifier (without file extension)
     */
    public String getName() {
        return name;
    }

    /**
     * @return human-readable description of what this script does
     */
    public String getDescription() {
        return description;
    }

    /**
     * @return an unmodifiable list of parameters (ScriptParam) this script expects
     */
    public List<ScriptParameter> getParams() {
        return params;
    }

    @Override
    public String toString() {
        return "ScriptConfig{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", params=" + params +
                '}';
    }


}
