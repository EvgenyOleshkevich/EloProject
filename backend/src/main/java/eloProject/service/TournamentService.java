package eloProject.service;

import eloProject.dto.TournamentInput;
import eloProject.model.Match;
import eloProject.model.Player;
import eloProject.model.Tournament;
import eloProject.repository.MatchRepository;
import eloProject.repository.PlayerRepository;
import eloProject.repository.TournamentRepository;
import eloProject.util.enums.PlayersOrder;
import eloProject.util.enums.CompetitionStatus;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TournamentService {
    private final TournamentRepository TournamentRepository;
    private final MatchService matchService;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;


    private final PlayerService playerService;

    public List<Tournament> getAllTournaments() {
        return TournamentRepository.findAll();
    }

    public List<Tournament> getAllTournamentsByGame(String gameId) {
        return TournamentRepository.findByGameId(gameId);
    }

    public Optional<Tournament> getTournament(String id) {
        return TournamentRepository.findById(id);
    }

    private Tournament create(@NonNull TournamentInput input) {
        return Tournament.builder()
                .gameId(input.getId())
                .name(input.getName())
                .playerIds(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .type(input.getType())
                .status(CompetitionStatus.PLANNED)
                .build();
    }

    public Tournament createTournament(@NonNull TournamentInput input) {
        if (TournamentRepository.findByGameIdAndName(input.getId(), input.getName()).isPresent()) {
            throw new RuntimeException("Tournament with this name already exists in this game");
        }
        return TournamentRepository.save(create(input));
    }

    public Tournament updateTournament(@NonNull TournamentInput input) {
        var opt = TournamentRepository.findById(input.getId());
        if (opt.isEmpty()) {
            throw new RuntimeException("Tournament not found");
        }
        var Tournament = opt.get();
        if (!Objects.equals(Tournament.getName(), input.getName())) {
            if ( TournamentRepository.findByGameIdAndName(Tournament.getGameId(), input.getName()).isPresent()){
                throw new RuntimeException("Tournament with this name already exists in this game");
            }
            Tournament.setName(input.getName());
        }
        Tournament.setType(input.getType());
        Tournament.setStatus(input.getStatus());
        return TournamentRepository.save(Tournament);
    }

    @Transactional
    public List<Match> addPlayersToTournament(@NonNull String id, @NonNull List<String> playerIds, @NonNull PlayersOrder order) {
        var opt = TournamentRepository.findById(id);
        if (opt.isEmpty()) {
            throw new RuntimeException("Tournament not found: " + id);
        }
        var tournament = opt.get();
        if (tournament.getStatus() != CompetitionStatus.PLANNED) {
            throw new RuntimeException("Only planned tournament can be updated, status is: " + tournament.getStatus());
        }
        List<Player> players = playerService.validateAndLoadPlayers(playerIds, tournament.getGameId());
        var orderedPlayers = new ArrayList<>(switch (order) {
            case FROM_LIST -> orderByRequest(playerIds, players);
            case SORT -> orderByRating(players);
            case RANDOM -> orderByRandom(players);
        });

        int count = 1;
        while (count < orderedPlayers.size()) {
            count <<= 1;
        }

        while (count > orderedPlayers.size()) {
            orderedPlayers.add(null);
        }

        var matches =  switch(tournament.getType())  {
            case SINGLE_ELIMINATION -> matchService.buildSingleElimination(tournament, orderedPlayers);
            case DOUBLE_ELIMINATION -> matchService.buildDoubleElimination(tournament, orderedPlayers);
            case ROUND -> null;
        };
        if (matches != null && !matches.isEmpty()) {
            tournament.setPlayerIds(playerIds);
            TournamentRepository.save(tournament);
            return matches;
        }
        return new ArrayList<>();
    }

    @Transactional
    public void deleteTournament(String id) {
        if (!TournamentRepository.existsById(id)) {
            throw new RuntimeException("Tournament not found: " + id);
        }
        matchRepository.deleteAllByTournamentId(id);
        TournamentRepository.deleteById(id);
    }

    private @NonNull List<Player> orderByRequest(@NonNull List<String> playerIds, @NonNull List<Player> players) {
        Map<String, Player> playersById = players.stream()
                .collect(Collectors.toMap(Player::getId, Function.identity()));

        return playerIds.stream()
                .map(playersById::get)
                .toList();
    }

    private @NonNull List<Player> orderByRating(@NonNull List<Player> players) {
        players.sort(Comparator.comparing(Player::getElo).reversed());
        return players;
    }

    private List<Player> orderByRandom(@NonNull List<Player> players) {
        Collections.shuffle(players);
        return players;
    }
}