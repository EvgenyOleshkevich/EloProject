package eloProject.graphql;

import eloProject.dto.RosterInput;
import eloProject.model.Player;
import eloProject.model.Roster;
import eloProject.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.QueryMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class PlayerQuery {

    private final PlayerService playerService;

    @QueryMapping
    public List<Player> players() {
        return playerService.getAllPlayers();
    }

    @QueryMapping
    public List<Player> playersByGame(@Argument String gameId) {
        return playerService.getAllPlayersByGame(gameId);
    }

    @QueryMapping
    public Player player(@Argument String id) {
        return playerService.getPlayer(id).orElse(null);
    }

    @QueryMapping
    public Player playerByName(@Argument String gameId, @Argument String name) {
        return playerService.getPlayerByGameIdAndName(gameId, name).orElse(null);
    }

    @QueryMapping
    public Roster playerRoster(@Argument String tournamentId, @Argument String playerId) {
        return playerService.getRoster(tournamentId, playerId).orElse(null);
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<Player> getNearestPlayers(@Argument String id) {
        return playerService.getNearestPlayers(id);
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public Player createPlayer(@Argument String gameId, @Argument String name) {
        return playerService.createPlayer(gameId, name);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Player updatePlayer(@Argument String id, @Argument String name) {
        return playerService.updatePlayer(id, name);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public boolean deletePlayer(@Argument String id) {
        playerService.deletePlayer(id);
        return true;
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public Roster updateRoster(@Argument RosterInput roster) {
        return playerService.updateRoster(roster);
    }
}