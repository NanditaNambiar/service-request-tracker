package Service_request_tracker.example.srt.exception;

import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;

public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private String path;
    private LocalDateTime timestamp;

    public ErrorResponse(HttpStatus status, String message, String path) {
        this.status = status.value();
        this.error = status.getReasonPhrase();
        this.message = message;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters



    // getters and setters
    public LocalDateTime getTimestamp() { return timestamp; }
    public int getStatus() { return status; }
    public String getError() { return error; }
    public String getMessage() { return message; }
    public String getPath() { return path; }
}

