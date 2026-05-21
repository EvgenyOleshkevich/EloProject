package eloProject.graphql;

import eloProject.dto.AuthPayload;
import eloProject.dto.LoginInput;
import eloProject.dto.RegisterInput;
import eloProject.model.User;
import eloProject.service.UserService;
import eloProject.util.AppUserDetails;
import eloProject.util.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class UserQuery {
    private final UserService UserService;

    @QueryMapping
    public List<User> Users() {
        return UserService.getAllUsers();
    }

    @QueryMapping
    public User User(@Argument String id) {
        return UserService.getUser(id).orElse(null);
    }

    @MutationMapping
    public AuthPayload login(@Argument LoginInput input) {
        System.out.println("LOGIN CALLED");
        return UserService.login(input);
    }

    @MutationMapping
    public User createUser(@Argument RegisterInput input) {
        return UserService.createUser(input.getEmail(), input.getPassword());
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public User updateUser(@Argument String id, @Argument String email,
                           Authentication authentication) {
        String email2 = authentication.getName();
        return UserService.updateUser(id, email);
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public User me(@AuthenticationPrincipal AppUserDetails principal) {
        return principal.getUser();
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public User updateUserRole(@Argument String id, @Argument UserRole role) {
        return UserService.updateUserRole(id, role);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public boolean deleteUser(@Argument String id) {
        UserService.deleteUser(id);
        return true;
    }
}