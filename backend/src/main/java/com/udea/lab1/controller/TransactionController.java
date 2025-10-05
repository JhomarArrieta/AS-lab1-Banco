package com.udea.lab1.controller;

import com.udea.lab1.DTO.TransactionDTO;
import com.udea.lab1.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;


    @PostMapping
    public ResponseEntity<?> transferMoney(@RequestBody TransactionDTO transactionDTO) {
        try {
            TransactionDTO savedTransaction = transactionService.transferMoney(transactionDTO);
            return ResponseEntity.ok().body(savedTransaction);
        }catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping(value = "/{accountNumber}")
    public List<TransactionDTO> getTransactionsByAccount(@PathVariable String accountNumber) {
        return transactionService.getTransactionsForAccount(accountNumber);
    }
}
