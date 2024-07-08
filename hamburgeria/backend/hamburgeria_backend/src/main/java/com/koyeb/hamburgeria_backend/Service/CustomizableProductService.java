package com.koyeb.hamburgeria_backend.Service;


import com.koyeb.hamburgeria_backend.Dto.CustomizableProductDTO;
import com.koyeb.hamburgeria_backend.Entity.CustomizableProduct;
import com.koyeb.hamburgeria_backend.Entity.Product;
import com.koyeb.hamburgeria_backend.Exception.CustomizableProductNotFoundException;
import com.koyeb.hamburgeria_backend.Repository.CustomizableProductRepository;
import com.koyeb.hamburgeria_backend.Repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomizableProductService {
    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");

    @Autowired
    private CustomizableProductRepository customizableProductRepository;

    @Autowired
    private ProductRepository productRepository;

    public CustomizableProduct createProduct(CustomizableProductDTO customizableProductDTO) {
        CustomizableProduct customizableProduct = new CustomizableProduct();
        customizableProduct.setItalianName(customizableProductDTO.getItalianName());
        customizableProduct.setItalianDescription(customizableProductDTO.getItalianDescription());
        customizableProduct.setEnglishName(customizableProductDTO.getEnglishName());
        customizableProduct.setEnglishDescription(customizableProductDTO.getEnglishDescription());
        customizableProduct.setPrice(customizableProductDTO.getPrice());
        customizableProduct.setCategory(customizableProductDTO.getCategory());
        customizableProduct.setAvailable(customizableProductDTO.isAvailable());

        // Convert product IDs to Product objects
        List<Product> products = customizableProductDTO.getProductList().stream()
                .map(id -> productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found with id: " + id)))
                .collect(Collectors.toList());
        customizableProduct.setProductList(products);

        customizableProductRepository.save(customizableProduct);
        loggerInfo.info("Product with id " + customizableProduct.getId() + " created.");
        return customizableProduct;
    }

    public CustomizableProduct getCustomizableProductById(Long id) throws CustomizableProductNotFoundException {
        return customizableProductRepository.findById(id)
                .orElseThrow(() -> new CustomizableProductNotFoundException("CustomizableProduct not found with id: " + id));
    }

    public List<CustomizableProduct> getCustomizableProducts() {
        List<CustomizableProduct> customizableProducts = customizableProductRepository.findAll();
        loggerInfo.info("Retrieved all customizableProducts");
        return customizableProducts;
    }

    public Page<CustomizableProduct> getAllCustomizableProducts(int page, String sortBy) {
        int fixedSize = 15;
        Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
        Page<CustomizableProduct> customizableProducts = customizableProductRepository.findAll(pageable);
        loggerInfo.info("Retrieved customizableProducts page " + page + " with fixed size " + fixedSize + " sorted by " + sortBy);
        return customizableProducts;
    }

    public CustomizableProduct updateCustomizableProduct(Long id, CustomizableProductDTO customizableProductDTO) throws CustomizableProductNotFoundException {
        CustomizableProduct customizableProduct = getCustomizableProductById(id);

        customizableProduct.setItalianName(customizableProductDTO.getItalianName());
        customizableProduct.setItalianDescription(customizableProductDTO.getItalianDescription());
        customizableProduct.setEnglishName(customizableProductDTO.getEnglishName());
        customizableProduct.setEnglishDescription(customizableProductDTO.getEnglishDescription());
        customizableProduct.setPrice(customizableProductDTO.getPrice());
        customizableProduct.setCategory(customizableProductDTO.getCategory());
        customizableProduct.setAvailable(customizableProductDTO.isAvailable());

        // Convert product IDs to Product objects
        List<Product> products = customizableProductDTO.getProductList().stream()
                .map(productId -> productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found with id: " + productId)))
                .collect(Collectors.toList());
        customizableProduct.setProductList(products);

        customizableProductRepository.save(customizableProduct);
        loggerInfo.info("CustomizableProduct with id " + id + " updated.");
        return customizableProduct;
    }

    public String deleteCustomizableProduct(Long id) throws CustomizableProductNotFoundException {
        CustomizableProduct customizableProduct = getCustomizableProductById(id);
        customizableProductRepository.delete(customizableProduct);
        loggerInfo.info("CustomizableProduct with id " + id + " deleted successfully.");
        return "CustomizableProduct with id " + id + " deleted successfully.";
    }
}
