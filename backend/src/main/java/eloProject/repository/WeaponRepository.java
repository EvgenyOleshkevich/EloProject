package eloProject.repository;
import eloProject.model.Weapon;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WeaponRepository extends MongoRepository<Weapon, String> {
    Optional<Weapon> findByGameIdAndName(String gameId, String name);
    List<Weapon> findByGameId(String gameId);
    void deleteByGameId(String gameId);
}