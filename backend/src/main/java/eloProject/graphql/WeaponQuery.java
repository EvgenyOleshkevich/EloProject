package eloProject.graphql;

import eloProject.dto.WeaponInput;
import eloProject.model.Weapon;
import eloProject.service.WeaponService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class WeaponQuery {

    private final WeaponService weaponService;

    @QueryMapping
    public List<Weapon> weapons() {
        return weaponService.getAllWeapons();
    }

    @QueryMapping
    public List<Weapon> weaponsByGame(@Argument String gameId) {
        return weaponService.getAllWeaponsByGame(gameId);
    }

    @QueryMapping
    public Weapon weapon(@Argument String id) {
        return weaponService.getWeapon(id).orElse(null);
    }

    @QueryMapping
    public Weapon weaponByName(@Argument String gameId, @Argument String name) {
        return weaponService.getWeaponByGameIdAndName(gameId, name).orElse(null);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Weapon createWeapon(@Argument WeaponInput weapon) {
        return weaponService.createWeapon(weapon);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Weapon updateWeapon(@Argument WeaponInput weapon) {
        return weaponService.updateWeapon(weapon);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public boolean deleteWeapon(@Argument String id) {
        weaponService.deleteWeapon(id);
        return true;
    }
}