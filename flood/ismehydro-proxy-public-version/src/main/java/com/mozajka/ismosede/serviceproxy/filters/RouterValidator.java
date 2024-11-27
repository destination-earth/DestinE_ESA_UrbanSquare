package com.mozajka.ismosede.serviceproxy.filters;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.function.Predicate;

@Component
public class RouterValidator {
    public static final List<String> openApiEndPoints = List.of(
        "/getAlerts",
        "/addAlerts",
        "/ismosede/query",
        "/ismehydro/query",
        "sendMail",
        "floodAPIURL",
        "demo"
    );
    
    public Predicate<ServerHttpRequest> isSecured =
        request -> openApiEndPoints
                .stream()
                .anyMatch(uri -> request.getURI().getPath().contains(uri));

}
