package pl.perfecthouse.api.service.dto;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class Oferta {
    @JacksonXmlProperty(isAttribute = true, localName = "ID")
    private Long id;

    @JacksonXmlProperty(isAttribute = true, localName = "Przedmiot")
    private String przedmiot;

    @JacksonXmlProperty(isAttribute = true, localName = "Wynajem")
    private Boolean wynajem;

    @JacksonXmlProperty(isAttribute = true, localName = "Nr")
    private Long nr;

    @JacksonXmlProperty(isAttribute = true, localName = "Symbol")
    private String symbol;

    @JacksonXmlProperty(isAttribute = true, localName = "KluczAPP")
    private Long kluczApp;

    @JacksonXmlProperty(isAttribute = true, localName = "UniqueID")
    private Long uniqueId;

    @JacksonXmlProperty(isAttribute = true, localName = "Status")
    private String status;

    @JacksonXmlProperty(isAttribute = true, localName = "DataWprowadzenia")
    private LocalDateTime dataWprowadzenia;

    @JacksonXmlProperty(isAttribute = true, localName = "DataWaznosci")
    private LocalDateTime dataWaznosci;

    @JacksonXmlProperty(isAttribute = true, localName = "Pierwotny")
    private Boolean pierwotny;

    @JacksonXmlProperty(isAttribute = true, localName = "Wojewodztwo")
    private String wojewodztwo;

    @JacksonXmlProperty(isAttribute = true, localName = "Powiat")
    private String powiat;

    @JacksonXmlProperty(isAttribute = true, localName = "Lokalizacja")
    private String lokalizacja;

    @JacksonXmlProperty(isAttribute = true, localName = "LokalizacjaJakoGmina")
    private Boolean lokalizacjaJakoGmina;

    @JacksonXmlProperty(isAttribute = true, localName = "Dzielnica")
    private String dzielnica;

    @JacksonXmlProperty(isAttribute = true, localName = "Ulica")
    private String ulica;

    @JacksonXmlProperty(isAttribute = true, localName = "Cena")
    private Double cena;

    @JacksonXmlProperty(isAttribute = true, localName = "CenaM2")
    private Double cenaZaMetrKwadratowy;

    @JacksonXmlProperty(isAttribute = true, localName = "IloscPokoi")
    private Integer iloscPokoi;

    @JacksonXmlProperty(isAttribute = true, localName = "PowierzchniaCalkowita")
    private Double powierzchniaCalkowita;

    @JacksonXmlProperty(isAttribute = true, localName = "MapSzerokoscGeogr")
    private Double mapSzerokoscGeogr;

    @JacksonXmlProperty(isAttribute = true, localName = "MapDlugoscGeogr")
    private Double mapDlugoscGeogr;

    @JacksonXmlProperty(isAttribute = true, localName = "StanPrawnyGruntu")
    private String stanPrawnyGruntu;

    @JacksonXmlProperty(isAttribute = true, localName = "Agent")
    private Long agent;

    @JacksonXmlProperty(localName = "DodatkowyOpis")
    private String dodatkowyOpis;

    @JacksonXmlProperty(localName = "UwagiOpis")
    private String uwagiOpis;

    @JacksonXmlProperty(localName = "WysokoscPomieszczen")
    private String wysokoscPomieszczen;

    @JacksonXmlProperty(localName = "Zdjecia")
    private List<Foto> zdjecia;

    @JacksonXmlProperty(localName = "Opiekunowie")
    private String opiekunowie; 

    @JacksonXmlProperty(localName = "Pomieszczenia")
    private String pomieszczenia;

    @JacksonXmlProperty(localName = "PolaDynamiczne")
    private String polaDynamiczne;

    @JacksonXmlProperty(localName = "Dostawca")
    private String dostawca;
    
    @JacksonXmlProperty(localName = "DataModyfikacjiListing")
    private LocalDateTime dataModyfikacjiListing;

    @JacksonXmlProperty(localName = "DataEdycji")
    private LocalDateTime dataEdycji;

    @JacksonXmlProperty(localName = "ZabudowaDzialki")
    private String zabudowaDzialki;

    @JacksonXmlProperty(localName = "MPZP")
    private Boolean mpzp;

    @JacksonXmlProperty(localName = "MPZPInformacja")
    private String mpzpInformacja;

    @JacksonXmlProperty(localName = "PodstawaNabycia")
    private String podstawaNabycia;

    @JacksonXmlProperty(localName = "Otoczenie")
    private String otoczenie;

    @JacksonXmlProperty(localName = "Dojazd")
    private String dojazd;

    @JacksonXmlProperty(localName = "Polozenie")
    private String polozenie;

    @JacksonXmlProperty(localName = "Obreb")
    private String obreb;

    @JacksonXmlProperty(localName = "WymiaryDzialki")
    private String wymiaryDzialki;

    @JacksonXmlProperty(localName = "UksztaltowanieDzialki")
    private String uksztaltowanieDzialki;

    @JacksonXmlProperty(localName = "KsztaltDzialki")
    private String ksztaltDzialki;

    @JacksonXmlProperty(localName = "Komunikacja")
    private List<String> komunikacja;

    @JacksonXmlProperty(localName = "KodPocztowy")
    private String kodPocztowy;

    @JacksonXmlProperty(localName = "EkspozytorLokalizacja")
    private String ekspozytorLokalizacja;

    @JacksonXmlProperty(localName = "EkspozytorDzielnica")
    private String ekspozytorDzielnica;

    @JacksonXmlProperty(localName = "EkspozytorUlica")
    private String ekspozytorUlica;

    @JacksonXmlProperty(localName = "SzerokoscFrontuDzialki")
    private Double szerokoscFrontuDzialki;

    @JacksonXmlProperty(localName = "WarunkiZabudowy")
    private String warunkiZabudowy;

    @JacksonXmlProperty(localName = "DataNabycia")
    private LocalDateTime dataNabycia;

    @JacksonXmlProperty(localName = "Kraj")
    private String kraj;

    @JacksonXmlProperty(localName = "PrzeznaczenieDzialkiSet")
    private List<String> przeznaczenieDzialki;

    @JacksonXmlProperty(localName = "Gaz")
    private String gaz;

    @JacksonXmlProperty(localName = "Prad")
    private String prad;

    @JacksonXmlProperty(localName = "Kanalizacja")
    private String kanalizacja;

    @JacksonXmlProperty(localName = "Woda")
    private String woda;

    @JacksonXmlProperty(localName = "CzyOfertaKompletnaPA")
    private Boolean czyOfertaKompletnaPA;

    @JacksonXmlProperty(localName = "TytulOferty")
    private String tytulOferty;

    // Somehow this field is not deserialized properly even by custom Double deserializer...
    public void setSzerokoscFrontuDzialki(final String value) {
        szerokoscFrontuDzialki = Double.valueOf(value.replace(",", "."));
    }
}
