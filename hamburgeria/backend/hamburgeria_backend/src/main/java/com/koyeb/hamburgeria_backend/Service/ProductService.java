package com.koyeb.hamburgeria_backend.Service;

import com.koyeb.hamburgeria_backend.Dto.ProductDTO;
import com.koyeb.hamburgeria_backend.Entity.Product;
import com.koyeb.hamburgeria_backend.Enum.Category;
import com.koyeb.hamburgeria_backend.Exception.ProductNotFoundException;
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

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");

    public Product createProduct(ProductDTO productDTO) {
        Product product = new Product();
        product.setItalianName(productDTO.getItalianName());
        product.setItalianDescription(productDTO.getItalianDescription());
        product.setEnglishName(productDTO.getEnglishName());
        product.setEnglishDescription(productDTO.getEnglishDescription());
        product.setPrice(productDTO.getPrice());
        product.setCategory(productDTO.getCategory());
        product.setAvailable(productDTO.isAvailable());

        productRepository.save(product);
        loggerInfo.info("Product with id " + product.getId() + " created.");
        return product;
    }

    public Product getProductById(Long id) throws ProductNotFoundException {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
    }

    public List<Product> getProducts() {
        List<Product> products = productRepository.findAll();
        loggerInfo.info("Retrieved all products");
        return products;
    }

    public List<Product> getProductsByCategory(Category category) {
        List<Product> products = productRepository.findByCategory(category);
        loggerInfo.info("Retrieved products for category " + category);
        return products;
    }

    public Page<Product> getAllProducts(int page, String sortBy) {
        int fixedSize = 15;
        Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
        Page<Product> products = productRepository.findAll(pageable);
        loggerInfo.info("Retrieved products page " + page + " with fixed size " + fixedSize + " sorted by " + sortBy);
        return products;
    }

    public Product updateProduct(Long id, ProductDTO productDTO) throws ProductNotFoundException {
        Product product = getProductById(id);

        product.setItalianName(productDTO.getItalianName());
        product.setItalianDescription(productDTO.getItalianDescription());
        product.setEnglishName(productDTO.getEnglishName());
        product.setEnglishDescription(productDTO.getEnglishDescription());
        product.setPrice(productDTO.getPrice());
        product.setCategory(productDTO.getCategory());
        product.setAvailable(productDTO.isAvailable());

        productRepository.save(product);
        loggerInfo.info("Product with id " + id + " updated.");
        return product;
    }

    public String deleteProduct(Long id) throws ProductNotFoundException {
        Product product = getProductById(id);
        productRepository.delete(product);
        loggerInfo.info("Product with id " + id + " deleted successfully.");
        return "Product with id " + id + " deleted successfully.";
    }

    @Transactional
    public void importProductsFromCSV() throws IOException, CsvException {
        String filePath = "src/main/resources/hamburgeria-menu.csv";
        try (CSVReader csvReader = new CSVReaderBuilder(new FileReader(filePath))
                .withCSVParser(new CSVParserBuilder().withSeparator(',').build())
                .build()) {

            csvReader.skip(1); // Skip header row

            List<String[]> rows = csvReader.readAll();

            for (String[] row : rows) {
                System.out.println("Raw row length: " + row.length); // Print the length of the row
                System.out.println("Raw row: " + Arrays.toString(row)); // Print the array as a readable string

                // Remove whitespace from each element of the array
                for (int i = 0; i < row.length; i++) {
                    row[i] = row[i].trim();
                }

                System.out.println("Trimmed row length: " + row.length); // Print the length of the row after trimming
                System.out.println("Trimmed row: " + Arrays.toString(row)); // Print the modified array

                if (row.length == 7) { // Ensure there are exactly 7 columns
                    String italianName = row[0];
                    String englishName = row[1];
                    Double price = Double.parseDouble(row[2]);
                    Category category = Category.valueOf(row[3]);
                    Boolean available = Boolean.parseBoolean(row[4]);
                    String italianDescription = row[5];
                    String englishDescription = row[6];

                    Product product = new Product();
                    product.setItalianName(italianName);
                    product.setItalianDescription(italianDescription);
                    product.setEnglishName(englishName);
                    product.setEnglishDescription(englishDescription);
                    product.setPrice(price);
                    product.setCategory(category);
                    product.setAvailable(available);

                    // Save the product to the repository
                    productRepository.save(product);
                } else {
                    System.out.println("Skipped row due to insufficient length: " + Arrays.toString(row));
                }
            }
        }
    }
}
