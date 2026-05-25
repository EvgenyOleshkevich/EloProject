package eloProject.service;

import eloProject.dto.WeaponInput;
import eloProject.model.Weapon;
import eloProject.repository.WeaponRepository;
import eloProject.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WeaponService {
    private final WeaponRepository weaponRepository;
    private final MatchRepository matchRepository;

    public List<Weapon> getAllWeapons() {
        return weaponRepository.findAll();
    }

    public List<Weapon> getAllWeaponsByGame(String gameId) {
        return weaponRepository.findByGameId(gameId);
    }

    public Optional<Weapon> getWeapon(String id) {
        return weaponRepository.findById(id);
    }

    public Optional<Weapon> getWeaponByGameIdAndName(String gameId, String name) {
        return weaponRepository.findByGameIdAndName(gameId, name);
    }


    public Weapon createWeapon(WeaponInput weapon) {
        if (weaponRepository.findByGameIdAndName(weapon.getId(), weapon.getName()).isPresent()) {
            throw new RuntimeException("Weapon with this name already exists in this game");
        }
        return weaponRepository.save(Weapon.builder()
                .gameId(weapon.getId())
                .name(weapon.getName())
                .rarity(weapon.getRarity())
                .constellation(weapon.getConstellation())
                .constellationCost(weapon.getConstellationCost())
                .image(weapon.getImage())
                .build());
    }

    public Weapon updateWeapon(WeaponInput weapon) {
        var oldWeapon = weaponRepository.findById(weapon.getId())
                .orElseThrow(() -> new RuntimeException("Weapon not found"));
        if (!Objects.equals(oldWeapon.getName(), weapon.getName()) &&
                weaponRepository.findByGameIdAndName(oldWeapon.getGameId(), weapon.getName()).isPresent()) {
            throw new RuntimeException("Weapon with this name already exists in this game");
        }
        oldWeapon.setName(weapon.getName());
        oldWeapon.setRarity(weapon.getRarity());
        oldWeapon.setConstellation(weapon.getConstellation());
        oldWeapon.setConstellationCost(weapon.getConstellationCost());
        oldWeapon.setImage(weapon.getImage());
        return weaponRepository.save(oldWeapon);
    }

    public void deleteWeapon(String id) {
        if (!weaponRepository.existsById(id)) {
            throw new RuntimeException("Weapon not found: " + id);
        }
        weaponRepository.deleteById(id);
    }

}