package com.gestagy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    private User user;

    @Column(nullable = false, length = 120)
    private String fullName;

    @Column(length = 30)
    private String phone;

    @Column(length = 255)
    private String avatarUrl;

    @Column(length = 150)
    private String school;

    @Column(length = 150)
    private String fieldOfStudy;

    @Column(length = 50)
    private String level; // e.g. Bac+3, Bac+5, Master 2, Ingénieur
}

