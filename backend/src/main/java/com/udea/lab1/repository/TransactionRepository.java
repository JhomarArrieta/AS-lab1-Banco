package com.udea.lab1.repository;

import com.udea.lab1.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> { //Entidad transaction y su clave primaria

    List<Transaction> findAllBySenderAccountNumberOrReceiverAccountNumber(String senderAccountNumbre, String  receiverAccountNumber);
}
