package eloProject.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "tournaments")
@CompoundIndex(name = "unique_player_per_tournament", def = "{'tournamentId': 1, 'playerId': 1}", unique = true)
public class Roster {
    @Id
    private String id;
    private String tournamentId;
    private String playerId;
    private List<RosterItem> characters;
    private List<RosterItem> weapons;

    @Data
    public static class RosterItem {
        private String itemId;
        private int constellation;
    }
}
