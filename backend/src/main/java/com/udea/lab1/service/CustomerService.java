package com.udea.lab1.service;

import com.udea.lab1.mapper.CustomerMapper;
import com.udea.lab1.repository.CustomerRepository;
import com.udea.lab1.DTO.CustomerDTO;
import com.udea.lab1.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    //Dependency injection
    @Autowired
    public CustomerService(CustomerRepository customerRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    //Obtain the information from all customers
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toDTO).toList();
    }

    //Obtain a data of client by id
    public CustomerDTO getCustomerById(long id) {
        return customerRepository.findById(id).map(customerMapper::toDTO)
                .orElseThrow(()-> new RuntimeException("Customer not found"));
    }

    //Create new customer
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Customer customer = customerMapper.toEntity(customerDTO);
        return customerMapper.toDTO(customerRepository.save(customer));
    }




}

