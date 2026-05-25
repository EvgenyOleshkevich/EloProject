package eloProject.resolver;

import eloProject.model.Character;
import eloProject.model.Match;
import eloProject.model.Roster;
import eloProject.model.Weapon;
import eloProject.repository.CharacterRepository;
import eloProject.repository.WeaponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class RosterResolver {
    private final CharacterRepository characterRepository;
    private final WeaponRepository weaponRepository;

    @SchemaMapping(typeName = "RosterOutput", field = "characters")
    public List<Character> characters(Roster roster) {
        var characters = characterRepository.findAllByIdIn(roster.getCharacters().stream().map(Roster.RosterItem::getItemId).toList());
        Map<String, Character> charactersById = characters.stream()
                .collect(Collectors.toMap(Character::getId, Function.identity()));

        roster.getCharacters().forEach(item -> {
            var character = charactersById.get(item.getItemId());
            if (character != null) {
                character.setConstellation(item.getConstellation());
            }
        });

        return characters;
    }

    @SchemaMapping(typeName = "RosterOutput", field = "weapons")
    public List<Weapon> weapons(Roster roster) {
        var weapons = weaponRepository.findAllByIdIn(roster.getWeapons().stream().map(Roster.RosterItem::getItemId).toList());
        Map<String, Weapon> weaponsById = weapons.stream()
                .collect(Collectors.toMap(Weapon::getId, Function.identity()));

        roster.getWeapons().forEach(item -> {
            var weapon = weaponsById.get(item.getItemId());
            if (weapon != null) {
                weapon.setConstellation(item.getConstellation());
            }
        });

        return weapons;
    }

}