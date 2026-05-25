package eloProject.service;

import eloProject.dto.RosterInput;
import eloProject.model.Match;
import eloProject.model.Player;
import eloProject.model.RatingResult;
import eloProject.model.Roster;
import eloProject.repository.MatchRepository;
import eloProject.repository.PlayerRepository;
import eloProject.repository.RosterRepository;
import eloProject.util.EloCounter;
import eloProject.util.enums.CompetitionStatus;
import eloProject.util.enums.MatchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final RosterRepository rosterRepository;

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public List<Player> getAllPlayersByGame(String gameId) {
        return playerRepository.findByGameId(gameId);
    }

    public List<Player> validateAndLoadPlayers(List<String> playerIds, String gameId) {
        // 1. Проверка дублей
        Set<String> uniqueIds = new HashSet<>(playerIds);
        if (uniqueIds.size() != playerIds.size()) {
            throw new RuntimeException("Duplicate playerIds");
        }

        // 2. Загрузка игроков
        List<Player> players = playerRepository.findAllById(playerIds);

        // 3. Проверка существования
        if (players.size() != playerIds.size()) {
            Set<String> foundIds = players.stream()
                    .map(Player::getId)
                    .collect(Collectors.toSet());

            List<String> missingIds = playerIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();

            throw new RuntimeException("Players not found: " + missingIds);
        }

        // 4. Проверка gameId
        boolean allMatchGame = players.stream()
                .allMatch(p -> p.getGameId().equals(gameId));

        if (!allMatchGame) {
            throw new RuntimeException("Some players do not belong to this game");
        }

        return players;
    }

    public Optional<Player> getPlayer(String id) {
        return playerRepository.findById(id);
    }

    public Optional<Player> getPlayerByGameIdAndName(String gameId, String name) {
        return playerRepository.findByGameIdAndName(gameId, name);
    }

    public Optional<Roster> getRoster(String tournamentId, String playerId) {
        return rosterRepository.findByTournamentIdAndPlayerId(tournamentId, playerId);
    }

    public Roster updateRoster(RosterInput input) {
        var roster = rosterRepository.findById(input.getId())
                .orElseThrow(() -> new RuntimeException("Roster not found"));

        roster.setCharacters(input.getCharacters());
        roster.setWeapons(input.getWeapons());

        return rosterRepository.save(roster);
    }

    private Player create(String gameId, String name) {
        return Player.builder()
                .gameId(gameId)
                .name(name)
                .elo(1000)
                .build();
    }

    public Player createPlayer(String gameId, String name) {
        if (playerRepository.findByGameIdAndName(gameId, name).isPresent()) {
            throw new RuntimeException("Player with this name already exists in this game");
        }
        return playerRepository.save(create(gameId, name));
    }

    public Player updatePlayer(String id, String name) {
        var player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found"));
        if (playerRepository.findByGameIdAndName(player.getGameId(), name).isPresent()) {
            throw new RuntimeException("Player with this name already exists in this game");
        }
        player.setName(name);
        return playerRepository.save(player);
    }

    public void deletePlayer(String id) {
        if (!playerRepository.existsById(id)) {
            throw new RuntimeException("Player not found: " + id);
        }
        playerRepository.deleteById(id);
    }

    @Transactional
    public List<Player> completeMatchById(String id1, String id2, MatchResult res) {
        var player1 = playerRepository.findById(id1)
                .orElseThrow(() -> new RuntimeException("Player 1 not found"));
        var player2 = playerRepository.findById(id2)
                .orElseThrow(() -> new RuntimeException("Player 2 not found"));
        EloCounter.count(player1, player2, res);
        var players = Arrays.asList(player1, player2);
        playerRepository.saveAll(players);
        saveMatch(player1, player2, res);
        return players;
    }

    @Transactional
    public List<Player> completeMatchByName(String gameId, String name1, String name2, MatchResult res) {
        var opt = playerRepository.findByGameIdAndName(gameId, name1);
        var player1 = opt.orElseGet(() -> create(gameId, name1));
        opt = playerRepository.findByGameIdAndName(gameId, name2);
        var player2 = opt.orElseGet(() -> create(gameId, name2));
        EloCounter.count(player1, player2, res);
        var players = Arrays.asList(player1, player2);
        playerRepository.saveAll(players);
        saveMatch(player1, player2, res);
        return players;
    }

    public RatingResult updateRating(String id1, String id2, MatchResult res) {
        var player1 = playerRepository.findById(id1)
                .orElseThrow(() -> new RuntimeException("Player not found"));
        var player2 = playerRepository.findById(id2)
                .orElseThrow(() -> new RuntimeException("Player not found"));
        EloCounter.count(player1, player2, res);
        var players = Arrays.asList(player1, player2);
        playerRepository.saveAll(players);
        return new RatingResult(player1.getElo(), player2.getElo());
    }

    public List<Player> getNearestPlayers(String id) {
        Player target = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        return playerRepository.findAll().stream()
                .filter(player -> !player.getId().equals(id) && Objects.equals(player.getGameId(), target.getGameId()))
                .sorted(Comparator.comparingInt(player -> Math.abs(player.getElo() - target.getElo())))
                .limit(5)
                .toList();
    }

    private void saveMatch(final Player player1, final Player player2, final MatchResult res) {
         matchRepository.save(Match.builder()
                .gameId(player1.getGameId())
                .player1Id(player1.getId())
                .player2Id(player2.getId())
                .score1(0)
                .score2(0)
                 .rating1(player1.getElo())
                 .rating2(player2.getElo())
                .result(res)
                .playedAt(LocalDateTime.now())
                .status(CompetitionStatus.COMPLETED)
                .build());
    }
}