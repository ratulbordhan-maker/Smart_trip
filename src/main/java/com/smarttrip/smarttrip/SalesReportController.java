package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "*")
public class SalesReportController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TravelPackageRepository packageRepository;

    @GetMapping("/sales")
    public Map<String, Object> getSalesReport() {
        List<Booking> bookings = bookingRepository.findAll();

        int confirmedBookings = 0;
        int cancelledBookings = 0;
        double netRevenue = 0;

        for (Booking booking : bookings) {
            if ("CONFIRMED".equals(booking.getStatus())) {
                confirmedBookings++;
                netRevenue += booking.getTotalAmount();
            }

            if ("CANCELLED".equals(booking.getStatus()) || "REJECTED".equals(booking.getStatus())) {
                cancelledBookings++;
            }
        }

        Map<String, Object> report = new HashMap<>();
        report.put("totalConfirmedBookings", confirmedBookings);
        report.put("totalCancelledBookings", cancelledBookings);
        report.put("netRevenue", netRevenue);
        report.put("totalBookings", bookings.size());

        return report;
    }

    @GetMapping("/package/{packageId}")
    public Map<String, Object> getPackageSalesReport(@PathVariable Long packageId) {
        List<Booking> bookings = bookingRepository.findByPackageId(packageId);

        int confirmedBookings = 0;
        int cancelledBookings = 0;
        double packageRevenue = 0;

        for (Booking booking : bookings) {
            if ("CONFIRMED".equals(booking.getStatus())) {
                confirmedBookings++;
                packageRevenue += booking.getTotalAmount();
            }

            if ("CANCELLED".equals(booking.getStatus()) || "REJECTED".equals(booking.getStatus())) {
                cancelledBookings++;
            }
        }

        Map<String, Object> report = new HashMap<>();
        report.put("packageId", packageId);
        report.put("confirmedBookings", confirmedBookings);
        report.put("cancelledBookings", cancelledBookings);
        report.put("revenue", packageRevenue);
        report.put("bookingCount", bookings.size());

        return report;
    }
}