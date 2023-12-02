package pl.perfecthouse.api.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class MapperConfig {

    @Bean
    public XmlMapper xmlMapper() {
        final XmlMapper xmlMapper = new XmlMapper();
        final SimpleModule module = new SimpleModule().addDeserializer(Double.class, new CustomDoubleDeserializer());
        final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        xmlMapper.enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        xmlMapper.registerModule(module);
        xmlMapper.registerModule(initializeJavaTimeModule());
        xmlMapper.setDateFormat(dateFormat);
        return xmlMapper;
    }

    public static class CustomDoubleDeserializer extends JsonDeserializer<Double> {
        @Override
        public Double deserialize(final JsonParser jsonParser, final DeserializationContext context) throws IOException {
            final String valueAsString = jsonParser.getValueAsString();

            if (null != valueAsString) {
                return Double.valueOf(valueAsString.replace(",", "."));
            }
            return null;
        }
    }

    private static JavaTimeModule initializeJavaTimeModule() {
        final JavaTimeModule javaTimeModule = new JavaTimeModule();
        final LocalDateTimeDeserializer localDateTimeDeserializer = new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        javaTimeModule.addDeserializer(LocalDateTime.class, localDateTimeDeserializer);
        return javaTimeModule;
    }
}
