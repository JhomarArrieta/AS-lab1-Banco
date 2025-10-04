package com.udea.lab1.mapper;

import com.udea.lab1.DTO.CustomerDTO;
import com.udea.lab1.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class); //genera una instancia automatica en tiempo de complicacion
    CustomerDTO toDTO(Customer customer);
    Customer toEntity(CustomerDTO customerDTO);
}
