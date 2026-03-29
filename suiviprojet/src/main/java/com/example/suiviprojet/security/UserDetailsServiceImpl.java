package com.example.suiviprojet.security;

import com.example.suiviprojet.entities.Employe;
import com.example.suiviprojet.repositories.EmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final EmployeRepository employeRepository;

    @Override
    public UserDetails loadUserByUsername(String login)
            throws UsernameNotFoundException {
        Employe employe = employeRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Utilisateur non trouvé : " + login
                ));
        return new EmployeUserDetails(employe);
    }
}