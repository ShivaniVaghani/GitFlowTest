package com.example.script_runner.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Holds the configuration for all available Python scripts.
 */
@Component
public class ScriptRegistry {
    private final Map<String,ScriptConfig> registry = new LinkedHashMap<>();

    /**
     * Initialize the registry with each script's configuration.
     */
    @PostConstruct
    public void init() {
        // 1) Notice‑Delivery / Bill report
        registry.put(
                "get_notice_report_electric",
                new ScriptConfig(
                        "get_notice_report_electric",
                        "Generate ND or Bill Excel report for Salalah",
                        Arrays.asList(
                                new ScriptParameter("type", "nd", true,
                                        "nd or bill, determines which report to run"),
                                new ScriptParameter("startDate", null, false,
                                        "Start date (YYYY-MM-DD), defaults to first of last month"),
                                new ScriptParameter("endDate",   null, false,
                                        "End date (YYYY-MM-DD, HH:MM:SS), defaults to yesterday at 23:59:59")
                        )
                )
        );

        // 2) RAECO EL MMR report
        registry.put(
                "get_report_el_raeco",
                new ScriptConfig(
                        "get_report_el_raeco",
                        "RAECO EL MMR Report",
                        Arrays.asList(
                                new ScriptParameter("startDate", null, false,
                                        "Query start (YYYY-MM-DD, HH:MM:SS), defaults to yesterday 07:00:01"),
                                new ScriptParameter("endDate",   null, false,
                                        "Query end   (YYYY-MM-DD, HH:MM:SS), defaults to today 07:00:00")
                        )
                )
        );

        // … add any additional scripts here in exactly the same way …
    }

    /** Optional helper if you want to register at runtime. */
    public void register(ScriptConfig cfg) {
        registry.put(cfg.getName(), cfg);
    }

    /** Lookup by name. */
    public Optional<ScriptConfig> getConfig(String name) {
        return Optional.ofNullable(registry.get(name));
    }

    /** Return all registered configs. */
    public Collection<ScriptConfig> listConfigs() {
        return Collections.unmodifiableCollection(registry.values());
    }
}
