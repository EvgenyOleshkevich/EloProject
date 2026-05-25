package eloProject.dto;

import eloProject.model.Roster;
import eloProject.model.Weapon;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RosterInput {
    private String id;
    private List<Roster.RosterItem> characters;
    private List<Roster.RosterItem> weapons;
}