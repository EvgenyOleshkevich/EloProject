package eloProject.dto;

import eloProject.util.enums.MatchResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchInput {
    private String id;
    private Integer score1;
    private Integer score2;
    private MatchResult result;
}