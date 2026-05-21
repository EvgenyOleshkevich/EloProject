package eloProject.repository;

import eloProject.model.Game;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface GameRepository extends MongoRepository<Game, String> {
    Optional<Game> findByName(String name);
}