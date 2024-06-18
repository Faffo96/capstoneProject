package com.koyeb.hamburgeria_backend.Service;

import com.koyeb.hamburgeria_backend.Entity.Shift;
import com.koyeb.hamburgeria_backend.Exception.ShiftNotFoundException;
import com.koyeb.hamburgeria_backend.Repository.ShiftRepository;
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
public class ShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private EmployeeService employeeService;

    private static final Logger loggerWarn = LoggerFactory.getLogger("loggerWarn");
    private static final Logger loggerTrace = LoggerFactory.getLogger("loggerTrace");
    private static final Logger loggerInfo = LoggerFactory.getLogger("loggerInfo");
    private static final Logger loggerError = LoggerFactory.getLogger("loggerError");
    private static final Logger loggerDebug = LoggerFactory.getLogger("loggerDebug");

    /*public Shift createShift(ShiftDTO shiftDTO) {
        // Ottenere l'utente autenticato dal contesto di sicurezza
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserName = null;

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                currentUserName = ((UserDetails) principal).getUsername();
            } else {
                currentUserName = principal.toString();
            }
        }

        // Recuperare l'employee dal nome utente
        Employee employee = employeeService.getEmployeeByEmail(currentUserName); // Assumendo che usi l'email come username

        if (employee == null) {
            throw new UsernameNotFoundException("Employee not found with email: " + currentUserName);
        }

        // Creare e salvare il turno
        Shift shift = new Shift();
        shift.setEmployee(employee);
        shift.setStartDate(shiftDTO.getStartDate());
        shift.setEndDate(shiftDTO.getEndDate());
        shiftRepository.save(shift);

        loggerInfo.info("Shift for employee " + shift.getEmployee().getEmail() + " on date " + shift.getStartDate() + " created.");
        return shift;
    }*/



    public Shift getShiftById(Long id) {
        return shiftRepository.findById(id)
                .orElseThrow(() -> new ShiftNotFoundException("Shift not found with id: " + id));
    }

    public List<Shift> getShiftsByEmployeeEmail(String employeeEmail) {
        List<Shift> shifts = shiftRepository.findByEmployeeEmail(employeeEmail);
        loggerInfo.info("Retrieved shifts for employee " + employeeEmail);
        return shifts;
    }

    public Page<Shift> getAllShifts(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Shift> shifts = shiftRepository.findAll(pageable);
        loggerInfo.info("Retrieved all shifts page " + page + " with size " + size + " sorted by " + sortBy);
        return shifts;
    }

    /*public Shift updateShift(Long id, ShiftDTO shiftDTO) throws ShiftNotFoundException, UnauthorizedException {
        // Ottenere l'utente autenticato dal contesto di sicurezza
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUserEmail = authentication.getName(); // Assume che il nome dell'utente sia l'email

        // Ottenere l'employee associato all'utente autenticato
        Employee authenticatedEmployee = employeeService.getEmployeeByEmail(authenticatedUserEmail); // Metodo modificato per ottenere direttamente l'Employee

        // Ottenere lo shift dal repository
        Shift shift = getShiftById(id);

        // Verificare se lo shift appartiene all'employee dell'utente autenticato
        if (!shift.getEmployee().equals(authenticatedEmployee)) {
            throw new UnauthorizedException("You are not authorized to update this shift.");
        }

        // Assegna l'employee all'oggetto ShiftDTO
        shift.setEmployee(authenticatedEmployee);

        // Aggiornare i dati dello shift con quelli forniti in shiftDTO
        shift.setStartDate(shiftDTO.getStartDate()); // Assuming start date can be updated
        shift.setEndDate(shiftDTO.getEndDate());
        shiftRepository.save(shift);
        loggerInfo.info("Shift with id " + id + " updated.");

        return shift;
    }*/




    public String deleteShift(Long id) throws ShiftNotFoundException {
        Shift shift = getShiftById(id);
        shiftRepository.delete(shift);
        loggerInfo.info("Shift with id " + id + " deleted successfully.");
        return "Shift with id " + id + " deleted successfully.";
    }
}
