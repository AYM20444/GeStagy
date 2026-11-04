package com.gestagy.repository;

import com.gestagy.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByOfferId(Long offerId);
    List<Candidate> findByStatus(Candidate.CandidateStatus status);
    long countByStatus(Candidate.CandidateStatus status);
}

