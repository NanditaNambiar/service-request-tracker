package Service_request_tracker.example.srt.exception;

import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;

/**
 * ✅ Standard success response model for all successful API operations.
 *    This ensures a consistent and clear structure for 200/201/204 responses.
 */
public class SuccessResponse<T> {

    // 🕒 Timestamp of the response
    private LocalDateTime timestamp;

    // 🔢 HTTP status code (e.g., 200, 201)
    private int status;

    // 🧾 Standard HTTP status phrase (e.g., "OK", "Created")
    private String message;

    // 📦 The actual data returned (generic type)
    private T data;

    /**
     * Constructs a standardized success response.
     *
     * @param status  HTTP status (e.g., HttpStatus.OK)
     * @param message Description message (e.g., "User created successfully")
     * @param data    Response data (can be null)
     */
    public SuccessResponse(HttpStatus status, String message, T data) {
        this.timestamp = LocalDateTime.now();
        this.status = status.value();
        this.message = message;
        this.data = data;
    }

    // 📦 Getters
    public LocalDateTime getTimestamp() { return timestamp; }
    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public T getData() { return data; }
}
