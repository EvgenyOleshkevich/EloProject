package eloProject.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CharacterInput {
    private String id; // gameId for creating and Object id for update
    private String name;
    private String element;
    private int rarity;
    private int constellation;
    private List<Integer> constellationCost;
    private String image;
}
