package eloProject.model;

import eloProject.util.enums.CompetitionStatus;
import eloProject.util.enums.TournamentType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "tournaments")
@CompoundIndex(name = "unique_tournamentname_per_game", def = "{'gameId': 1, 'name': 1}", unique = true)
public class Tournament {
    @Id
    private String id;
    private String gameId;
    private String name;
    private List<String> playerIds;
    private LocalDateTime createdAt;
    private TournamentType type;
    private CompetitionStatus status;
}
