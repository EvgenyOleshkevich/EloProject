package eloProject.resolver;

import eloProject.model.Match;
import eloProject.model.Player;
import eloProject.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.graphql.data.method.annotation.BatchMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class MatchResolver {
    private final PlayerRepository playerRepository;

    /*
    @BatchMapping(typeName = "Match", field = "player1")
    public Map<Match, Player> player1(@NonNull List<Match> matches) {
        List<String> ids = matches.stream()
                .map(Match::getPlayer1Id)
                .distinct()
                .toList();

        Map<String, Player> playersById = playerRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Player::getId, p -> p));

        return matches.stream()
                .collect(Collectors.toMap(
                        match -> match,
                        match -> playersById.get(match.getPlayer1Id())
                ));
    }

    @BatchMapping(typeName = "Match", field = "player2")
    public Map<Match, Player> player2(@NonNull List<Match> matches) {
        List<String> ids = matches.stream()
                .map(Match::getPlayer2Id)
                .distinct()
                .toList();

        Map<String, Player> playersById = playerRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Player::getId, p -> p));

        return matches.stream()
                .collect(Collectors.toMap(
                        match -> match,
                        match -> playersById.get(match.getPlayer2Id())
                ));
    }
    */

    @BatchMapping(typeName = "Match", field = "player1")
    public Map<Match, String> player1Name(List<Match> matches) {
        List<String> ids = matches.stream()
                .map(Match::getPlayer1Id)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        Map<String, String> namesById = playerRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Player::getId, Player::getName));


        Map<Match, String> result = new LinkedHashMap<>();

        for (Match match : matches) {
            String playerId = match.getPlayer1Id();

            if (playerId == null) {
                result.put(match, null);
                continue;
            }

            var name = namesById.get(playerId);
            result.put(match, name);
        }
        return result;
    }

    @BatchMapping(typeName = "Match", field = "player2")
    public Map<Match, String> player2Name(List<Match> matches) {
        List<String> ids = matches.stream()
                .map(Match::getPlayer2Id)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        Map<String, String> namesById = playerRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Player::getId, Player::getName));

        Map<Match, String> result = new LinkedHashMap<>();

        for (Match match : matches) {
            String playerId = match.getPlayer2Id();

            if (playerId == null) {
                result.put(match, null);
                continue;
            }

            var name = namesById.get(playerId);
            result.put(match, name);
        }
        return result;
    }

    /*@BatchMapping(typeName = "Match", field = "player2")
    public Map<Match, String> player2NameOld(List<Match> matches) {
        List<String> ids = matches.stream()
                .map(Match::getPlayer2Id)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        Map<String, String> namesById = playerRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Player::getId, Player::getName));

        return matches.stream()
                .collect(Collectors.toMap(
                        Function.identity(),
                        match -> {
                            String playerId = match.getPlayer1Id();
                            return playerId == null ? null : namesById.get(playerId);
                        }
                ));
    }*/
}