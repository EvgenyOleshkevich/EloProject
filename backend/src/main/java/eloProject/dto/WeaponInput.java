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
public class WeaponInput {
    private String id; // gameId for creating and Object id for update
    private String name;
    private int rarity;
    private int constellation;
    private List<Integer> constellationCost;
    private String image;
}
