package eloProject.graphql;

import eloProject.dto.MatchInput;
import eloProject.model.Match;
import eloProject.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.Argument;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class MatchQuery {
    private final MatchService matchService;

    @QueryMapping
    public List<Match> matchesByGame(@Argument String gameId) {
        return matchService.getAllMatchesByGame(gameId);
    }

    @QueryMapping
    public List<Match> matchesByGameAndPlayer(@Argument String gameId, @Argument String playerId) {
        return matchService.getMatchesByGameAndPlayer(gameId, playerId);
    }

    @QueryMapping
    public List<Match> matchesByPlayer(@Argument String playerId) {
        return matchService.getMatchesByPlayer(playerId);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public boolean deleteMatch(@Argument String id) {
        matchService.delete(id);
        return true;
    }
}