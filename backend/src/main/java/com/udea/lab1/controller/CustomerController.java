package com.udea.lab1.controller;

import com.udea.lab1.DTO.CustomerDTO;
import com.udea.lab1.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCostumers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    //Obtain customer by id
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCostumerById(@PathVariable long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> createCostumer(@RequestBody CustomerDTO customerDTO) {
        if(customerDTO.getBalance()==null) {
            throw new IllegalArgumentException("the balance can not be null");
        }
        return ResponseEntity.ok(customerService.createCustomer(customerDTO));
    }

}
