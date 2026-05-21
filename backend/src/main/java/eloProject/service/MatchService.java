package eloProject.service;

import eloProject.dto.MatchInput;
import eloProject.dto.MatchOrderInput;
import eloProject.model.Match;
import eloProject.model.Player;
import eloProject.model.Tournament;
import eloProject.model.TournamentMatchInfo;
import eloProject.repository.MatchRepository;
import eloProject.repository.TournamentRepository;
import eloProject.util.EloCounter;
import eloProject.util.enums.BracketType;
import eloProject.util.enums.CompetitionStatus;
import eloProject.util.enums.MatchResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;
    private final TournamentRepository tournamentRepository;
    private final PlayerService playerService;

    public List<Match> getAllMatchesByGame(String gameId) {
        return matchRepository.findByGameId(gameId);
    }

    public List<Match> getMatchesByGameAndPlayer(String gameId, String playerId) {
        var matches = matchRepository.findByGameIdAndPlayer1IdOrGameIdAndPlayer2Id(gameId, playerId, gameId, playerId);
        matches.sort(Comparator.comparing(Match::getPlayedAt).reversed());
        return matches;
    }

    public List<Match> getMatchesByPlayer(String playerId) {
        var matches = matchRepository.findByPlayer1IdOrPlayer2Id(playerId, playerId);
        matches.sort(Comparator.comparing(Match::getPlayedAt));
        return matches;
    }

    public void delete(String id) {
        matchRepository.deleteById(id);
    }

    public List<Match> reorderMatches(@NonNull String tournamentId, @NonNull final ArrayList<MatchOrderInput> orders) {
        var opt = tournamentRepository.findById(tournamentId);
        if (opt.isEmpty()) {
            throw new RuntimeException("Tournament not found: " + tournamentId);
        }
        var tournament = opt.get();
        var matches = validateAndLoadMatches(tournament, orders);
        Map<String, Match> matchesById = matches.stream()
                .collect(Collectors.toMap(Match::getId, Function.identity()));

        orders.forEach( order -> {
            var match = matchesById.get(order.getMatchId());
            match.setPlayer1Id(order.getPlayer1Id());
            match.setPlayer2Id(order.getPlayer2Id());
        });

        matchRepository.saveAll(matches);

        return matches;
    }

    public List<Match> buildSingleElimination(@NonNull final Tournament tournament, @NonNull final List<Player> players) {
        if (!EloCounter.isPowerOfTwo(players.size())) {
            throw new RuntimeException("Count of players is not power of 2");
        }
        var matches = new ArrayList<Match>();
        final var gameId = tournament.getGameId();
        final var tournamentId = tournament.getId();
        int round = EloCounter.getPowerOfTwo(players.size());
        Match match = null;
        Queue<BuildNode> queue = new ArrayDeque<>();
        queue.add(new BuildNode(match, players, ChildSide.LEFT));
        /*log.info("Building single elimination for tournament={}, playersCount={}",
                tournament.getId(), players.size());*/

        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; ++i) {
                var node = queue.remove();
                if (node.players.size() == 2) {
                    if (Objects.isNull(node.players.get(0))) {
                        throw new RuntimeException("First player was null");
                    }

                    if (Objects.isNull(node.players.get(1))) {
                        if (Objects.isNull(node.parentMatch)) {
                            throw new RuntimeException("Second player and next match can not be null at same time");
                        }

                        if (node.side == ChildSide.LEFT) {
                            node.parentMatch.setPlayer1Id(node.players.get(0).getId());
                        }
                        else {
                            node.parentMatch.setPlayer2Id(node.players.get(0).getId());
                        }
                        continue;
                    }

                    match = createMatchForTournament(gameId, tournamentId, round, i + 1, node);
                    matches.add(match);
                }
                else {
                    List<Player> left = new ArrayList<>();
                    List<Player> right = new ArrayList<>();
                    splitPlayers(node.players, left, right);

                    match = createMatchForTournament(gameId, tournamentId, round, i + 1, node);
                    matches.add(match);
                    queue.add(new BuildNode(match, left, ChildSide.LEFT));
                    queue.add(new BuildNode(match, right, ChildSide.RIGHT));
                }
            }
            --round;
        }
        return matchRepository.saveAll(matches);
    }

    public List<Match> buildDoubleElimination(@NonNull final Tournament tournament, @NonNull final List<Player> players) {
        if (!EloCounter.isPowerOfTwo(players.size())) {
            throw new RuntimeException("Count of players is not power of 2");
        }
        var matches = new ArrayList<Match>();
        final var gameId = tournament.getGameId();
        final var tournamentId = tournament.getId();
        int round = EloCounter.getPowerOfTwo(players.size());
        Match grandFinal = Match.builder()
                .id(UUID.randomUUID().toString())
                .gameId(gameId)
                .tournamentId(tournamentId)
                .status(CompetitionStatus.PLANNED)
                .tournamentInfo(TournamentMatchInfo.builder()
                        .round(round + 1)
                        .position(1)
                        .bracketType(BracketType.GRAND_FINAL)
                        .build())
                .build();;
        Queue<BuildNode> queue = new ArrayDeque<>();
        queue.add(new BuildNode(grandFinal, players, ChildSide.LEFT));
        List<List<Match>> winnerBucket = new ArrayList<>();

        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Match> roundMatches = new ArrayList<>();
            for (int i = 0; i < size; ++i) {
                var node = queue.remove();
                if (node.players.size() == 2) {
                    if (Objects.isNull(node.players.get(0))) {
                        throw new RuntimeException("First player was null");
                    }

                    if (Objects.isNull(node.players.get(1))) {
                        if (Objects.isNull(node.parentMatch)) {
                            throw new RuntimeException("Second player and next match can not be null at same time");
                        }

                        if (node.side == ChildSide.LEFT) {
                            node.parentMatch.setPlayer1Id(node.players.get(0).getId());
                        }
                        else {
                            node.parentMatch.setPlayer2Id(node.players.get(0).getId());
                        }
                        roundMatches.add(null);
                        continue;
                    }

                    Match newMatch = createMatchForTournament(gameId, tournamentId, round, i + 1, node);
                    matches.add(newMatch);
                    roundMatches.add(newMatch);
                }
                else {
                    List<Player> left = new ArrayList<>();
                    List<Player> right = new ArrayList<>();
                    splitPlayers(node.players, left, right);

                    Match newMatch = createMatchForTournament(gameId, tournamentId, round, i + 1, node);
                    matches.add(newMatch);
                    roundMatches.add(newMatch);
                    queue.add(new BuildNode(newMatch, left, ChildSide.LEFT));
                    queue.add(new BuildNode(newMatch, right, ChildSide.RIGHT));
                }
            }
            --round;
            winnerBucket.add(roundMatches);
        }
        Collections.reverse(winnerBucket);

        round = 1;
        var prevLoserRoundMatches = winnerBucket.get(0);
        for (int i = 1; i < winnerBucket.size();) {
            int position = 0;
            List<Match> nextLoserRoundMatches = new ArrayList<>();
            var winnerRoundMatches = winnerBucket.get(i);
            if (winnerRoundMatches.size() == prevLoserRoundMatches.size()) {
                // loser + winner bucket
                if (i % 2 == 1) {
                    Collections.reverse(winnerRoundMatches);
                }

                for (int j = 0; j < prevLoserRoundMatches.size(); ++j) {
                    var match1 = winnerRoundMatches.get(j);
                    var match2 = prevLoserRoundMatches.get(j);
                    var loserMatch = createLoserMatchForTournament(gameId, tournamentId, round, ++position, match1, match2);
                    nextLoserRoundMatches.add(loserMatch);
                    matches.add(loserMatch);
                }
                ++i;
            }
            else if (winnerRoundMatches.size() * 2 == prevLoserRoundMatches.size()) {
                // only loser bucket
                for (int j = 0; j < prevLoserRoundMatches.size(); j += 2) {
                    if (prevLoserRoundMatches.get(j) == null || prevLoserRoundMatches.get(j + 1) == null) {
                        Match prevMatch = prevLoserRoundMatches.get(j) == null ? prevLoserRoundMatches.get(j + 1) : prevLoserRoundMatches.get(j);
                        nextLoserRoundMatches.add(prevMatch);
                        continue;
                    }
                    var match1 = prevLoserRoundMatches.get(j);
                    var match2 = prevLoserRoundMatches.get(j + 1);
                    var loserMatch = createLoserMatchForTournament(gameId, tournamentId, round, ++position, match1, match2);
                    nextLoserRoundMatches.add(loserMatch);
                    matches.add(loserMatch);
                }
            }
            else {
                throw new RuntimeException("winner and loser matches must be equal or loser must be 2 times bigger");
            }
            prevLoserRoundMatches = nextLoserRoundMatches;
            boolean hasRealMatch = prevLoserRoundMatches.stream().anyMatch(Objects::nonNull);
            if (hasRealMatch) {
                round++;
            }
        }
        if (prevLoserRoundMatches.size() != 1) {
            throw new RuntimeException("last loser round must contain 1 match");
        }
        var loserMatch = prevLoserRoundMatches.get(0);
        loserMatch.getTournamentInfo().setNextWinMatchId(grandFinal.getId());
        grandFinal.getTournamentInfo().setPreviousMatch2Id(loserMatch.getId());
        matches.add(grandFinal);

        matchRepository.deleteAllByTournamentId(tournamentId);
        return matchRepository.saveAll(matches);
    }

    private Match createMatchForTournament(String gameId, String tournamentId, int round, int position, @NonNull BuildNode node) {
        var match = Match.builder()
                .id(UUID.randomUUID().toString())
                .gameId(gameId)
                .tournamentId(tournamentId)
                .status(CompetitionStatus.PLANNED)
                .tournamentInfo(TournamentMatchInfo.builder()
                        .round(round)
                        .position(position)
                        .nextWinMatchId(node.parentMatch != null ? node.parentMatch.getId() : null)
                        .bracketType(BracketType.WINNER)
                        .build())
                .build();
        if (node.parentMatch != null && node.parentMatch.getTournamentInfo() != null) {
            if (node.side == ChildSide.LEFT) {
                node.parentMatch.getTournamentInfo().setPreviousMatch1Id(match.getId());
            } else {
                node.parentMatch.getTournamentInfo().setPreviousMatch2Id(match.getId());
            }
        }
        if (node.players.size() == 2) {
            match.setPlayer1Id(node.players.get(0).getId());
            match.setPlayer2Id(node.players.get(1).getId());
        }
        return match;
    }

    private @NonNull Match createLoserMatchForTournament(String gameId, String tournamentId, int round, int position, Match match1, Match match2) {
        var match = Match.builder()
                .id(UUID.randomUUID().toString())
                .gameId(gameId)
                .tournamentId(tournamentId)
                .status(CompetitionStatus.PLANNED)
                .tournamentInfo(TournamentMatchInfo.builder()
                        .round(round)
                        .position(position)
                        .previousMatch1Id(match1 != null ? match1.getId() : null)
                        .previousMatch2Id(match2 != null ? match2.getId() : null)
                        .bracketType(BracketType.LOSER)
                        .build())
                .build();
        if (match1 != null) {
            linkMatchToLoser(match1, match);
        }
        if (match2 != null) {
            linkMatchToLoser(match2, match);
        }
        return match;
    }

    private void linkMatchToLoser(@NonNull Match source, @NonNull Match target) {
        if (source.getTournamentInfo().getBracketType() == BracketType.WINNER) {
            source.getTournamentInfo().setNextLoseMatchId(target.getId());
        } else {
            source.getTournamentInfo().setNextWinMatchId(target.getId());
        }
    }

    private void splitPlayers(final List<Player> players, List<Player> left, List<Player> right) {
        for (int j = 0; j < players.size(); j++) {
            int num = j & 3;
            if (num == 0 || num == 3) {
                left.add(players.get(j));
            } else {
                right.add(players.get(j));
            }
        }
    }

    private List<Match> validateAndLoadMatches(@NonNull final Tournament tournament, final ArrayList<MatchOrderInput> orders) {
        var matchIds = orders.stream().map(MatchOrderInput::getMatchId).toList();
        // 1. Проверка дублей
        Set<String> uniqueIds = new HashSet<>(matchIds);
        if (uniqueIds.size() != matchIds.size()) {
            throw new RuntimeException("Duplicate playerIds");
        }

        // 2. Загрузка игроков
        List<Match> matches = matchRepository.findAllById(matchIds);

        // 3. Проверка существования
        if (matches.size() != matchIds.size()) {
            Set<String> foundIds = matches.stream()
                    .map(Match::getId)
                    .collect(Collectors.toSet());

            List<String> missingIds = matchIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();

            throw new RuntimeException("Matches not found: " + missingIds);
        }

        // 4. Проверка tournamentId
        boolean allMatchTournament = matches.stream()
                .allMatch(p -> p.getTournamentId().equals(tournament.getId()));

        if (!allMatchTournament) {
            throw new RuntimeException("Some matches do not belong to this tournament");
        }

        // 5. Проверка, что игркои из этого турнира
        Set<String> tournamentPlayerIds = new HashSet<>(tournament.getPlayerIds());
        List<String> playerIds = orders.stream()
                .flatMap(match -> Stream.of(match.getPlayer1Id(), match.getPlayer2Id()))
                .filter(Objects::nonNull)
                .toList();
        boolean allPlayerTournament = tournamentPlayerIds.containsAll(playerIds);
        if (!allPlayerTournament) {
            throw new RuntimeException("Some players do not belong to this tournament");
        }

        return matches;
    }

    private record BuildNode(
            Match parentMatch,
            List<Player> players,
            ChildSide side
    ) {}

    private enum ChildSide {
        LEFT,
        RIGHT
    }

    @Transactional
    public List<Match> completeMatch(MatchInput input) {
        var match = matchRepository.findById(input.getId())
            .orElseThrow(() -> new RuntimeException("Match not found: " + input.getId()));
        List<Match> matches = new ArrayList<>();

        if (match.getStatus() != CompetitionStatus.PLANNED ||
                match.getPlayer1Id() == null ||
                match.getPlayer2Id() == null) {
            return matches;
        }

        matches.add(match);
        match.setPlayedAt(LocalDateTime.now());
        match.setResult(input.getResult());
        match.setScore1(input.getScore1());
        match.setScore2(input.getScore2());
        match.setStatus(CompetitionStatus.COMPLETED);

        var ratings = playerService.updateRating(match.getPlayer1Id(), match.getPlayer2Id(), match.getResult());
        match.setRating1(ratings.getPlayer1Elo());
        match.setRating2(ratings.getPlayer2Elo());

        if (match.getTournamentInfo() != null &&
                match.getTournamentInfo().getNextWinMatchId() != null) {
            var nextWinMatch = matchRepository.findById(match.getTournamentInfo().getNextWinMatchId())
                    .orElseThrow(() -> new RuntimeException("Next match not found: " + input.getId()));

            if (Objects.equals(nextWinMatch.getTournamentInfo().getPreviousMatch1Id(), match.getId())) {
                nextWinMatch.setPlayer1Id(getWinnerId(match));
            }
            else {
                nextWinMatch.setPlayer2Id(getWinnerId(match));
            }
            matches.add(nextWinMatch);
        }

        if (match.getTournamentInfo() != null &&
                match.getTournamentInfo().getNextLoseMatchId() != null) {
            var nextLoseMatch = matchRepository.findById(match.getTournamentInfo().getNextLoseMatchId())
                    .orElseThrow(() -> new RuntimeException("Next match not found: " + input.getId()));

            if (Objects.equals(nextLoseMatch.getTournamentInfo().getPreviousMatch1Id(), match.getId())) {
                nextLoseMatch.setPlayer1Id(getLoserId(match));
            }
            else {
                nextLoseMatch.setPlayer2Id(getLoserId(match));
            }
            matches.add(nextLoseMatch);
        }

        matchRepository.saveAll(matches);

        return matches;
    }

    public  String getWinnerId(Match match) {
        if (match.getResult() == MatchResult.PLAYER_1_WIN)
            return match.getPlayer1Id();
        if (match.getResult() == MatchResult.PLAYER_2_WIN)
            return match.getPlayer2Id();
        return null;
    }

    public  String getLoserId(Match match) {
        if (match.getResult() == MatchResult.PLAYER_1_WIN)
            return match.getPlayer2Id();
        if (match.getResult() == MatchResult.PLAYER_2_WIN)
            return match.getPlayer1Id();
        return null;
    }

}