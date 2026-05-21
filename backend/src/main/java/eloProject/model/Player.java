package eloProject.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "players")
@CompoundIndex(name = "unique_player_name_per_game", def = "{'gameId': 1, 'name': 1}", unique = true)
public class Player {
    @Id
    private String id;
    private String gameId;
    private String name;
    private int elo;
    private int numberMatches;

    public void incMatches() {
        ++numberMatches;
    }
}