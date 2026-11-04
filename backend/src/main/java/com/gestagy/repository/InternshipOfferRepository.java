package com.gestagy.repository;

import com.gestagy.model.InternshipOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipOfferRepository extends JpaRepository<InternshipOffer, Long> {
    List<InternshipOffer> findByStatus(InternshipOffer.OfferStatus status);
    List<InternshipOffer> findByDepartmentId(Long departmentId);
}

