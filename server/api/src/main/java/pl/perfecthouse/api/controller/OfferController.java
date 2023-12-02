package pl.perfecthouse.api.controller;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import pl.perfecthouse.api.service.dto.Dane;
import pl.perfecthouse.api.service.dto.Oferty;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OfferController {

    private final XmlMapper xmlMapper;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String uploadXml(@RequestParam("file") final MultipartFile file) {
        try {
            final Dane dane = xmlMapper.readValue(file.getInputStream(), Dane.class);
            final Oferty oferty = dane.getOferty();
            return "Successfully processed XML";
        } catch (final Exception e) {
            return "Failed to process XML: " + e.getMessage();
        }
    }
}
