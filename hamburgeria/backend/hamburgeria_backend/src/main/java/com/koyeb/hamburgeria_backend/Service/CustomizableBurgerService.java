package com.koyeb.hamburgeria_backend.Service;

import com.koyeb.hamburgeria_backend.Dto.CustomizableBurgerDTO;
import com.koyeb.hamburgeria_backend.Entity.CustomizableBurger;
import com.koyeb.hamburgeria_backend.Entity.CustomizableBurger;
import com.koyeb.hamburgeria_backend.Entity.Product;
import com.koyeb.hamburgeria_backend.Enum.Category;
import com.koyeb.hamburgeria_backend.Exception.CustomizableBurgerNotFoundException;
import com.koyeb.hamburgeria_backend.Repository.CustomizableBurgerRepository;
import com.koyeb.hamburgeria_backend.Repository.ProductRepository;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomizableBurgerService {
    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");

    @Autowired
    private CustomizableBurgerRepository customizableBurgerRepository;

    @Autowired
    private ProductRepository productRepository;

    public CustomizableBurger createBurger(CustomizableBurgerDTO customizableBurgerDTO) {
        CustomizableBurger customizableBurger = new CustomizableBurger();
        customizableBurger.setItalianName(customizableBurgerDTO.getItalianName());
        customizableBurger.setItalianDescription(customizableBurgerDTO.getItalianDescription());
        customizableBurger.setEnglishName(customizableBurgerDTO.getEnglishName());
        customizableBurger.setEnglishDescription(customizableBurgerDTO.getEnglishDescription());
        customizableBurger.setPrice(customizableBurgerDTO.getPrice());
        customizableBurger.setCategory(customizableBurgerDTO.getCategory());
        customizableBurger.setAvailable(customizableBurgerDTO.isAvailable());

        // Convert product IDs to Product objects
        List<Product> products = customizableBurgerDTO.getProductList().stream()
                .map(id -> productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found with id: " + id)))
                .collect(Collectors.toList());
        customizableBurger.setProductList(products);

        customizableBurgerRepository.save(customizableBurger);
        loggerInfo.info("Burger with id " + customizableBurger.getId() + " created.");
        return customizableBurger;
    }

    public CustomizableBurger getCustomizableBurgerById(Long id) throws CustomizableBurgerNotFoundException {
        return customizableBurgerRepository.findById(id)
                .orElseThrow(() -> new CustomizableBurgerNotFoundException("CustomizableBurger not found with id: " + id));
    }

    public List<CustomizableBurger> getCustomizableBurgers() {
        List<CustomizableBurger> customizableBurgers = customizableBurgerRepository.findAll();
        loggerInfo.info("Retrieved all customizableBurgers");
        return customizableBurgers;
    }

    public Page<CustomizableBurger> getAllCustomizableBurgers(int page, String sortBy) {
        int fixedSize = 15;
        Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
        Page<CustomizableBurger> customizableBurgers = customizableBurgerRepository.findAll(pageable);
        loggerInfo.info("Retrieved customizableBurgers page " + page + " with fixed size " + fixedSize + " sorted by " + sortBy);
        return customizableBurgers;
    }

    public CustomizableBurger updateCustomizableBurger(Long id, CustomizableBurgerDTO customizableBurgerDTO) throws CustomizableBurgerNotFoundException {
        CustomizableBurger customizableBurger = getCustomizableBurgerById(id);

        customizableBurger.setItalianName(customizableBurgerDTO.getItalianName());
        customizableBurger.setItalianDescription(customizableBurgerDTO.getItalianDescription());
        customizableBurger.setEnglishName(customizableBurgerDTO.getEnglishName());
        customizableBurger.setEnglishDescription(customizableBurgerDTO.getEnglishDescription());
        customizableBurger.setPrice(customizableBurgerDTO.getPrice());
        customizableBurger.setCategory(customizableBurgerDTO.getCategory());
        customizableBurger.setAvailable(customizableBurgerDTO.isAvailable());

        // Convert product IDs to Product objects
        List<Product> products = customizableBurgerDTO.getProductList().stream()
                .map(productId -> productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found with id: " + productId)))
                .collect(Collectors.toList());
        customizableBurger.setProductList(products);

        customizableBurgerRepository.save(customizableBurger);
        loggerInfo.info("CustomizableBurger with id " + id + " updated.");
        return customizableBurger;
    }

    public String deleteCustomizableBurger(Long id) throws CustomizableBurgerNotFoundException {
        CustomizableBurger customizableBurger = getCustomizableBurgerById(id);
        customizableBurgerRepository.delete(customizableBurger);
        loggerInfo.info("CustomizableBurger with id " + id + " deleted successfully.");
        return "CustomizableBurger with id " + id + " deleted successfully.";
    }
}
