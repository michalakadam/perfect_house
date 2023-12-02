package pl.perfecthouse.api.service.dto;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Foto {
    @JacksonXmlProperty(isAttribute = true, localName = "ID")
    private Long id;

    @JacksonXmlProperty(localName = "plik")
    private String plik;

    @JacksonXmlProperty(localName = "opis")
    private String opis;

    @JacksonXmlProperty(localName = "lp")
    private Integer liczbaPorzadkowa;

    @JacksonXmlProperty(localName = "typ")
    private String typ;
}