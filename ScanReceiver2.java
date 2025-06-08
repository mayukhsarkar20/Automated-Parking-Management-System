package QRScanner2;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import com.sun.net.httpserver.HttpServer;

import ParkingTracking.InOut;

import com.sun.net.httpserver.HttpExchange;

public class ScanReceiver2 {
    public static String scannedNumber;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(4050), 0); // Use port 4050

        server.createContext("/scan", (HttpExchange exchange) -> {
            if ("POST".equals(exchange.getRequestMethod())) {
                InputStream requestBody = exchange.getRequestBody();
                byte[] requestBytes = requestBody.readAllBytes();
                String scannedData = new String(requestBytes);
                scannedNumber = scannedData;
                InOut obj = new InOut();
                System.out.println("Sent to exit " + scannedNumber);
                obj.exit(scannedNumber);
                exchange.sendResponseHeaders(200, 0);
                OutputStream os = exchange.getResponseBody();
                os.close();
            } else {
                exchange.sendResponseHeaders(405, -1); // Method Not Allowed
            }
        });

        // Default response
        server.createContext("/", (HttpExchange exchange) -> {
            String response = "Exit scanner server is running!";
            exchange.sendResponseHeaders(200, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        });

        server.start();
        System.out.println("Exit scanner ready to take entries.");
    }
}
