package com.example.script_runner.model.entity;

import com.example.script_runner.model.entity.ScriptParamDTO;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ScriptMetadataDTO {
    private String name;
    private String description;
    private List<ScriptParamDTO> parameters;
    private int version;
    private boolean active;
}
