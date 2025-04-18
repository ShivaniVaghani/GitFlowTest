# Python Script Runner UI

## Overview
This project provides a simple web UI to select and execute Python scripts (e.g. `get_notice_report_electric`) with custom parameters, and download the resulting Excel/PDF.

## Prerequisites
- Java 17+ and Maven or Gradle
- Python 3 with required libraries installed
- IntelliJ IDEA (or another Java IDE)
- Your Python scripts in a known folder (e.g. `scripts/`)

## Phase 1: Local Setup

1. **Project Bootstrap**
    - Initialize a new Spring Boot project (Maven or Gradle) in IntelliJ.
    - Add dependencies:
      ```xml
      <!-- pom.xml example -->
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
      </dependency>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
      </dependency>
      ```

2. **Script Registry**
    - Create a `Map<String, ScriptConfig>` in Java listing each script name and its parameters.

3. **Service Layer**
    - Implement `ScriptService` with:
        - `List<String> getAvailableScripts()`
        - `ScriptConfig getConfigFor(String scriptName)`

4. **Controller & Endpoints**
    - `GET /scripts` → returns available script names
    - `GET /scripts/{name}/config` → returns that script’s parameter list
    - `POST /scripts/{name}/run` → accepts JSON parameters and executes the script

5. **UI Skeleton**
    - Build a Thymeleaf (or plain HTML/JS) page:
        - `<select>` bound to `GET /scripts`
        - Dynamic form area: on change, fetch `/scripts/{name}/config` and render inputs

6. **Invoking Python**
    - In your `POST /run` handler, use `ProcessBuilder`:
      ```java
      new ProcessBuilder("python3",
                         "scripts/" + name + ".py",
                         "--param1", val1,
                         "--param2", val2, …)
        .start();
      ```

7. **Capturing & Returning Output**
    - Have scripts write to a temp folder or emit Base64 on stdout
    - Capture stdout/stderr and exit code in Java
    - On success, return JSON with download link or Base64 + filename

8. **Downloading in the UI**
    - If file‑based: render a link/button to download
    - If Base64: decode and trigger download via JavaScript

9. **Error Handling & Logging**
    - Stream Python stderr to your logs
    - If exit code ≠ 0, return HTTP 4xx/5xx with the error message

10. **Test Locally**
    - Run your Spring Boot app at `http://localhost:8080`
    - Verify you can:
        1. List scripts
        2. Fill parameters
        3. Execute and download Excel/PDF

## Next Steps (Phase 2)
- Dockerize the Spring Boot + Python runtime
- Secure endpoints (authentication/authorization)
- CI/CD and cloud deployment
