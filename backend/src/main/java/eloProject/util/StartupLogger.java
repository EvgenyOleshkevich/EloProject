package eloProject.util;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StartupLogger implements CommandLineRunner {

    @Value("${spring.mongodb.uri:NOT_FOUND}")
    private String mongoUri;
    @Value("${spring.mongodb.database:NOT_FOUND}")
    private String database;

    private final MongoTemplate mongoTemplate;

    @Override
    public void run(String... args) {
        System.out.println("MONGO URI = " + mongoUri);
        System.out.println("MONGO database = " + database);
        System.out.println("MongoTemplate DB = " + mongoTemplate.getDb().getName());
    }
}
