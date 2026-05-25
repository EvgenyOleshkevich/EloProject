package eloProject.repository;
import eloProject.model.Character;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CharacterRepository extends MongoRepository<Character, String> {
    Optional<Character> findByGameIdAndName(String gameId, String name);
    List<Character> findByGameId(String gameId);
    List<Character> findAllByIdIn(List<String> ids);
    void deleteByGameId(String gameId);
}