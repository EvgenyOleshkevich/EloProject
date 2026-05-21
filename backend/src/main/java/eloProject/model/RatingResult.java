package eloProject.model;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RatingResult {
    private Integer player1Elo;
    private Integer player2Elo;
}