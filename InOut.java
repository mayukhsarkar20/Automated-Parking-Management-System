package ParkingTracking;

import java.io.*;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalTime;
import java.time.Duration;

public class InOut {
    private static final String file = "userData.txt";
    private static final Map<String, LocalTime> userData = new HashMap<>();

    public void tracking(String userNumber) {
        loadDataFromFile();
        System.out.println("Reveved at tracking " + userNumber);
        if (!userData.containsKey(userNumber)) {
            userData.put(userNumber, LocalTime.now());
            saveDataToFile();
            System.out.println("Data saved.");
        } else {
            System.out.println("Multiple check-in not allowed.");
        }
    }

    public void exit(String userNumber) {
        loadDataFromFile();
        System.out.println("Reveved at exit " + userNumber);
        if (userData.containsKey(userNumber)) {
            LocalTime inTime = userData.get(userNumber);
            LocalTime currentTime = LocalTime.now();
            Duration totalTime = Duration.between(inTime, currentTime);
            int timeInMin = totalTime.toMinutesPart();
            int timeInHrs = totalTime.toHoursPart();
            char vt = userNumber.charAt(0);
            int intVT = Character.getNumericValue(vt);
            int costPer30Min;
            if (intVT == 2) {
                costPer30Min = 10;
            } else {
                costPer30Min = 5;
            }
            int cost = (int) Math.ceil(timeInMin / 30.0) * costPer30Min;
            System.out.println("Your total time is " + timeInHrs + " Hours " + timeInMin + " Minutes.");
            System.out.println("Total cost is " + cost + " Rs");
            userData.remove(userNumber);
            saveDataToFile();
        } else {
            System.out.println("Invalid QR");
        }

    }

    private void saveDataToFile() {
        try (PrintWriter writer = new PrintWriter(new FileWriter(file))) {
            for (String userId : userData.keySet()) {
                writer.println(userId + "," + userData.get(userId));
            }
        } catch (IOException e) {
            System.out.println("Error saving data: " + e.getMessage());
        }
    }

    private void loadDataFromFile() {
        userData.clear();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                userData.put(parts[0], LocalTime.parse(parts[1]));
            }
        } catch (FileNotFoundException e) {
            System.out.println("Welcome.");
        } catch (IOException e) {
            System.out.println("Error loading data: " + e.getMessage());
        }
    }

}
