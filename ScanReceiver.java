package QRScanner;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import ParkingTracking.InOut;

public class ScanReceiver {
    public static String scannedNumber;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // Handle scanning
        server.createContext("/scan", (HttpExchange exchange) -> {
            if ("POST".equals(exchange.getRequestMethod())) {
                InputStream requestBody = exchange.getRequestBody();
                byte[] requestBytes = requestBody.readAllBytes();
                String scannedData = new String(requestBytes);
                scannedNumber = scannedData;
                InOut obj = new InOut();
                System.out.println("Sent to tracking " + scannedNumber);
                obj.tracking(scannedNumber);
                exchange.sendResponseHeaders(200, 0);
                OutputStream os = exchange.getResponseBody();
                os.close();
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        });

        // Default response
        server.createContext("/", (HttpExchange exchange) -> {
            String response = "server is running!";
            exchange.sendResponseHeaders(200, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        });

        server.start();
        System.out.println("Ready to take entries.");
    }
}
