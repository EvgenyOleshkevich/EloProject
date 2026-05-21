package eloProject.service;

import eloProject.dto.GameInput;
import eloProject.model.Game;
import eloProject.repository.GameRepository;
import eloProject.repository.MatchRepository;
import eloProject.repository.PlayerRepository;
import eloProject.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GameService {
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final TournamentRepository tournamentRepository;

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game createGame(String name) {
        if (gameRepository.findByName(name).isPresent()) {
            throw new RuntimeException("Game with this name already exists");
        }
        return gameRepository.save(Game.builder()
                .name(name)
                .build());
    }

    public Game updateGame(GameInput game) {
        if (gameRepository.findByName(game.getName()).isPresent()) {
            throw new RuntimeException("Game with this name already exists");
        }
        return gameRepository.save(Game.builder()
                .name(game.getName())
                .id(game.getId())
                .build());
    }

    @Transactional
    public void deleteGame(String gameId) {
        if (!gameRepository.existsById(gameId)) {
            throw new RuntimeException("Game not found: " + gameId);
        }

        matchRepository.deleteAllByGameId(gameId);
        tournamentRepository.deleteByGameId(gameId);
        playerRepository.deleteByGameId(gameId);
        gameRepository.deleteById(gameId);
    }
}