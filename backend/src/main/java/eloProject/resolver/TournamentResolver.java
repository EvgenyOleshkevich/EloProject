package eloProject.resolver;

import eloProject.model.Match;
import eloProject.model.Player;
import eloProject.model.Tournament;
import eloProject.repository.MatchRepository;
import eloProject.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class TournamentResolver {
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;

    @SchemaMapping(typeName = "Tournament", field = "players")
    public List<Player> players(Tournament tournament) {
        return playerRepository.findAllById(tournament.getPlayerIds());
    }

    @SchemaMapping(typeName = "Tournament", field = "matches")
    public List<Match> matches(Tournament tournament) {
        return matchRepository.findAllByTournamentId(tournament.getId());
    }

    /*
    @BatchMapping(typeName = "Tournament", field = "players")
    public Map<Tournament, List<Player>> players(List<Tournament> tournaments) {
        Set<String> allPlayerIds = tournaments.stream()
                .flatMap(t -> t.getPlayerIds().stream())
                .collect(Collectors.toSet());

        Map<String, Player> playersById = playerService.findAllByIds(allPlayerIds)
                .stream()
                .collect(Collectors.toMap(Player::getId, Function.identity()));

        return tournaments.stream()
                .collect(Collectors.toMap(
                        Function.identity(),
                        t -> t.getPlayerIds().stream()
                                .map(playersById::get)
                                .filter(Objects::nonNull)
                                .toList()
                ));
    }
    */
}
