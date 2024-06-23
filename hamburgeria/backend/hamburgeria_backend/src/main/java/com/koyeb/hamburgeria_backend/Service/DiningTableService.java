package com.koyeb.hamburgeria_backend.Service;

import com.koyeb.hamburgeria_backend.Dto.DiningTableDTO;
import com.koyeb.hamburgeria_backend.Entity.DiningTable;
import com.koyeb.hamburgeria_backend.Exception.DiningTableNotFoundException;
import com.koyeb.hamburgeria_backend.Repository.DiningTableRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiningTableService {

    @Autowired
    private DiningTableRepository diningTableRepository;

    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");

    public DiningTable createDiningTable(DiningTableDTO diningTableDTO) {
        DiningTable diningTable = new DiningTable();
        diningTable.setTableNumber(diningTableDTO.getTableNumber());
        diningTable.setSeating(diningTableDTO.getSeating());
        diningTable.setOutside(diningTableDTO.isOutside());

        diningTableRepository.save(diningTable);

        loggerInfo.info("DiningTable with id " + diningTable.getId() + " created.");
        return diningTable;
    }

    public DiningTable getDiningTableById(Long id) throws DiningTableNotFoundException {
        return diningTableRepository.findById(id)
                .orElseThrow(() -> new DiningTableNotFoundException("DiningTable not found with id: " + id));
    }

    public List<DiningTable> getAllDiningTables() {
        List<DiningTable> diningTables = diningTableRepository.findAll();
        loggerInfo.info("Retrieved all dining tables.");
        return diningTables;
    }

    public Page<DiningTable> getAllDiningTables(int page, String sortBy) {
        int fixedSize = 15;
        Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
        Page<DiningTable> diningTables = diningTableRepository.findAll(pageable);
        loggerInfo.info("Retrieved dining tables page " + page + " with fixed size " + fixedSize + " sorted by " + sortBy);
        return diningTables;
    }

    public DiningTable updateDiningTable(Long id, DiningTableDTO diningTableDTO) throws DiningTableNotFoundException {
        DiningTable diningTable = getDiningTableById(id);

        diningTable.setTableNumber(diningTableDTO.getTableNumber());
        diningTable.setSeating(diningTableDTO.getSeating());
        diningTable.setOutside(diningTableDTO.isOutside());

        diningTableRepository.save(diningTable);
        loggerInfo.info("DiningTable with id " + id + " updated.");

        return diningTable;
    }

    public String deleteDiningTable(Long id) throws DiningTableNotFoundException {
        DiningTable diningTable = getDiningTableById(id);
        diningTableRepository.delete(diningTable);
        loggerInfo.info("DiningTable with id " + id + " deleted successfully.");
        return "DiningTable with id " + id + " deleted successfully.";
    }
}
