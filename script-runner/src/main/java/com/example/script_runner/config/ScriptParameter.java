package com.example.script_runner.config;

/**
 * Represents a single parameter for a script: its name, whether it's required,
 * its default value, and a description for documentation/UI purposes.
 */
public class ScriptParameter {
    private final String name;
    private final String defaultValue;
    private final boolean required;
    private final String description;

    /**
     * @param name the flag name (without the leading "--"), e.g. "startDate"
     * @param defaultValue the default value if not provided (may be null)
     * @param required whether this parameter must be supplied
     * @param description human-friendly description
     */
    public ScriptParameter(String name, String defaultValue, boolean required, String description) {
        this.name = name;
        this.defaultValue = defaultValue;
        this.required = required;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public boolean isRequired() {
        return required;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return "ScriptParam{" +
                "name='" + name + '\'' +
                ", defaultValue='" + defaultValue + '\'' +
                ", required=" + required +
                ", description='" + description + '\'' +
                '}';
    }
}
