package eloProject.repository;
import eloProject.model.Roster;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RosterRepository extends MongoRepository<Roster, String> {
    List<Roster> findAllByTournamentId(String tournamentId);
    Optional<Roster> findByTournamentIdAndPlayerId(String tournamentId, String playerId);
    void deleteAllByTournamentId(String tournamentId);
    void deleteAllByPlayerId(String playerId);
}
