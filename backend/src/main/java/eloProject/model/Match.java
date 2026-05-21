package eloProject.model;

import eloProject.util.enums.CompetitionStatus;
import eloProject.util.enums.MatchResult;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {
    @Id
    private String id;
    private String gameId;
    private String tournamentId;

    private String player1Id;
    private String player2Id;
    private Integer score1;
    private Integer score2;
    private Integer rating1;
    private Integer rating2;

    private MatchResult result;
    private LocalDateTime playedAt;
    private CompetitionStatus status;

    private TournamentMatchInfo tournamentInfo;
}