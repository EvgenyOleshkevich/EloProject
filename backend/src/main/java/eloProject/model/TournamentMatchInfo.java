package eloProject.model;

import eloProject.util.enums.BracketType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TournamentMatchInfo {
    private int round;
    private int position;
    private String previousMatch1Id;
    private String previousMatch2Id;
    private String nextWinMatchId;
    private String nextLoseMatchId;
    private BracketType bracketType;
}
