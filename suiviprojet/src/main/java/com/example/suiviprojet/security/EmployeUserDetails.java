package com.example.suiviprojet.security;

import com.example.suiviprojet.entities.Employe;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class EmployeUserDetails implements UserDetails {

    private final Employe employe;

    public EmployeUserDetails(Employe employe) {
        this.employe = employe;
    }

    public Employe getEmploye() {
        return employe;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(
                "ROLE_" + employe.getProfil().getCode().toUpperCase()
        ));
    }

    @Override public String getPassword() { return employe.getPassword(); }
    @Override public String getUsername() { return employe.getLogin(); }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}