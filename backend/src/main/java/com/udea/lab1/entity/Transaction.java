package com.udea.lab1.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name="transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "sender_account_num", nullable = false)
    private String senderAccountNumber;
    @Column(name = "receiver_account_num", nullable = false)
    private String receiverAccountNumber;
    @Column(nullable = false)
    private Double amount;
    @CreationTimestamp
    @Column(nullable = false,  updatable = false)
    private LocalDateTime transactionDate;
}
