package eloProject.service;

import eloProject.dto.CharacterInput;
import eloProject.model.Match;
import eloProject.model.Character;
import eloProject.model.RatingResult;
import eloProject.repository.MatchRepository;
import eloProject.repository.CharacterRepository;
import eloProject.util.EloCounter;
import eloProject.util.enums.CompetitionStatus;
import eloProject.util.enums.MatchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CharacterService {
    private final CharacterRepository characterRepository;
    private final MatchRepository matchRepository;

    public List<Character> getAllCharacters() {
        return characterRepository.findAll();
    }

    public List<Character> getAllCharactersByGame(String gameId) {
        return characterRepository.findByGameId(gameId);
    }

    public Optional<Character> getCharacter(String id) {
        return characterRepository.findById(id);
    }

    public Optional<Character> getCharacterByGameIdAndName(String gameId, String name) {
        return characterRepository.findByGameIdAndName(gameId, name);
    }


    public Character createCharacter(CharacterInput character) {
        if (characterRepository.findByGameIdAndName(character.getId(), character.getName()).isPresent()) {
            throw new RuntimeException("Character with this name already exists in this game");
        }
        return characterRepository.save(Character.builder()
                .gameId(character.getId())
                .name(character.getName())
                .element(character.getElement())
                .rarity(character.getRarity())
                .constellation(character.getConstellation())
                .constellationCost(character.getConstellationCost())
                .image(character.getImage())
                .build());
    }

    public Character updateCharacter(CharacterInput character) {
        var oldCharacter = characterRepository.findById(character.getId())
                .orElseThrow(() -> new RuntimeException("Character not found"));
        if (!Objects.equals(oldCharacter.getName(), character.getName()) &&
                characterRepository.findByGameIdAndName(oldCharacter.getGameId(), character.getName()).isPresent()) {
            throw new RuntimeException("Character with this name already exists in this game");
        }
        oldCharacter.setName(character.getName());
        oldCharacter.setElement(character.getElement());
        oldCharacter.setRarity(character.getRarity());
        oldCharacter.setConstellation(character.getConstellation());
        oldCharacter.setConstellationCost(character.getConstellationCost());
        oldCharacter.setImage(character.getImage());
        return characterRepository.save(oldCharacter);
    }

    public void deleteCharacter(String id) {
        if (!characterRepository.existsById(id)) {
            throw new RuntimeException("Character not found: " + id);
        }
        characterRepository.deleteById(id);
    }

}