package eloProject.graphql;

import eloProject.dto.GameInput;
import eloProject.model.Game;
import eloProject.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.QueryMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class GameQuery {
    private final GameService gameService;

    @QueryMapping
    public List<Game> games() {
        return gameService.getAllGames();
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Game createGame(@Argument String name) {
        return gameService.createGame(name);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Game updateGame(@Argument GameInput game) {
        return gameService.updateGame(game);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public boolean deleteGame(@Argument String gameId) {
         gameService.deleteGame(gameId);
         return true;
    }
}