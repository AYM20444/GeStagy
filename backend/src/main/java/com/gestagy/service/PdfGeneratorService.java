package com.gestagy.service;

import com.gestagy.model.Evaluation;
import com.gestagy.model.Internship;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Pure Java 21 PDF 1.4 Generator for Official GeStagy Documents:
 * - Attestation de Stage (Internship Certificate)
 * - Fiche d'Évaluation de Stagiaire (Mid-Term / Final Evaluation Report)
 * - Convention de Stage (Internship Agreement)
 */
@Service
public class PdfGeneratorService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public byte[] generateInternshipAttestationPdf(Internship internship) {
        String internName = internship.getIntern().getProfile() != null
                ? internship.getIntern().getProfile().getFullName()
                : internship.getIntern().getEmail();
        String internSchool = internship.getIntern().getProfile() != null && internship.getIntern().getProfile().getSchool() != null
                ? internship.getIntern().getProfile().getSchool()
                : "Établissement d'Enseignement Supérieur";
        String internLevel = internship.getIntern().getProfile() != null && internship.getIntern().getProfile().getLevel() != null
                ? internship.getIntern().getProfile().getLevel()
                : "Cycle Master / Ingénieur";
        String tutorName = internship.getTutor().getProfile() != null
                ? internship.getTutor().getProfile().getFullName()
                : internship.getTutor().getEmail();
        String deptName = internship.getDepartment() != null ? internship.getDepartment().getName() : "Direction Générale";
        String startDate = internship.getStartDate() != null ? internship.getStartDate().format(DATE_FMT) : "-";
        String endDate = internship.getEndDate() != null ? internship.getEndDate().format(DATE_FMT) : "-";
        String today = LocalDate.now().format(DATE_FMT);

        StringBuilder stream = new StringBuilder();
        // Header Banner (Indigo)
        stream.append("0.22 0.19 0.64 rg 40 730 515 70 re f\n");
        stream.append("1 1 1 rg\n");
        drawText(stream, "F2", 22, 60, 768, "GESTAGY ENTERPRISE PLATFORM");
        drawText(stream, "F1", 11, 60, 748, "Direction des Ressources Humaines & Gestion des Talents");

        // Document Title Box
        stream.append("0.95 0.96 0.99 rg 40 660 515 48 re f\n");
        stream.append("0.22 0.19 0.64 RG 1.5 w 40 660 515 48 re S\n");
        stream.append("0.12 0.16 0.23 rg\n");
        drawText(stream, "F2", 18, 175, 678, "ATTESTATION DE STAGE");

        // Reference & Date
        stream.append("0.35 0.40 0.48 rg\n");
        drawText(stream, "F1", 10, 60, 630, "Reference : ATT-GESTAGY-2026-00" + internship.getId());
        drawText(stream, "F1", 10, 410, 630, "Fait le : " + today);

        // Body Content
        stream.append("0.12 0.16 0.23 rg\n");
        drawText(stream, "F1", 12, 60, 585, "Nous soussignes, Direction des Ressources Humaines de GeStagy Technologies,");
        drawText(stream, "F1", 12, 60, 565, "certifions par la presente que :");

        // Intern Details Card
        stream.append("0.97 0.98 1.0 rg 60 455 475 90 re f\n");
        stream.append("0.82 0.85 0.92 RG 1 w 60 455 475 90 re S\n");
        stream.append("0.22 0.19 0.64 rg\n");
        drawText(stream, "F2", 14, 80, 522, internName);
        stream.append("0.15 0.20 0.28 rg\n");
        drawText(stream, "F1", 11, 80, 500, "Ecole / Universite : " + internSchool + " (" + internLevel + ")");
        drawText(stream, "F1", 11, 80, 482, "Departement d'accueil : " + deptName);
        drawText(stream, "F1", 11, 80, 464, "Encadrant / Tuteur : " + tutorName);

        // Internship Period & Topic
        drawText(stream, "F1", 12, 60, 420, "A effectue un stage au sein de notre entreprise durant la periode :");
        stream.append("0.22 0.19 0.64 rg\n");
        drawText(stream, "F2", 12, 60, 398, "Du " + startDate + " au " + endDate + "  (Statut : " + internship.getStatus().name() + ")");

        stream.append("0.12 0.16 0.23 rg\n");
        drawText(stream, "F2", 12, 60, 362, "Sujet et missions principales du stage :");
        List<String> lines = wrapText(internship.getTopic(), 72);
        int y = 342;
        for (String line : lines) {
            drawText(stream, "F1", 11, 60, y, line);
            y -= 18;
        }

        drawText(stream, "F1", 11, 60, 260, "Durant son stage, l'interesse(e) a fait preuve de rigueur, d'autonomie et d'un grand");
        drawText(stream, "F1", 11, 60, 242, "professionnalisme dans l'accomplissement des missions qui lui ont ete confiees.");
        drawText(stream, "F1", 11, 60, 212, "La presente attestation est delivree a l'interesse(e) pour servir et valoir ce que de droit.");

        // Signature Stamp Box
        stream.append("0.96 0.97 0.99 rg 330 95 205 90 re f\n");
        stream.append("0.22 0.19 0.64 RG 1 w 330 95 205 90 re S\n");
        stream.append("0.22 0.19 0.64 rg\n");
        drawText(stream, "F2", 11, 345, 165, "Cachet & Signature RH");
        stream.append("0.15 0.55 0.35 rg\n");
        drawText(stream, "F2", 12, 345, 140, "[ SIGNE ELECTRONIQUEMENT ]");
        stream.append("0.35 0.40 0.48 rg\n");
        drawText(stream, "F1", 9, 345, 118, "Sarah Benali - Responsable RH");
        drawText(stream, "F1", 9, 345, 105, "GeStagy Certificat Officiel");

        // Footer
        stream.append("0.55 0.60 0.68 rg\n");
        drawText(stream, "F1", 9, 135, 45, "GeStagy Platform - Document officiel genere numeriquement - Verification : ID #" + internship.getId());

        return buildSinglePagePdf(stream.toString());
    }

    public byte[] generateEvaluationPdf(Evaluation eval) {
        Internship internship = eval.getInternship();
        String internName = internship.getIntern().getProfile() != null
                ? internship.getIntern().getProfile().getFullName()
                : internship.getIntern().getEmail();
        String evaluatorName = eval.getEvaluator().getProfile() != null
                ? eval.getEvaluator().getProfile().getFullName()
                : eval.getEvaluator().getEmail();
        String deptName = internship.getDepartment() != null ? internship.getDepartment().getName() : "-";
        double avg = Math.round(((eval.getTechnicalScore() + eval.getSoftSkillsScore() + eval.getAutonomyScore()) / 3.0) * 10.0) / 10.0;
        String evalTypeLabel = eval.getType() == Evaluation.EvaluationType.FINAL
                ? "EVALUATION FINALE DE FIN DE STAGE"
                : "EVALUATION INTERMEDIAIRE (MI-PARCOURS)";
        String evalDate = eval.getCreatedAt() != null
                ? eval.getCreatedAt().toLocalDate().format(DATE_FMT)
                : LocalDate.now().format(DATE_FMT);

        StringBuilder stream = new StringBuilder();
        // Header Banner
        stream.append("0.18 0.16 0.52 rg 40 730 515 70 re f\n");
        stream.append("1 1 1 rg\n");
        drawText(stream, "F2", 20, 60, 768, "GESTAGY - FICHE D'EVALUATION STAGIAIRE");
        drawText(stream, "F1", 11, 60, 748, evalTypeLabel);

        // Info Grid
        stream.append("0.96 0.97 0.99 rg 40 610 515 100 re f\n");
        stream.append("0.82 0.85 0.92 RG 1 w 40 610 515 100 re S\n");
        stream.append("0.12 0.16 0.23 rg\n");
        drawText(stream, "F2", 12, 60, 688, "Stagiaire : " + internName);
        drawText(stream, "F1", 11, 60, 668, "Departement : " + deptName);
        drawText(stream, "F1", 11, 60, 648, "Evaluateur / Tuteur : " + evaluatorName);
        drawText(stream, "F1", 11, 60, 628, "Date d'evaluation : " + evalDate + "   |   Ref : EVAL-" + eval.getId());

        // Scores Section
        drawText(stream, "F2", 14, 60, 575, "Grille d'Evaluation des Competences (sur 20) :");

        drawScoreRow(stream, 530, "1. Competences Techniques & Qualite du Travail", eval.getTechnicalScore());
        drawScoreRow(stream, 475, "2. Soft Skills, Communication & Esprit d'Equipe", eval.getSoftSkillsScore());
        drawScoreRow(stream, 420, "3. Autonomie, Initiative & Respect des Delais", eval.getAutonomyScore());

        // Global Score Highlight Box
        stream.append("0.93 0.95 1.0 rg 60 335 475 58 re f\n");
        stream.append("0.22 0.19 0.64 RG 1.5 w 60 335 475 58 re S\n");
        stream.append("0.22 0.19 0.64 rg\n");
        drawText(stream, "F2", 15, 80, 358, "SCORE GLOBAL MOYEN :   " + avg + " / 20");
        String appreciation = avg >= 16 ? "Tres Honorable / Excellent" : (avg >= 14 ? "Bien / Solide" : (avg >= 12 ? "Satisfaisant" : "A renforcer"));
        drawText(stream, "F2", 12, 330, 358, "Mention : " + appreciation);

        // Comments Box
        stream.append("0.12 0.16 0.23 rg\n");
        drawText(stream, "F2", 13, 60, 300, "Apwania & Commentaires detailles de l'Encadrant :");
        stream.append("0.98 0.98 0.99 rg 60 185 475 100 re f\n");
        stream.append("0.82 0.85 0.92 RG 1 w 60 185 475 100 re S\n");
        stream.append("0.20 0.25 0.33 rg\n");
        List<String> commentLines = wrapText(eval.getComments() != null ? eval.getComments() : "Aucun commentaire additionnel.", 70);
        int cy = 262;
        for (String line : commentLines) {
            if (cy < 195) break;
            drawText(stream, "F1", 11, 75, cy, line);
            cy -= 18;
        }

        // Signatures
        stream.append("0.35 0.40 0.48 rg\n");
        drawText(stream, "F2", 10, 60, 140, "Signature de l'Encadrant :");
        drawText(stream, "F1", 10, 60, 122, evaluatorName + " (Valide numeriquement)");

        drawText(stream, "F2", 10, 350, 140, "Visa Ressources Humaines :");
        drawText(stream, "F1", 10, 350, 122, "Direction RH GeStagy");

        stream.append("0.55 0.60 0.68 rg\n");
        drawText(stream, "F1", 9, 140, 45, "GeStagy Platform - Rapport d'evaluation officiel - Evaluation ID #" + eval.getId());

        return buildSinglePagePdf(stream.toString());
    }

    private void drawScoreRow(StringBuilder stream, int y, String label, Double scoreVal) {
        double s = scoreVal != null ? scoreVal : 0.0;
        double ratio = Math.max(0.0, Math.min(1.0, s / 20.0));
        int barWidth = (int) (350 * ratio);

        stream.append("0.15 0.20 0.28 rg\n");
        drawText(stream, "F2", 11, 60, y, label);
        drawText(stream, "F2", 12, 435, y, String.format("%.1f / 20", s));

        // Background bar
        stream.append("0.90 0.92 0.95 rg 60 ").append(y - 20).append(" 350 10 re f\n");
        // Foreground bar
        stream.append("0.25 0.32 0.85 rg 60 ").append(y - 20).append(" ").append(barWidth).append(" 10 re f\n");
    }

    private void drawText(StringBuilder stream, String font, int size, int x, int y, String text) {
        String safe = sanitizePdfText(text);
        stream.append("BT /").append(font).append(" ").append(size).append(" Tf ")
                .append(x).append(" ").append(y).append(" Td (").append(safe).append(") Tj ET\n");
    }

    private List<String> wrapText(String text, int maxChars) {
        List<String> lines = new ArrayList<>();
        if (text == null || text.isBlank()) {
            lines.add("-");
            return lines;
        }
        String[] words = text.split("\\s+");
        StringBuilder current = new StringBuilder();
        for (String w : words) {
            if (current.length() + w.length() + 1 > maxChars) {
                lines.add(current.toString());
                current = new StringBuilder(w);
            } else {
                if (!current.isEmpty()) current.append(" ");
                current.append(w);
            }
        }
        if (!current.isEmpty()) lines.add(current.toString());
        return lines;
    }

    private String sanitizePdfText(String input) {
        if (input == null) return "";
        String normalized = input
                .replace("é", "e").replace("è", "e").replace("ê", "e").replace("ë", "e")
                .replace("É", "E").replace("È", "E").replace("Ê", "E")
                .replace("à", "a").replace("â", "a").replace("ä", "a").replace("À", "A")
                .replace("î", "i").replace("ï", "i").replace("Î", "I")
                .replace("ô", "o").replace("ö", "o").replace("Ô", "O")
                .replace("ù", "u").replace("û", "u").replace("ü", "u").replace("Ù", "U")
                .replace("ç", "c").replace("Ç", "C")
                .replace("’", "'").replace("‘", "'").replace("“", "\"").replace("”", "\"")
                .replace("–", "-").replace("—", "-");
        StringBuilder sb = new StringBuilder();
        for (char c : normalized.toCharArray()) {
            if (c == '(' || c == ')' || c == '\\') {
                sb.append('\\').append(c);
            } else if (c >= 32 && c <= 126) {
                sb.append(c);
            } else {
                sb.append(' ');
            }
        }
        return sb.toString();
    }

    private byte[] buildSinglePagePdf(String contentStream) {
        byte[] contentBytes = contentStream.getBytes(StandardCharsets.US_ASCII);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        List<Integer> offsets = new ArrayList<>();

        writeAscii(out, "%PDF-1.4\n");

        // 1: Catalog
        offsets.add(out.size());
        writeAscii(out, "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

        // 2: Pages
        offsets.add(out.size());
        writeAscii(out, "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

        // 3: Page
        offsets.add(out.size());
        writeAscii(out, "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n");

        // 4: Font F1 (Helvetica)
        offsets.add(out.size());
        writeAscii(out, "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");

        // 5: Font F2 (Helvetica-Bold)
        offsets.add(out.size());
        writeAscii(out, "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n");

        // 6: Content stream
        offsets.add(out.size());
        writeAscii(out, "6 0 obj\n<< /Length " + contentBytes.length + " >>\nstream\n");
        out.writeBytes(contentBytes);
        writeAscii(out, "\nendstream\nendobj\n");

        int xrefOffset = out.size();
        writeAscii(out, "xref\n0 7\n0000000000 65535 f \n");
        for (int offset : offsets) {
            writeAscii(out, String.format("%010d 00000 n \n", offset));
        }
        writeAscii(out, "trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n" + xrefOffset + "\n%%EOF");
        return out.toByteArray();
    }

    private void writeAscii(ByteArrayOutputStream out, String s) {
        out.writeBytes(s.getBytes(StandardCharsets.US_ASCII));
    }
}

