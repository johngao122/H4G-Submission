package h4g.emart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableScheduling
@EnableMongoRepositories(basePackages = "h4g.emart.repositories")
@ComponentScan(basePackages = "h4g.emart")
public class MainApplication {

	public static void main(String[] args) {
		SpringApplication.run(MainApplication.class, args);

		System.out.println("Logging environment variables:");
        System.out.println("MONGO_DATABASE: " + System.getenv("MONGO_DATABASE"));
        System.out.println("MONGO_USER: " + System.getenv("MONGO_USER"));
        System.out.println("MONGO_PASSWORD: " + System.getenv("MONGO_PASSWORD"));
        System.out.println("MONGO_CLUSTER: " + System.getenv("MONGO_CLUSTER"));
	}

}
