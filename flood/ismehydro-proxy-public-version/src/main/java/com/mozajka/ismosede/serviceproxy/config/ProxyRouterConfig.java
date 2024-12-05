/*
 Copyright (c) 2024 Mozaika, Ltd.

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 Variations

 Except as contained in this notice, the name of Mozaika, Ltd. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Mozaika, Ltd.
*/

package com.mozajka.ismosede.serviceproxy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.mozajka.ismosede.serviceproxy.filters.GatewayAuthenticationFilter;
import com.mozajka.ismosede.serviceproxy.filters.RouterValidator;

@Configuration
public class ProxyRouterConfig {

        private final RouterValidator routerValidator;
        public ProxyRouterConfig(RouterValidator routerValidator) {
                this.routerValidator = routerValidator;
        }

        @Bean
        public GatewayAuthenticationFilter gatewayAuthenticationFilter() {
                return new GatewayAuthenticationFilter(routerValidator);
        }

        @Value("${flood.simulation.url.param}")
        private String floodSimulationURLParameter;

        @Value("${mailsender.api.param}")
        private String mailSenderAPI;

        @Value("${alert.api.url.param}")
        private String alertAPI;

        @Value("${ismosede.api.url.param}")
        private String ismosedeAPI;

        @Value("${ismehydro.api.url.param}")
        private String ismehydroAPI;

        @Bean
        public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
                return builder.routes()
                                .route("alerts-get", r -> r.path("/getAlerts")
                                        .filters(f -> f.filter(gatewayAuthenticationFilter()))
                                        .uri(alertAPI + "/data/alert/intelligent/get"))

                                .route("alerts-add", r -> r.path("/addAlerts")
                                        .filters(f -> f.filter(gatewayAuthenticationFilter()))
                                        .uri(alertAPI + "/data/alert/intelligent/insert"))

                                .route("ismosede-get", r -> r.path("/ismosede/query")
                                        .filters(f -> f.filter(gatewayAuthenticationFilter()))
                                        .uri(ismosedeAPI + "/data/all/query"))

                                .route("ismehydro-get", r -> r.path("/ismehydro/query")
                                        .filters(f -> f.filter(gatewayAuthenticationFilter()))
                                        .uri(ismehydroAPI + "/data/all/query"))

                                .route("send-mail", r -> r.path("/sendMail")
                                        .filters(f -> f.filter(gatewayAuthenticationFilter()))
                                        .uri(mailSenderAPI + "/ismosede-gui/sendMail"))

                                .route("flood-api-url", r -> r.path("/floodAPIURL")
                                        .filters(f -> f.filter(gatewayAuthenticationFilter()))
                                        .uri(floodSimulationURLParameter + "/floodAPIURL"))

                                .route("demo", r -> r.path("/demo")
                                        .filters(f -> f.filter(gatewayAuthenticationFilter()))
                                        .uri(floodSimulationURLParameter + "/demo"))

                        .build();
        }

}
