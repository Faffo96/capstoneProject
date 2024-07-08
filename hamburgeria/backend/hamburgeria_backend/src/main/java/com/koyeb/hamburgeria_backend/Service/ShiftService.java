package com.koyeb.hamburgeria_backend.Service;

import com.koyeb.hamburgeria_backend.Dto.ShiftDTO;
import com.koyeb.hamburgeria_backend.Entity.Shift;
import com.koyeb.hamburgeria_backend.Entity.User.Employee;
import com.koyeb.hamburgeria_backend.Exception.ShiftNotFoundException;
import com.koyeb.hamburgeria_backend.Exception.UnauthorizedException;
import com.koyeb.hamburgeria_backend.Exception.UserNotFoundException;
import com.koyeb.hamburgeria_backend.Repository.ShiftRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    public Shift createShift(ShiftDTO shiftDTO) throws UserNotFoundException {
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
        Employee employee = employeeService.getEmployeeByEmail(shiftDTO.getEmployee().getEmail()); // Assumendo che usi l'email come username

        if (employee == null) {
            throw new UsernameNotFoundException("Employee not found with email: " + currentUserName);
        }

        Shift shift = new Shift();
        shift.setEmployee(employee);
        shift.setStartDate(shiftDTO.getStartDate());
        shift.setEndDate(shiftDTO.getEndDate());
        shiftRepository.save(shift);

        loggerInfo.info("Shift for employee " + shift.getEmployee().getEmail() + " on date " + shift.getStartDate() + " created.");
        return shift;
    }


    public Shift getShiftById(Long id) throws ShiftNotFoundException {
        return shiftRepository.findById(id)
                .orElseThrow(() -> new ShiftNotFoundException("Shift not found with id: " + id));
    }

    public List<Shift> getShiftsByEmployeeEmail(String employeeEmail) {
        List<Shift> shifts = shiftRepository.findByEmployeeEmail(employeeEmail);
        loggerInfo.info("Retrieved shifts for employee " + employeeEmail);
        return shifts;
    }

    public Page<Shift> getAllShifts(int page, String sortBy) {
        int fixedSize = 15;
        Pageable pageable = PageRequest.of(page, fixedSize, Sort.by(sortBy));
        Page<Shift> shifts = shiftRepository.findAll(pageable);
        loggerInfo.info("Retrieved shifts page " + page + " with fixed size " + fixedSize + " sorted by " + sortBy);
        return shifts;
    }

    public List<Shift> getAllShiftsUnpaged() {
        return shiftRepository.findAll();
    }

    public Shift updateShift(Long id, ShiftDTO shiftDTO) throws ShiftNotFoundException, UnauthorizedException {
        Shift shift = getShiftById(id);
        Employee employee = shift.getEmployee();

        shift.setEmployee(employee);
        shift.setStartDate(shiftDTO.getStartDate());
        shift.setEndDate(shiftDTO.getEndDate());
        shift.setStartDate(shiftDTO.getStartDate());
        shift.setEndDate(shiftDTO.getEndDate());
        shiftRepository.save(shift);
        loggerInfo.info("Shift with id " + id + " updated.");

        return shift;
    }

    public String deleteShift(Long id) throws ShiftNotFoundException {
        Shift shift = getShiftById(id);
        shiftRepository.delete(shift);
        loggerInfo.info("Shift with id " + id + " deleted successfully.");
        return "Shift with id " + id + " deleted successfully.";
    }
}
