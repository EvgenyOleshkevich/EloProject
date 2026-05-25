package eloProject.graphql;

import eloProject.dto.CharacterInput;
import eloProject.model.Character;
import eloProject.service.CharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class CharacterQuery {

    private final CharacterService characterService;

    @QueryMapping
    public List<Character> characters() {
        return characterService.getAllCharacters();
    }

    @QueryMapping
    public List<Character> charactersByGame(@Argument String gameId) {
        return characterService.getAllCharactersByGame(gameId);
    }

    @QueryMapping
    public Character character(@Argument String id) {
        return characterService.getCharacter(id).orElse(null);
    }

    @QueryMapping
    public Character characterByName(@Argument String gameId, @Argument String name) {
        return characterService.getCharacterByGameIdAndName(gameId, name).orElse(null);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Character createCharacter(@Argument CharacterInput character) {
        return characterService.createCharacter(character);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Character updateCharacter(@Argument CharacterInput character) {
        return characterService.updateCharacter(character);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public boolean deleteCharacter(@Argument String id) {
        characterService.deleteCharacter(id);
        return true;
    }
}