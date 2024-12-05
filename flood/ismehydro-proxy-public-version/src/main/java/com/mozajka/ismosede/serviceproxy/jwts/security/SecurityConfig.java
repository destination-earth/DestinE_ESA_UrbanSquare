/*
 Copyright (c) 2024 Mozaika, Ltd.

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 Variations

 Except as contained in this notice, the name of Mozaika, Ltd. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Mozaika, Ltd.
*/

package com.mozajka.ismosede.serviceproxy.jwts.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import reactor.core.publisher.Mono;

import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.security.oauth2.server.resource.web.server.authentication.ServerBearerTokenAuthenticationConverter;


@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    String issuerUri;

    @Value("${spring.security.oauth2.resourceserver.jwt.jwt-set-uri}")
    String jwkSetUri;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
                ServerBearerTokenAuthenticationConverter bearerTokenConverter = new ServerBearerTokenAuthenticationConverter();
        bearerTokenConverter.setAllowUriQueryParameter(true);

        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.disable())
            .authorizeExchange(auth -> {
                auth.anyExchange().authenticated();
            })
            .oauth2ResourceServer(oauth2ResourceServer ->
                oauth2ResourceServer
                    .jwt(jwt ->
                            jwt.jwtDecoder(jwtDecoder())
                    )
            )

            .formLogin(ServerHttpSecurity.FormLoginSpec::disable) // Disable form login
            .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable) // Optionally disable basic authentication
            .exceptionHandling(exceptionHandling ->
                exceptionHandling
                    .authenticationEntryPoint(authenticationEntryPoint())
            )
            .build();


    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        return NimbusReactiveJwtDecoder.withIssuerLocation(issuerUri).build();
    }

    @Bean
    public ServerAuthenticationEntryPoint authenticationEntryPoint() {
        return (exchange, exception) -> {
            String errorMessage;
            if (exception instanceof InvalidBearerTokenException) {
                errorMessage = "Invalid token: " + exception.getMessage();

            } else {
                errorMessage = "Authentication failed: " + exception.getMessage();

                exchange.getResponse().setStatusCode(HttpStatus.FOUND);
            }

            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().writeWith(Mono.just(exchange.getResponse()
                    .bufferFactory()
                    .wrap(errorMessage.getBytes())));

        };
    }
}
