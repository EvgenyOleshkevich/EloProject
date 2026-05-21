package eloProject.dto;

import eloProject.util.enums.CompetitionStatus;
import eloProject.util.enums.TournamentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TournamentInput {
    private String id; // gameId for creating and Tournament id for update
    private String name;
    private TournamentType type;
    private CompetitionStatus status;
}
