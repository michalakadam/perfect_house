package pl.perfecthouse.api.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JacksonXmlRootElement(localName = "Dane")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Dane {
    @JacksonXmlProperty(localName = "Oferty")
    private Oferty oferty;
}