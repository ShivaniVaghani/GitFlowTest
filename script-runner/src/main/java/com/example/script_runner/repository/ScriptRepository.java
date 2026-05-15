package com.example.script_runner.repository;

import com.example.script_runner.model.ScriptData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScriptRepository extends JpaRepository<ScriptData, Long> {
    Optional<ScriptData> findByNameAndActiveTrue(String name);

    Optional<ScriptData> findByName(String name);

    List<ScriptData> findAllByActiveTrue();

    List<ScriptData> findAll();
}