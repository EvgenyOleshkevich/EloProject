package eloProject.graphql;

import eloProject.dto.TournamentInput;
import eloProject.model.Match;
import eloProject.model.Tournament;
import eloProject.service.TournamentService;
import eloProject.util.enums.PlayersOrder;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class TournamentQuery {
    private final TournamentService tournamentService;

    @QueryMapping
    public List<Tournament> tournamentsByGame(@Argument String gameId) {
        return tournamentService.getAllTournamentsByGame(gameId);
    }

    @QueryMapping
    public Tournament tournament(@Argument String id) {
        return tournamentService.getTournament(id).orElse(null);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public Tournament createTournament(@Argument TournamentInput input) {
        return tournamentService.createTournament(input);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public Tournament updateTournament(@Argument TournamentInput input) {
        return tournamentService.updateTournament(input);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public List<Match> addPlayersToTournament(@Argument String id, @Argument List<String> playerIds, @Argument PlayersOrder order) {
        return tournamentService.addPlayersToTournament(id, playerIds, order);
    }

    @MutationMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public boolean deleteTournament(@Argument String id) {
        tournamentService.deleteTournament(id);
        return true;
    }

}
