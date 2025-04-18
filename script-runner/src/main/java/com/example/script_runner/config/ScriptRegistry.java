package com.example.script_runner.config;

import com.example.script_runner.config.ScriptConfig;
import com.example.script_runner.config.ScriptParameter;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.*;

/**
 * Holds the configuration for all available Python scripts.
 */
@Component
public class ScriptRegistry {
    private final Map<String, ScriptConfig> registry = new HashMap<>();

    /**
     * Initialize the registry with each script's configuration.
     */
    @PostConstruct
    public void init() {
        // Example registration for get_notice_report_electric
        registry.put(
                "get_notice_report_electric",
                new ScriptConfig(
                        "get_notice_report_electric",                  // script name (without .py)
                        "Generate ND or Bill Excel report for Salalah", // description
                        Arrays.asList(
                                new ScriptParameter("type", "nd", true,
                                        "nd or bill, determines which report to run"),
                                new ScriptParameter("startDate", null, false,
                                        "Start date (YYYY-MM-DD), defaults to first of last month"),
                                new ScriptParameter("endDate", null, false,
                                        "End date (YYYY-MM-DD, HH:MM:SS), defaults to yesterday at 23:59:59")
                        )
                )
        );

        // TODO: add other scripts similarly
        // registry.put("another_script", new ScriptConfig(...));
    }

    /**
     * Look up the configuration for a script by name.
     * @param name script name (without .py)
     * @return the ScriptConfig or null if not found
     */
    public ScriptConfig getConfig(String name) {
        return registry.get(name);
    }

    /**
     * List all registered script names.
     * @return set of script identifiers
     */
    public Set<String> listScriptNames() {
        return Collections.unmodifiableSet(registry.keySet());
    }

    /**
     * Retrieve all script configurations.
     * @return unmodifiable collection of configs
     */
    public Collection<ScriptConfig> listConfigs() {
        return Collections.unmodifiableCollection(registry.values());
    }
}
