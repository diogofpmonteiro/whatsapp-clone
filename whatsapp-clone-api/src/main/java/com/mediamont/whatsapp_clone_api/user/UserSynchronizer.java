package com.mediamont.whatsapp_clone_api.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSynchronizer {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public void synchronizeWithIdp(Jwt token) {
        log.info("Synchronizing user with idp");

        getUserEmail(token).ifPresent(email -> {
            log.info("Synchronizing user with email {}", email);
            Optional<User> optionalUser = userRepository.findByEmail(email);
            User user = userMapper.fromTokenAttributes(token.getClaims());
            optionalUser.ifPresent(value -> user.setId(optionalUser.get().getId()));

            userRepository.save(user); // saves to internal DB
        });
    }

    private Optional<String> getUserEmail(Jwt token) {
        Map<String, Object> attributes = token.getClaims();
        if (attributes.containsKey("email")) {
            return Optional.of(attributes.get("email").toString());
        }

        return Optional.empty();
    }
}
