package eloProject.repository;
import eloProject.model.Player;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PlayerRepository extends MongoRepository<Player, String> {
    Optional<Player> findByGameIdAndName(String gameId, String name);
    List<Player> findByGameId(String gameId);
    void deleteByGameId(String gameId);
    //long deleteByGameId(String gameId); for logs
}