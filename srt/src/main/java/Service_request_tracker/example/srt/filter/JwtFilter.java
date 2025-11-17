package Service_request_tracker.example.srt.filter;

import Service_request_tracker.example.srt.util.JwtUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // Skip public endpoints
        if (path.startsWith("/auth/login") ||
            path.startsWith("/v3/api-docs") ||
            path.startsWith("/swagger-ui")) {
            chain.doFilter(request, response);
            return;
        }

        final String header = request.getHeader("Authorization");
        String username = null;
        String token = null;

        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            username = jwtUtil.extractUsername(token);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token)) {
                String role = jwtUtil.extractRole(token);

                // Safety: ensure "ROLE_" prefix
                if (!role.startsWith("ROLE_")) {
                    role = "ROLE_" + role;
                }

                GrantedAuthority authority = new SimpleGrantedAuthority(role);

                User userDetails = new User(username, "", Collections.singleton(authority));

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                SecurityContextHolder.getContext().setAuthentication(auth);

                System.out.println("Authenticated user: " + username + " with role: " + role);
            }
        }

        chain.doFilter(request, response);
    }
}
