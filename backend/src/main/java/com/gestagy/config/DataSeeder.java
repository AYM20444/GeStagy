package com.gestagy.config;

import com.gestagy.model.*;
import com.gestagy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final InternshipOfferRepository offerRepository;
    private final CandidateRepository candidateRepository;
    private final InternshipRepository internshipRepository;
    private final TaskRepository taskRepository;
    private final EvaluationRepository evaluationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Déjà initialisé
        }

        // 1. Départements
        Department tech = departmentRepository.save(Department.builder().name("Ingénierie & Tech").description("Équipe R&D, DevOps et Plateforme").build());
        Department product = departmentRepository.save(Department.builder().name("Produit & Design").description("Design UI/UX, Product Management").build());
        Department marketing = departmentRepository.save(Department.builder().name("Marketing & Com").description("Marketing digital et relations partenariats").build());

        // 2. Utilisateurs clés
        User admin = createUser("admin@gestagy.com", "Admin 2026", RoleName.ADMIN, "Directeur Système", "Polytechnique");
        User hr = createUser("rh@gestagy.com", "Sarah Benali", RoleName.HR, "Responsable Talents", "ESCP");
        User recruiter = createUser("recruteur@gestagy.com", "Youssef Amrani", RoleName.RECRUITER, "Talent Acquisition", "HEC");
        User tutor = createUser("tuteur@gestagy.com", "Alexandre Martin", RoleName.TUTOR, "Tech Lead Fullstack", "INSA");
        User internUser1 = createUser("stagiaire@gestagy.com", "Mehdi Mansouri", RoleName.INTERN, "Élève Ingénieur M2I", "Faculté des Sciences");
        User internUser2 = createUser("lina@gestagy.com", "Lina Tazi", RoleName.INTERN, "Master UX Design", "École de Design");

        // 3. Offres de stage réalistes
        InternshipOffer offer1 = offerRepository.save(InternshipOffer.builder()
                .title("Stagiaire Développeur FullStack (Angular / Spring Boot)")
                .description("Rejoignez notre équipe core banking pour concevoir des micro-services modernes et une interface utilisateur haute performance.")
                .department(tech)
                .skills(List.of("Java", "Spring Boot", "Angular", "TypeScript", "PostgreSQL", "Docker"))
                .durationMonths(6)
                .startDate(LocalDate.now().plusWeeks(2))
                .location("Casablanca / Hybride")
                .status(InternshipOffer.OfferStatus.OPEN)
                .createdBy(hr)
                .build());

        InternshipOffer offer2 = offerRepository.save(InternshipOffer.builder()
                .title("Stagiaire Product Designer & UI/UX Specialist")
                .description("Contribuez à l'ergonomie et aux maquettes de nos nouvelles applications web & mobiles avec Figma et Tailwind.")
                .department(product)
                .skills(List.of("Figma", "Design System", "Wireframing", "Tailwind CSS", "User Research"))
                .durationMonths(4)
                .startDate(LocalDate.now().plusWeeks(3))
                .location("Rabat / Présentiel")
                .status(InternshipOffer.OfferStatus.OPEN)
                .createdBy(recruiter)
                .build());

        InternshipOffer offer3 = offerRepository.save(InternshipOffer.builder()
                .title("Stagiaire Cloud & DevOps Engineer")
                .description("Mise en place de pipelines CI/CD, automatisation Kubernetes et supervision Grafana.")
                .department(tech)
                .skills(List.of("Kubernetes", "Docker", "GitLab CI", "Terraform", "Linux"))
                .durationMonths(6)
                .startDate(LocalDate.now().plusMonths(1))
                .location("Casablanca")
                .status(InternshipOffer.OfferStatus.OPEN)
                .createdBy(admin)
                .build());

        InternshipOffer offer4 = offerRepository.save(InternshipOffer.builder()
                .title("Stagiaire Data Analyst & IA Générative")
                .description("Analyse de données RH, tableaux de bord de prédiction et intégration de modèles de LLM.")
                .department(tech)
                .skills(List.of("Python", "SQL", "PowerBI", "LangChain", "FastAPI"))
                .durationMonths(6)
                .startDate(LocalDate.now().plusWeeks(4))
                .location("Télétravail complet")
                .status(InternshipOffer.OfferStatus.OPEN)
                .createdBy(hr)
                .build());

        InternshipOffer offer5 = offerRepository.save(InternshipOffer.builder()
                .title("Stagiaire Community & Content Manager")
                .description("Gestion de nos réseaux sociaux professionnels et création d'articles technologiques de marque employeur.")
                .department(marketing)
                .skills(List.of("Copywriting", "LinkedIn Ads", "Canva", "SEO", "Communication"))
                .durationMonths(3)
                .startDate(LocalDate.now().plusMonths(2))
                .location("Casablanca")
                .status(InternshipOffer.OfferStatus.DRAFT)
                .createdBy(recruiter)
                .build());

        // 4. Candidats dans les différentes colonnes Kanban
        createCandidate(offer1, "Sophia El Fassi", "sophia.elfassi@test.com", "+212 600 112233", "ENSIAS", Candidate.CandidateStatus.NEW, 82, "Profil solide en Spring Boot et architecture hexagonale.");
        createCandidate(offer1, "Karim Haddad", "karim.haddad@test.com", "+212 611 223344", "EMI", Candidate.CandidateStatus.NEW, 78, "Bonnes bases Java, motivation élevée.");
        createCandidate(offer1, "Salma Bennani", "salma.bennani@test.com", "+212 622 334455", "INPT", Candidate.CandidateStatus.SCREENING, 85, "Entretien préliminaire RH très positif.");
        createCandidate(offer1, "Ayoub Chraibi", "ayoub.chraibi@test.com", "+212 633 445566", "FST Fès", Candidate.CandidateStatus.INTERVIEW, 90, "Entretien technique validé par l'encadrant.");
        createCandidate(offer1, "Nour Alami", "nour.alami@test.com", "+212 644 556677", "EHTP", Candidate.CandidateStatus.ACCEPTED, 94, "Excellente candidate, convention en cours d'édition.");
        createCandidate(offer1, "Hamza Berrada", "hamza.berrada@test.com", "+212 655 667788", "Université Hassan II", Candidate.CandidateStatus.REJECTED, 55, "Profil non aligné avec la stack demandée.");

        createCandidate(offer2, "Zineb Kabbaj", "zineb.kabbaj@test.com", "+212 666 778899", "Artcom Sup", Candidate.CandidateStatus.NEW, 76, "Portfolio Behance très créatif.");
        createCandidate(offer2, "Omar Slaoui", "omar.slaoui@test.com", "+212 677 889900", "ESAV", Candidate.CandidateStatus.SCREENING, 80, "Bonne sensibilité UX et composants UI.");
        createCandidate(offer2, "Ghita Idrissi", "ghita.idrissi@test.com", "+212 688 990011", "ComSup", Candidate.CandidateStatus.INTERVIEW, 89, "Test technique Figma passé avec succès.");
        createCandidate(offer2, "Reda Tahiri", "reda.tahiri@test.com", "+212 699 001122", "Collège LaSalle", Candidate.CandidateStatus.ACCEPTED, 92, "Candidat sélectionné.");

        // 5. Stages réels en cours
        Internship internship1 = internshipRepository.save(Internship.builder()
                .intern(internUser1)
                .tutor(tutor)
                .department(tech)
                .startDate(LocalDate.now().minusMonths(2))
                .endDate(LocalDate.now().plusMonths(4))
                .topic("Développement d'un système de gestion de microservices avec Angular et Spring Cloud")
                .status(Internship.InternshipStatus.ONGOING)
                .build());

        Internship internship2 = internshipRepository.save(Internship.builder()
                .intern(internUser2)
                .tutor(tutor)
                .department(product)
                .startDate(LocalDate.now().minusMonths(1))
                .endDate(LocalDate.now().plusMonths(3))
                .topic("Refonte complète de l'expérience utilisateur et du design system de la plateforme")
                .status(Internship.InternshipStatus.ONGOING)
                .build());

        // 6. Tâches pour le stagiaire 1
        createTask(internship1, "Prise en main de l'environnement et Docker", "Configurer le repository, lancer la base PostgreSQL locale et valider le build Maven.", Task.TaskStatus.DONE, tutor);
        createTask(internship1, "Implémentation de l'authentification JWT", "Sécuriser les endpoints et configurer les filtres OncePerRequestFilter.", Task.TaskStatus.DONE, tutor);
        createTask(internship1, "Conception du tableau Kanban des candidatures", "Développer le drag-and-drop avec mise à jour immédiate du statut en base.", Task.TaskStatus.IN_PROGRESS, tutor);
        createTask(internship1, "Génération de l'attestation de stage en PDF", "Créer le template et le service de téléchargement sécurisé du certificat.", Task.TaskStatus.TODO, tutor);

        // 7. Évaluation de mi-parcours
        evaluationRepository.save(Evaluation.builder()
                .internship(internship1)
                .evaluator(tutor)
                .type(Evaluation.EvaluationType.MID_TERM)
                .technicalScore(17.5)
                .softSkillsScore(18.0)
                .autonomyScore(16.5)
                .comments("Excellente progression technique, très autonome et force de proposition.")
                .build());
    }

    private User createUser(String email, String fullName, RoleName role, String field, String school) {
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode("password123"))
                .active(true)
                .build();

        Profile profile = Profile.builder()
                .user(user)
                .fullName(fullName)
                .school(school)
                .fieldOfStudy(field)
                .level("Bac+5 / M2")
                .phone("+212 600 000 000")
                .build();

        user.setProfile(profile);
        user.addRole(role);
        return userRepository.save(user);
    }

    private void createCandidate(InternshipOffer offer, String name, String email, String phone, String school, Candidate.CandidateStatus status, int score, String notes) {
        candidateRepository.save(Candidate.builder()
                .offer(offer)
                .fullName(name)
                .email(email)
                .phone(phone)
                .school(school)
                .status(status)
                .score(score)
                .notes(notes)
                .cvUrl("https://example.com/cv/" + email + ".pdf")
                .coverLetterUrl("https://example.com/letter/" + email + ".pdf")
                .build());
    }

    private void createTask(Internship internship, String title, String desc, Task.TaskStatus status, User tutor) {
        taskRepository.save(Task.builder()
                .internship(internship)
                .title(title)
                .description(desc)
                .dueDate(LocalDate.now().plusWeeks(2))
                .status(status)
                .assignedBy(tutor)
                .build());
    }
}

