
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const HIGH_SEASON_START_MONTH = 4; // May
const HIGH_SEASON_END_MONTH = 10; // October
const WEEKEND_SURCHARGE_PERCENT = 0.05;
const HIGH_SEASON_MULTIPLIER = 1.15;
const LONG_RENTAL_DISCOUNT = 0.9;
const RACER_YOUNG_DRIVER_PENALTY = 1.5;
const INEXPERIENCED_DRIVER_MULTIPLIER = 1.3;
const ADDITIONAL_FEE_YOUNG_DRIVER = 15;

function calculateRentalPrice(pickup, dropoff, pickupDate, dropoffDate, carType, driverAge, licenseYear) {
    const carClass = getCarClass(carType);
    const rentalDays = calculateRentalDays(pickupDate, dropoffDate);
    const season = getSeason(pickupDate, dropoffDate);
    const weekendCount = countWeekendDays(pickupDate, dropoffDate);
    const experienceYears = new Date().getFullYear() - licenseYear;

    const validationError = validateDriver(driverAge, experienceYears, carClass);
    if (validationError) return validationError;

    let basePricePerDay = driverAge;
    let totalPrice = basePricePerDay * rentalDays;

    if (carClass === "Racer" && driverAge <= 25 && season === "High") {
        totalPrice *= RACER_YOUNG_DRIVER_PENALTY;
    }

    if (season === "High") {
        totalPrice *= HIGH_SEASON_MULTIPLIER;
    }

    if (rentalDays > 10 && season === "Low") {
        totalPrice *= LONG_RENTAL_DISCOUNT;
    }

    if (experienceYears < 2) {
        totalPrice *= INEXPERIENCED_DRIVER_MULTIPLIER;
    }

    if (experienceYears < 3 && season === "High") {
        totalPrice += ADDITIONAL_FEE_YOUNG_DRIVER * rentalDays;
    }

    if (weekendCount > 0) {
        totalPrice *= 1 + WEEKEND_SURCHARGE_PERCENT * (weekendCount / rentalDays);
    }

    return `$${totalPrice.toFixed(2)}`;
}

function validateDriver(age, experienceYears, carClass) {
    if (age < 18) return "Driver too young - cannot quote the price";
    if (experienceYears < 1) return "Driver must have held license for at least 1 year";
    if (age <= 21 && carClass !== "Compact") return "Drivers 21 y/o or less can only rent Compact vehicles";
    return null;
}

function getCarClass(type) {
    switch (type.toLowerCase()) {
        case "compact": return "Compact";
        case "electric": return "Electric";
        case "cabrio": return "Cabrio";
        case "racer": return "Racer";
        default: return "Unknown";
    }
}

function calculateRentalDays(pickupDate, dropoffDate) {
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    return Math.round(Math.abs((end - start) / MS_PER_DAY)) + 1;
}

function getSeason(pickupDate, dropoffDate) {
    const pickupMonth = new Date(pickupDate).getMonth();
    const dropoffMonth = new Date(dropoffDate).getMonth();
    if (
        (pickupMonth >= HIGH_SEASON_START_MONTH && pickupMonth <= HIGH_SEASON_END_MONTH) ||
        (dropoffMonth >= HIGH_SEASON_START_MONTH && dropoffMonth <= HIGH_SEASON_END_MONTH) ||
        (pickupMonth < HIGH_SEASON_START_MONTH && dropoffMonth > HIGH_SEASON_END_MONTH)
    ) {
        return "High";
    }
    return "Low";
}

function countWeekendDays(startDate, endDate) {
    let count = 0;
    let current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        const day = current.getDay();
        if (day === 0 || day === 6) count++;
        current.setDate(current.getDate() + 1);
    }

    return count;
}

exports.price = calculateRentalPrice;
