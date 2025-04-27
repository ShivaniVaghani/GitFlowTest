package com.example.script_runner.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // default to the "Output" folder in your project root
    @Value("${output.directory:Output}")
    private String outputDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1) compute absolute path, without converting to a URI
        String absPath = Paths.get(outputDir)
                .toAbsolutePath()
                .toString();

        // 2) ensure trailing slash so Spring knows it's a directory
        if (!absPath.endsWith("/")) {
            absPath += "/";
        }

        // Log out for sanity
        System.out.println(">>> Serving /output/** from " + absPath);

        registry.addResourceHandler("/output/**")
                .addResourceLocations("file:" + absPath);
    }
}
