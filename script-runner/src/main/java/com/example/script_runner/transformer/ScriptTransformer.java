package com.example.script_runner.transformer;

import com.example.script_runner.model.entity.ScriptEntity;
import com.example.script_runner.model.entity.ScriptMetadataDTO;
import org.springframework.stereotype.Component;

@Component
public class ScriptTransformer {

    public ScriptEntity toEntity(ScriptMetadataDTO metadata) {
        ScriptEntity scriptEntity = new ScriptEntity();
        scriptEntity.setName(metadata.getName());
        scriptEntity.setDescription(metadata.getDescription());
        scriptEntity.setParameters(metadata.getParameters());
        scriptEntity.setVersion(metadata.getVersion());
        scriptEntity.setActive(metadata.isActive());
        return scriptEntity;
    }
}