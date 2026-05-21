package eloProject.repository;

import eloProject.model.Tournament;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TournamentRepository extends MongoRepository<Tournament, String> {
    Optional<Tournament> findByGameIdAndName(String gameId, String name);
    List<Tournament> findByGameId(String gameId);
    void deleteByGameId(String gameId);
    //long deleteByGameId(String gameId); for logs
}
