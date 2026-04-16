package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/packages")
public class TravelPackageController {

    @Autowired
    private TravelPackageRepository repository;

    @PostMapping
    public TravelPackage createPackage(@RequestBody TravelPackage pkg) {
        return repository.save(pkg);
    }

    @GetMapping
    public List<TravelPackage> getAllPackages() {
        return repository.findAll();
    }
}