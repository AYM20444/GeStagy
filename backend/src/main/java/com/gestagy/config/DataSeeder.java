package com.gestagy.config;

import com.gestagy.model.*;
import com.gestagy.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final InternshipOfferRepository offerRepository;
    private final CandidateRepository candidateRepository;
    private final InterviewRepository interviewRepository;
    private final InternshipRepository internshipRepository;
    private final TaskRepository taskRepository;
    private final EvaluationRepository evaluationRepository;
    private final DocumentRepository documentRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            InternshipOfferRepository offerRepository,
            CandidateRepository candidateRepository,
            InterviewRepository interviewRepository,
            InternshipRepository internshipRepository,
            TaskRepository taskRepository,
            EvaluationRepository evaluationRepository,
            DocumentRepository documentRepository,
            ActivityLogRepository activityLogRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.offerRepository = offerRepository;
        this.candidateRepository = candidateRepository;
        this.interviewRepository = interviewRepository;
        this.internshipRepository = internshipRepository;
        this.taskRepository = taskRepository;
        this.evaluationRepository = evaluationRepository;
        this.documentRepository = documentRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Déjà initialisé
        }

        // 1. Départements
        Department tech = departmentRepository.save(Department.builder().name("Ingénierie & Tech").description("Équipe R&D, Cloud, DevOps et Architecture Plateforme").build());
        Department product = departmentRepository.save(Department.builder().name("Produit & Design").description("Design UI/UX, Recherche Utilisateur et Product Management").build());
        Department marketing = departmentRepository.save(Department.builder().name("Marketing & Com").description("Growth Marketing, Marque Employeur et Relations Écoles").build());
        Department data = departmentRepository.save(Department.builder().name("Data & IA").description("Data Science, Machine Learning et Intelligence Artificielle").build());

        // 2. Utilisateurs clés (Mot de passe commun : password123)
        User admin = createUser("admin@gestagy.com", "Admin GeStagy", RoleName.ADMIN, "Direction des Systèmes d'Information", "Polytechnique");
        User hr = createUser("rh@gestagy.com", "Sarah Benali", RoleName.HR, "Responsable Talents & Campus", "ESCP");
        User recruiter = createUser("recruteur@gestagy.com", "Youssef Amrani", RoleName.RECRUITER, "Talent Acquisition Specialist", "HEC");
        User tutor1 = createUser("tuteur@gestagy.com", "Alexandre Martin", RoleName.TUTOR, "Principal Tech Lead FullStack", "INSA");
        User tutor2 = createUser("nadia.tuteur@gestagy.com", "Nadia Berrada", RoleName.TUTOR, "Lead Product Designer", "Strate Design");
        User internUser1 = createUser("stagiaire@gestagy.com", "Mehdi Mansouri", RoleName.INTERN, "Master 2 Ingénierie Logicielle (M2I)", "Faculté des Sciences");
        User internUser2 = createUser("lina@gestagy.com", "Lina Tazi", RoleName.INTERN, "Master UX & Digital Product Design", "École Supérieure de Design");

        // 3. Offres de stage réalistes
        InternshipOffer offer1 = offerRepository.save(InternshipOffer.builder()
                .title("Stagiaire Développeur FullStack (Angular / Spring Boot)")
                .description("Rejoignez notre équipe Core Platform pour concevoir des microservices résilients sous Spring Boot 3 et une interface utilisateur temps réel sous Angular.")
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
                .description("Contribuez à l'ergonomie, aux tests utilisateurs et aux composants de notre Design System web & mobile avec Figma et Tailwind CSS.")
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
                .description("Mise en place de pipelines CI/CD GitLab, automatisation de clusters Kubernetes et observabilité Prometheus / Grafana.")
                .department(tech)
                .skills(List.of("Kubernetes", "Docker", "GitLab CI", "Terraform", "Linux"))
                .durationMonths(6)
                .startDate(LocalDate.now().plusMonths(1))
                .location("Casablanca")
                .status(InternshipOffer.OfferStatus.OPEN)
                .createdBy(admin)
                .build());

        InternshipOffer offer4 = offerRepository.save(InternshipOffer.builder()
                .title("Stagiaire Data Scientist & IA Générative (LLM / RAG)")
                .description("Analyse prédictive des données RH, conception d'assistants intelligents de matching CV-Offre basés sur des architectures RAG.")
                .department(data)
                .skills(List.of("Python", "SQL", "PowerBI", "LangChain", "FastAPI"))
                .durationMonths(6)
                .startDate(LocalDate.now().plusWeeks(4))
                .location("Télétravail / Hybride")
                .status(InternshipOffer.OfferStatus.OPEN)
                .createdBy(hr)
                .build());

        InternshipOffer offer5 = offerRepository.save(InternshipOffer.builder()
                .title("Stagiaire Employer Branding & Relations Écoles")
                .description("Gestion de nos campagnes de recrutement campus, organisation de hackathons étudiants et communication digitale LinkedIn.")
                .department(marketing)
                .skills(List.of("Copywriting", "LinkedIn Ads", "Canva", "SEO", "Communication"))
                .durationMonths(3)
                .startDate(LocalDate.now().plusMonths(2))
                .location("Casablanca")
                .status(InternshipOffer.OfferStatus.DRAFT)
                .createdBy(recruiter)
                .build());

        // 4. Candidats dans les 5 colonnes Kanban (NEW, SCREENING, INTERVIEW, ACCEPTED, REJECTED)
        Candidate c1 = createCandidate(offer1, "Sophia El Fassi", "sophia.elfassi@test.com", "+212 600 112233", "ENSIAS", Candidate.CandidateStatus.NEW, 86, "Profil solide en Spring Boot 3 et architecture hexagonale.");
        Candidate c2 = createCandidate(offer1, "Karim Haddad", "karim.haddad@test.com", "+212 611 223344", "EMI", Candidate.CandidateStatus.NEW, 79, "Bonnes bases Java 21 et projets académiques Angular.");
        Candidate c3 = createCandidate(offer1, "Salma Bennani", "salma.bennani@test.com", "+212 622 334455", "INPT", Candidate.CandidateStatus.SCREENING, 88, "Entretien préliminaire RH très positif, disponible immédiatement.");
        Candidate c4 = createCandidate(offer1, "Ayoub Chraibi", "ayoub.chraibi@test.com", "+212 633 445566", "FST Fès", Candidate.CandidateStatus.INTERVIEW, 91, "Test algorithmique réussi avec brio, entretien technique programmé.");
        Candidate c5 = createCandidate(offer1, "Nour Alami", "nour.alami@test.com", "+212 644 556677", "EHTP", Candidate.CandidateStatus.ACCEPTED, 95, "Excellente candidate retenue, prête pour conversion en stagiaire.");
        Candidate c6 = createCandidate(offer1, "Hamza Berrada", "hamza.berrada@test.com", "+212 655 667788", "Université Hassan II", Candidate.CandidateStatus.REJECTED, 54, "Disponibilité incompatible avec la durée de 6 mois requise.");

        Candidate c7 = createCandidate(offer2, "Zineb Kabbaj", "zineb.kabbaj@test.com", "+212 666 778899", "Artcom Sup", Candidate.CandidateStatus.NEW, 81, "Portfolio Behance très créatif et structuré.");
        Candidate c8 = createCandidate(offer2, "Omar Slaoui", "omar.slaoui@test.com", "+212 677 889900", "ESAV", Candidate.CandidateStatus.SCREENING, 83, "Bonne sensibilité UX et maîtrise des Design Tokens.");
        Candidate c9 = createCandidate(offer2, "Ghita Idrissi", "ghita.idrissi@test.com", "+212 688 990011", "ComSup", Candidate.CandidateStatus.INTERVIEW, 89, "Revue de portfolio validée par l'équipe Design.");
        Candidate c10 = createCandidate(offer4, "Yassine Kettani", "yassine.kettani@test.com", "+212 699 001122", "UM6P", Candidate.CandidateStatus.ACCEPTED, 94, "Spécialiste NLP et pipelines RAG Python.");

        // 5. Entretiens planifiés
        interviewRepository.save(Interview.builder()
                .candidate(c4)
                .interviewer(tutor1)
                .scheduledAt(LocalDateTime.now().plusDays(1).withHour(10).withMinute(30))
                .type(Interview.InterviewType.VIDEO)
                .feedback("Excellente maîtrise de Spring Security et Angular Signals.")
                .rating(5)
                .build());

        interviewRepository.save(Interview.builder()
                .candidate(c9)
                .interviewer(tutor2)
                .scheduledAt(LocalDateTime.now().plusDays(2).withHour(14).withMinute(0))
                .type(Interview.InterviewType.ONSITE)
                .feedback("Exercice de maquettage Figma en direct prévu.")
                .rating(4)
                .build());

        interviewRepository.save(Interview.builder()
                .candidate(c3)
                .interviewer(recruiter)
                .scheduledAt(LocalDateTime.now().plusDays(3).withHour(11).withMinute(0))
                .type(Interview.InterviewType.PHONE)
                .feedback("Qualification téléphonique RH.")
                .rating(4)
                .build());

        // 6. Stages réels en cours
        Internship internship1 = internshipRepository.save(Internship.builder()
                .intern(internUser1)
                .tutor(tutor1)
                .department(tech)
                .startDate(LocalDate.now().minusMonths(2))
                .endDate(LocalDate.now().plusMonths(4))
                .topic("Développement de la plateforme FullStack GeStagy avec Angular 22 et Spring Boot 3")
                .status(Internship.InternshipStatus.ONGOING)
                .build());

        Internship internship2 = internshipRepository.save(Internship.builder()
                .intern(internUser2)
                .tutor(tutor2)
                .department(product)
                .startDate(LocalDate.now().minusMonths(1))
                .endDate(LocalDate.now().plusMonths(3))
                .topic("Refonte complète de l'expérience utilisateur et du Design System GeStagy")
                .status(Internship.InternshipStatus.ONGOING)
                .build());

        // 7. Tâches pour les stagiaires
        createTask(internship1, "Mise en place de l'environnement et base de données", "Configurer le projet Spring Boot, la persistance JPA et valider le build.", Task.TaskStatus.DONE, tutor1);
        createTask(internship1, "Implémentation de l'authentification JWT & RBAC", "Sécuriser les endpoints REST par rôle (ADMIN, HR, RECRUITER, TUTOR, INTERN).", Task.TaskStatus.DONE, tutor1);
        createTask(internship1, "Développement du Pipeline Kanban Drag & Drop", "Permettre le déplacement temps réel des candidats sur 5 colonnes avec sauvegarde.", Task.TaskStatus.IN_PROGRESS, tutor1);
        createTask(internship1, "Module d'Évaluation & Génération PDF Officielle", "Générer dynamiquement les attestations de stage et fiches d'évaluation en PDF.", Task.TaskStatus.TODO, tutor1);

        createTask(internship2, "Audit UX et parcours Candidat / Recruteur", "Analyser les points de friction et proposer les wireframes haute fidélité.", Task.TaskStatus.DONE, tutor2);
        createTask(internship2, "Création des composants UI Tailwind CSS", "Concevoir les cartes KPI, tiroirs de détail candidat et tableaux Kanban.", Task.TaskStatus.IN_PROGRESS, tutor2);

        // 8. Évaluations de mi-parcours
        evaluationRepository.save(Evaluation.builder()
                .internship(internship1)
                .evaluator(tutor1)
                .type(Evaluation.EvaluationType.MID_TERM)
                .technicalScore(18.0)
                .softSkillsScore(17.5)
                .autonomyScore(17.0)
                .comments("Excellente progression technique sur Spring Boot et Angular. Mehdi est autonome, rigoureux et force de proposition.")
                .build());

        evaluationRepository.save(Evaluation.builder()
                .internship(internship2)
                .evaluator(tutor2)
                .type(Evaluation.EvaluationType.MID_TERM)
                .technicalScore(17.0)
                .softSkillsScore(18.5)
                .autonomyScore(16.5)
                .comments("Très grande créativité et excellente communication avec les équipes techniques.")
                .build());

        // 9. Documents de stage
        documentRepository.save(Document.builder()
                .internship(internship1)
                .type(Document.DocumentType.CONVENTION)
                .fileName("Convention_Tripartite_Mehdi_Mansouri.pdf")
                .fileUrl("/api/internships/" + internship1.getId() + "/attestation/pdf")
                .uploadedBy(hr)
                .signed(true)
                .build());

        documentRepository.save(Document.builder()
                .internship(internship1)
                .type(Document.DocumentType.REPORT)
                .fileName("Rapport_Avancement_Mi_Parcours_M2I.pdf")
                .fileUrl("/api/internships/" + internship1.getId() + "/attestation/pdf")
                .uploadedBy(internUser1)
                .signed(true)
                .build());

        documentRepository.save(Document.builder()
                .internship(internship2)
                .type(Document.DocumentType.CONVENTION)
                .fileName("Convention_Stage_Lina_Tazi.pdf")
                .fileUrl("/api/internships/" + internship2.getId() + "/attestation/pdf")
                .uploadedBy(hr)
                .signed(false)
                .build());

        // 10. Journal d'activité initial
        activityLogRepository.save(ActivityLog.builder()
                .user(hr)
                .action("CANDIDATE_ACCEPTED")
                .entity("Candidate")
                .entityId(c5.getId())
                .details("Candidature de Nour Alami (EHTP) validée avec un score de 95%")
                .build());

        activityLogRepository.save(ActivityLog.builder()
                .user(tutor1)
                .action("EVALUATION_COMPLETED")
                .entity("Evaluation")
                .entityId(internship1.getId())
                .details("Évaluation mi-parcours enregistrée pour Mehdi Mansouri (17.5/20)")
                .build());

        activityLogRepository.save(ActivityLog.builder()
                .user(recruiter)
                .action("INTERVIEW_SCHEDULED")
                .entity("Interview")
                .entityId(c4.getId())
                .details("Entretien technique VIDEO planifié pour Ayoub Chraibi")
                .build());

        activityLogRepository.save(ActivityLog.builder()
                .user(hr)
                .action("OFFER_PUBLISHED")
                .entity("InternshipOffer")
                .entityId(offer4.getId())
                .details("Publication de l'offre : Stagiaire Data Scientist & IA Générative")
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
                .level("Bac+5 / Master 2")
                .phone("+212 600 10 20 30")
                .build();

        user.setProfile(profile);
        user.addRole(role);
        return userRepository.save(user);
    }

    private Candidate createCandidate(InternshipOffer offer, String name, String email, String phone, String school, Candidate.CandidateStatus status, int score, String notes) {
        return candidateRepository.save(Candidate.builder()
                .offer(offer)
                .fullName(name)
                .email(email)
                .phone(phone)
                .school(school)
                .status(status)
                .score(score)
                .notes(notes)
                .cvUrl("/api/internships/1/attestation/pdf")
                .coverLetterUrl("/api/internships/1/attestation/pdf")
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
