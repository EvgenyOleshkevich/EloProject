package eloProject.repository;
import eloProject.model.Match;

import eloProject.model.Player;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends MongoRepository<Match, String> {
    List<Match> findByGameId(String gameId);
    List<Match> findByGameIdAndPlayer1IdOrGameIdAndPlayer2Id(
            String gameId1, String player1Id,
            String gameId2, String player2Id
    );
    List<Match> findByPlayer1IdOrPlayer2Id(
            String player1Id,
            String player2Id
    );
    List<Match> findAllByTournamentId(String tournamentId);
    void deleteAllByGameId(String gameId);
    void deleteAllByTournamentId(String tournamentId);
}
