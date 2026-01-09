package com.jayjayrj.controlefinanceiro;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class ControleFinanceiroApplication {

    public static void main(String[] args) {
        SpringApplication.run(ControleFinanceiroApplication.class, args);
    }

    @Bean
    CommandLineRunner testMongo(MongoTemplate mongoTemplate) {
        return args -> {
            System.out.println("Banco conectado: " + mongoTemplate.getDb().getName());
        };
    }

}
