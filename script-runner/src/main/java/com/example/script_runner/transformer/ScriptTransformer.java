package com.example.script_runner.transformer;

import com.example.script_runner.model.ScriptData;
import com.example.script_runner.model.ScriptMetaData;
import org.springframework.stereotype.Component;

@Component
public class ScriptTransformer {

    public ScriptData toEntity(ScriptMetaData metadata) {
        ScriptData scriptData = new ScriptData();
        scriptData.setName(metadata.getName());
        scriptData.setDescription(metadata.getDescription());
        scriptData.setParameters(metadata.getParameters());
        scriptData.setVersion(metadata.getVersion());
        scriptData.setActive(metadata.isActive());
        return scriptData;
    }
}