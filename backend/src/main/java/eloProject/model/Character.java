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
@Document(collection = "characters")
@CompoundIndex(name = "unique_character_name_per_game", def = "{'gameId': 1, 'name': 1}", unique = true)
public class Character {
    @Id
    private String id;
    private String gameId;
    private String name;
    private String element;
    private int rarity;
    private int constellation;
    private List<Integer> constellationCost;
    private String image;
}
