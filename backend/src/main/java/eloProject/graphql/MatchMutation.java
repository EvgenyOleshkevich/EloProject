package eloProject.graphql;

import eloProject.dto.MatchInput;
import eloProject.dto.MatchOrderInput;
import eloProject.model.Match;
import eloProject.model.Player;
import eloProject.service.MatchService;
import eloProject.service.PlayerService;
import eloProject.util.enums.MatchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.Argument;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class MatchMutation {
    private final PlayerService playerService;
    private final MatchService matchService;

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public List<Player> completeMatch(@Argument String id1, @Argument String id2, @Argument MatchResult res) {
        return playerService.completeMatchById(id1, id2, res);
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public List<Player> completeMatchWithNames(@Argument String gameId, @Argument String name1, @Argument String name2, @Argument MatchResult res) {
        return playerService.completeMatchByName(gameId, name1, name2, res);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public List<Match> completeTournamentMatch(@Argument MatchInput input) {
        return matchService.completeMatch(input);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public List<Match> reorderMatches(@Argument String tournamentId, @Argument ArrayList<MatchOrderInput> orders) {
        return matchService.reorderMatches(tournamentId, orders);
    }
}