package com.app.petpals.utils;

import com.app.petpals.entity.DogTag;
import com.app.petpals.payload.dogTag.DogTagRequest;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Component
public class DataInitializationListener implements ApplicationListener<ApplicationReadyEvent> {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DataInitializationListener(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            InputStream inputStream = new ClassPathResource("dogTags.json").getInputStream();
            List<DogTagRequest> tags = objectMapper.readValue(inputStream, new TypeReference<List<DogTagRequest>>() {});

            String insertQuery = """
                INSERT INTO dog_tag (id, tag, category)
                SELECT gen_random_uuid(), ?, ?
                WHERE NOT EXISTS (
                    SELECT 1 FROM dog_tag WHERE tag = ?
                )
            """;

            for (DogTagRequest tag : tags) {
                jdbcTemplate.update(insertQuery, tag.getTag(), tag.getCategory(), tag.getTag());
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
