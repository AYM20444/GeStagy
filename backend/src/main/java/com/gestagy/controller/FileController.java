package com.gestagy.controller;

import com.gestagy.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/files")
@Tag(name = "File Storage", description = "Téléchargement sécurisé des CVs, lettres de motivation et rapports")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/{fileName:.+}")
    @Operation(summary = "Télécharger ou visualiser un fichier stocké")
    public ResponseEntity<byte[]> serveFile(@PathVariable String fileName) {
        try {
            Path path = fileStorageService.resolveFilePath(fileName);
            if (!Files.exists(path)) {
                return ResponseEntity.notFound().build();
            }
            byte[] bytes = Files.readAllBytes(path);
            String contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/pdf";
            }
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(bytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

