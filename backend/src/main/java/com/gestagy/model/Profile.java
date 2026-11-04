package com.gestagy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
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
    private String level;

    public Profile() {}

    public Profile(Long id, User user, String fullName, String phone, String avatarUrl, String school, String fieldOfStudy, String level) {
        this.id = id;
        this.user = user;
        this.fullName = fullName;
        this.phone = phone;
        this.avatarUrl = avatarUrl;
        this.school = school;
        this.fieldOfStudy = fieldOfStudy;
        this.level = level;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getSchool() { return school; }
    public void setSchool(String school) { this.school = school; }
    public String getFieldOfStudy() { return fieldOfStudy; }
    public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User user;
        private String fullName;
        private String phone;
        private String avatarUrl;
        private String school;
        private String fieldOfStudy;
        private String level;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public Builder school(String school) { this.school = school; return this; }
        public Builder fieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; return this; }
        public Builder level(String level) { this.level = level; return this; }
        public Profile build() { return new Profile(id, user, fullName, phone, avatarUrl, school, fieldOfStudy, level); }
    }
}
