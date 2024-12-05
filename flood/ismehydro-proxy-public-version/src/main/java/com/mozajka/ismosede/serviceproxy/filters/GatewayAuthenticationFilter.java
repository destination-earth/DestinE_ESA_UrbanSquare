package com.mozajka.ismosede.serviceproxy.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;//reactive or import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

public class GatewayAuthenticationFilter implements GatewayFilter  {
    private Logger logger = LoggerFactory.getLogger(GatewayAuthenticationFilter.class);

    private final RouterValidator routerValidator;

    @Autowired
    private Environment env;

    public GatewayAuthenticationFilter(RouterValidator routerValidator){
        this.routerValidator = routerValidator;
    }

    /*@Value("${token-mozaika-destinyearth}")
    private String tokenMozaikaDestinyearth;*/

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        Route route = exchange.getAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR);

        if (!routerValidator.isSecured.test(request)) {
            logger.info("URI not allow !!");
            return this.onError(exchange, HttpStatus.FORBIDDEN);
        }

        if (route == null) {
            logger.info("Validation fails !!");//System.out.println("salo++ " + route.getId());
            return this.onError(exchange, HttpStatus.FORBIDDEN);
        }
        String routeId = route.getId().toLowerCase();

        String tokenMozaikaDestinyearth = env.getProperty("token-mozaika-destinyearth-" + routeId);

        if(tokenMozaikaDestinyearth == null){
            logger.info("Unable to retrieve the token to forward");
            return this.onError(exchange, HttpStatus.FORBIDDEN);
        }

        logger.info("Route ID : " + routeId +  " || Query forwarded with the good token ");

        ServerHttpRequest req = exchange.getRequest().mutate().header("Authorization", "Bearer " + tokenMozaikaDestinyearth).build();
        return chain.filter(exchange.mutate().request(req).build());
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }
}
