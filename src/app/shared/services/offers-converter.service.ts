import { Injectable } from '@angular/core';

import { Offer, OfferField, Room } from '../models';

const DESCRIPTION_TO_BE_REPLACED = "Oferta wysłana z systemu Galactica Virgo";

@Injectable({
    providedIn: 'root',
})
export class OffersConverter {

    convertToReadableOffers(rawOffers: any[]): Offer[] {
        return rawOffers.map(offer => {
            return {
                id: this.convertToNumber(offer.ID),
                estateType: this.computeEstateType(offer.Przedmiot || ''),
                estateSubtypes: this.computeEstateSubtypes(offer),
                agentId: this.convertToNumber(offer.Agent),
                title: offer.TytulOferty || '',
                description: (offer.UwagiOpis || '').replace(DESCRIPTION_TO_BE_REPLACED, ''),
                additionalDescription: offer.DodatkowyOpis || '',
                additionalRemarks: offer.UwagiOpis || '',
                releaseDate: offer.TerminWydaniaData?.text || '',
                // TerminWydaniaLista is always a single element object.
                releaseDateTitle: offer.TerminWydaniaLista?.text || '',
                number: this.convertToNumber(offer.Nr),
                symbol: offer.Symbol || '',
                status: offer.Status || '',
                legalStatus: this.convertToField('Stan prawny', offer.StanPrawny || ''),
                standard: this.convertToField('Standard', this.convertToNumber(offer.Standard?.text)),
                isAlarmSet: this.convertToField('Alarm', this.convertToBoolean(offer.Alarm?.text)),
                isExclusive: this.convertToBoolean(offer.Wylacznosc),
                isForRent: this.convertToBoolean(offer.Wynajem),
                photos: this.convertPhotos(this.convertToArray(offer.Zdjecia.Foto)),
                isNoCommission: this.convertToBoolean(offer.ZeroProwizji),
                isAvailableOnFacebook: this.convertToBoolean(offer.PublikacjaFacebook?.text),
                parentOfferId: this.convertToNumber(offer.OfertaBazowa?.text),
                creationDate: offer.DataWprowadzenia || '',
                updateDate: offer.DataEdycji?.text || '',
                expirationDate: offer.DataWaznosci || '',
                virtualVisitUrl: offer.WirtualnaWizyta?.Url || '',
                
                price: this.convertToNumber(offer.Cena),
                pricePerSquareMeter:this.convertToField(
                    'Cena za m²', this.convertToNumber(offer.CenaM2), 'zł'),
                pricePerUsableSquareMeter: this.convertToField(
                    'Cena za m² pow. użytkowej', this.convertToNumber(offer.CenaM2PowUzytk?.text), 'zł'),
                rentPrice: this.convertToField(
                    'Czynsz najmu', this.convertToNumber(offer.CzynszLetni?.text), 'zł'),
                grossRentPricePerSquareMeter: this.convertToField(
                    'Czynsz najmu brutto za m²', this.convertToNumber(offer.CzynszNajmuBrutto_m2?.text), 'zł'),
                netRentPricePerSquareMeter: this.convertToField(
                    'Czynsz najmu netto za m²', this.convertToNumber(offer.CzynszNajmuNetto_m2?.text), 'zł'),
                deposit: this.convertToField('Kaucja', this.convertToNumber(offer.Kaucja?.text), 'zł'),
                depositType: this.convertToField('Typ kaucji', offer.TypKaucji?.text || ''),
                additionalFees: this.convertToArray(
                    offer.DodatkoweOplatyWCzynszu?.lista ||
                    offer.DodatkoweOplatyWgLicznikow?.lista),
                garagePrice: this.convertToField('Cena garażu', this.convertToNumber(offer.CenaGarazu?.text), 'zł'),
                
                country: offer.Kraj?.text || '',
                voivodeship: offer.Wojewodztwo || '',
                county: this.computeCounty(offer.Powiat || ''),
                city: this.computeCity(offer.Lokalizacja || ''),
                district: offer.Dzielnica || offer.Rejon || '',
                fullLocation: this.computeFullLocation(
                    this.computeCity(offer.Lokalizacja || ''), offer.Dzielnica || offer.Rejon || ''),
                postalCode: offer.KodPocztowy?.text || '',
                street: offer.Ulica || '',
                location: offer.Polozenie?.text || '',
                mapLatitude: offer.MapSzerokoscGeogr || '',
                mapLongtitude: offer.MapDlugoscGeogr || '',
                publicTransport: this.convertToArray(offer.Komunikacja?.lista),
                // Sasiedztwo?.lista is always a single element object.
                neighbourhood: this.convertToField(
                    'Sąsiedztwo', offer.Otoczenie?.text || offer.Sasiedztwo?.lista || ''),
                accessRoad: this.convertToField('Dojazd', offer.Dojazd?.text || ''),

                totalArea: this.convertToField(
                    'Powierzchnia', this.convertToNumber(offer.PowierzchniaCalkowita), 'm²'),
                landArea: this.convertToField(
                    'Powierzchnia działki', this.convertToNumber(offer.PowierzchniaDzialki?.text), 'm²'),
                usableArea: this.convertToField(
                    'Powierzchnia użytkowa', this.convertToNumber(offer.PowierzchniaUzytkowa?.text), 'm²'),
                terraceArea: this.convertToField(
                    'Powierzchnia balkonu', this.convertToNumber(offer.PowierzchniaTarasBalkon?.text), 'm²'),
                officeArea: this.convertToField('Powierzchnia biurowa', this.convertToNumber(
                    offer.PowierzchniaBiurowa?.text ||
                    offer.PowierzchniaPomieszczenBiurowychDo?.text), 'm²'),
                officeBuildingArea: this.convertToField(
                    'Powierzchnia biurowca', this.convertToNumber(offer.PowierzchniaBiurowca?.text), 'm²'),
                floorArea: this.convertToField(
                    'Powierzchnia kondygnacji', this.convertToNumber(offer.PowierzchniaKondygnacji?.text), 'm²'),

                rooms: this.convertRooms(this.convertToArray(offer.Pomieszczenia?.Pomieszczenie)),
                numberOfRooms: this.convertToField('Liczba pokoi', this.convertToNumber(offer.IloscPokoi)),
                roomsHeight: this.convertToField(
                    'Wysokość pomieszczeń', this.convertToNumber(offer.WysokoscPomieszczen), 'm'),
                floor: this.convertToField('Piętro', this.convertFloor(offer.Pietro || '')),
                numberOfFloors: this.convertToField('Liczba pięter', this.convertToNumber(
                    offer.IloscKondygnacji ||
                    offer.IloscPieter?.text || '')),
                floorHeight: this.convertToField(
                    'Wysokość kondygnacji', this.convertToNumber(offer.WysokoscKondygnacji?.text), 'm'),
                isBasementAvailable: this.convertToField('Piwnica', this.convertToBoolean(offer.Piwnica)),
                numberOfBedrooms: this.convertToField(
                    'Liczba sypialni', this.convertToNumber(offer.IloscSypialni?.text)),
                numberOfTerraces: this.convertToField(
                    'Liczba balkonów', this.convertToNumber(offer.IloscBalkonow?.text)),
                noiseLevel: this.convertToField('Głośność', offer.Glosnosc?.text || ''),
                isTerraceAvailable: this.convertToField(
                    'Balkon', this.convertToBoolean(offer.Balkon?.text)),
                buildingType: this.convertToField(
                    'Rodzaj obiektu', offer.RodzajBudynku || offer.RodzajObiektu?.text || ''),
                officeBuildingCategory: this.convertToField(
                    'Rodzaj biurowca', offer.KategoriaBiurowca?.text || ''),
                flatType: this.convertToField('Rodzaj mieszkania', offer.RodzajMieszkania?.text || ''),
                gasConnectionDetails: this.convertToField('Gaz', offer.Gaz?.text || ''),
                sewageConnectionDetails: this.convertToField('Kanalizacja', offer.Kanalizacja?.text || ''),
                waterConnectionDetails: this.convertToField('Woda', offer.Woda?.text || ''),
                electricityConnectionDetails: this.convertToField('Prąd', offer.Prad?.text || ''),
                garage: this.convertToField('Garaż', offer.Garaz?.text || offer.GarazMieszkanie?.text || ''),
                isParkingAvailable: this.convertToField('Parking', this.convertToBoolean(
                    offer.WlasnyParking ||
                    offer.MozliwoscParkowania?.text)),
                isElevatorAvailable: this.convertToField('Winda', this.convertToBoolean(offer.WindaJest?.text)),
                isFenceAvailable: this.convertToField('Ogrodzenie', this.convertToBoolean(offer.Ogrodzenie)),
                isMarketPrimary: this.convertToBoolean(offer.Pierwotny),
                acquisitionType: this.convertToField('Podstawa nabycia', offer.PodstawaNabycia?.text || ''),
                burden: this.convertToField('Obciążenia', offer.Obciazenia?.text || ''),
                // UsytuowanieLista is always a single element object.
                flatSetUp: this.convertToField('Usytuowanie', offer.UsytuowanieLista?.text || ''),
                yearBuilt: this.convertToField('Rok budowy', this.convertToNumber(offer.RokBudowy?.text)),
                constructionTechnology: this.convertToField('Technologia budowlana', offer.TechnologiaBudowlana || ''),
                // Okna is always a single element object.
                windowsType: this.convertToField('Okna', offer.Okna?.text || ''),
                heatingType: this.convertToField('Ogrzewanie', offer.Ogrzewanie?.text || ''),
                isAccessible: this.convertToField(
                    'Udogodnienia dla niepełnosprawnych', this.convertToBoolean(offer.Niepelnosprawni?.text)),
                buildingName: this.convertToField('Nazwa obiektu', offer.NazwaObiektu || ''),
                minimumRentingPeriodInMonths: this.convertToField(
                    'Minimalny okres najmu', this.convertToNumber(offer.MinOkresNajmu?.text)),
                isReceptionAvailable: this.convertToField(
                    'Recepcja', this.convertToBoolean(offer.Recepcja?.text)),
                isComputerNetworkAvailable: this.convertToField(
                    'Sieć komputerowa', this.convertToBoolean(offer.SiecKomputerowa?.text)),
                securityType: this.convertToField('Dozór budynku', offer.DozorBudynkuLista?.text || ''),
                entrance: this.convertToField('Wejście', offer.Wejscie?.text || ''),

                isFloorDustFree: this.convertToField(
                    'Posadzka niepyląca', this.convertToBoolean(offer.PosadzkaNiepylaca?.text)),
                isLoadingRampAvailable: this.convertToField(
                    'Rampa rozładunkowa', this.convertToBoolean(offer.RampaRozladunkowa?.text)),
                warehouseArea: this.convertToField(
                    'Powierzchnia pomieszczeń magazynowych', this.convertToNumber(offer.PowierzchniaPomieszczenMagazynowych?.text), 'm²'),
                warehouseYardArea: this.convertToField(
                    'Powierzchnia placu utwardzanego', this.convertToNumber(offer.PowierzchniaPlacuUtwardzonego?.text), 'm²'),
                isYardHardened: this.convertToField(
                    'Plac utwardzany', this.convertToBoolean(offer.PlacUtwardzany?.text)),
                isManeuveringAreaAvailable: this.convertToField(
                    'Plac manewrowy', this.convertToBoolean(offer.PlacManewrowy?.text)),
                isTruckParkingAvailable: this.convertToField(
                    'Parking dla TIR-ów', this.convertToBoolean(offer.ParkowanieTir?.text)),
                isGantryAvailable: this.convertToField(
                    'Suwnica', this.convertToBoolean(offer.Suwnica?.text)),
                isGoodsLiftAvailable: this.convertToField(
                    'Winda towarowa', this.convertToBoolean(offer.WindaTowarowa?.text)),

                // StanLokaluLista is always a single element object.
                premiseState: this.convertToField('Stan lokalu', offer.StanLokaluLista?.text || ''),
                premiseType: this.convertToField('Rodzaj lokalu', offer.RodzajLokalu?.text || ''),
                premiseBackRoomArea: this.convertToField(
                    'Powierzchnia zaplecza', this.convertToNumber(offer.PowierzchniaZaplecza?.text), 'm²'),
                premiseSalesRoomArea: this.convertToField(
                    'Powierzchnia hali sprzedażowej', this.convertToNumber(offer.PowierzchniaHaliSprzedazy?.text), 'm²'),

                mpzp: this.convertToField('MPZP', offer.MPZP?.text || ''),
                mpzpInfo: this.convertToField('Informacja o MPZP', offer.MPZPInformacja?.text || ''),
                landLotUse: this.convertToField('Zagospodarowanie', offer.ZagospodarowanieDzialki?.text || ''),
                landLotDetailedSize: this.convertToField('Wymiary', offer.WymiaryDzialki?.text || ''),
                landLotConstructionConditions: this.convertToField('Warunki zabudowy', offer.WarunkiZabudowy?.text || ''),
                landLotForm: this.convertToField('Ukształtowanie terenu', offer.UksztaltowanieDzialki?.text || ''),
                landLotFrontLineWidth: this.convertToField(
                    'Szerokość frontu działki', this.convertToNumber(offer.SzerokoscFrontuDzialki?.text), 'm'),
                landLotShape: this.convertToField('Kształt działki', offer.KsztaltDzialki?.text || ''),
                landLotLegalStatus: this.convertToField('Stan prawny gruntu', offer.StanPrawnyGruntu || ''),
                landLotFenceType: this.convertToField('Ogrodzenie', offer.OgrodzenieDzialki?.text || ''),
                landLotBuildings: this.convertToField('Zabudowa', offer.ZabudowaDzialki?.text || ''),
            };
        });
    }

    private convertToField<T>(displayName: string, value: T, unit?: string): OfferField<T> {
        return {displayName, value, unit};
    }

    private convertToArray(unsafeList: any): string[] {
        if (Array.isArray(unsafeList)) {
            return unsafeList;
        }
        // Single element array comes as an object.
        return unsafeList ? [unsafeList] : [];
    }

    private convertToBoolean(booleanAsString: any): boolean {
        if (!booleanAsString) {
            return false;
        }
        if (typeof booleanAsString === 'object') {
            booleanAsString = booleanAsString.text;
        }
        const possibleTrueValues = /^(True|jest|Jest|tak|Tak|1|mały|średni|duży|loggia)$/;

        return !!booleanAsString.match(possibleTrueValues);
    }

    private convertToNumber(numberAsString: string|undefined): number {
        if (numberAsString) {
            numberAsString = numberAsString.replace(',', '.');
        }
        return Number.isNaN(Number(numberAsString)) ? -1 : Number(numberAsString);
    }

    private computeEstateSubtypes(offer: any): string[] {
        if (!offer.Przedmiot) {
            return [];
        }
        if (offer.Przedmiot === 'Dom' && offer.RodzajDomu?.text) {
            return [offer.RodzajDomu.text];
        }   
        if (offer.Przedmiot === 'Mieszkanie' && offer.RodzajMieszkania?.text) {
            return [offer.RodzajMieszkania.text];
        }
        if (offer.Przedmiot === 'Dzialka' && offer.PrzeznaczenieDzialkiSet?.lista) {
            return Array.isArray(offer.PrzeznaczenieDzialkiSet.lista) ? 
                [...offer.PrzeznaczenieDzialkiSet.lista] : [offer.PrzeznaczenieDzialkiSet.lista];
        }
        if (offer.Przedmiot === 'Lokal' && offer.PrzeznaczenieLokalu?.lista) {
            return Array.isArray(offer.PrzeznaczenieLokalu.lista) ? 
                [...offer.PrzeznaczenieLokalu.lista] : [offer.PrzeznaczenieLokalu.lista];
        }
        if (offer.Przedmiot === 'Biurowiec' && offer.RodzajObiektu?.text) {
            return [offer.RodzajObiektu.text];
        }
        return [];
    }

    private convertPhotos(rawPhotos: any[]): string[] {
        return rawPhotos.map(rawPhoto => 'ofe_' + rawPhoto.ID + '.jpg');
    }

    private convertRooms(rawRooms: any[]): Room[] {
        return rawRooms.map(rawRoom => {
            return {
                index: rawRoom.Lp,
                quantity: rawRoom.Ilosc,
                area: rawRoom.Powierzchnia,
                type: rawRoom.Rodzaj,
                details: rawRoom.Typ?.text,
            };
        });
    }

    private computeCounty(county: string): string {
        // Counties named after cities end with m..
        if (county.includes('m.')) {
            return '';
        }
        return county;
    }

    private computeCity(location: string): string {
        return location.replace(' (gw)', '');
    }

    private computeFullLocation(city: string, district: string) {
        const isDistrictAvailable = district && district !== city;
        return city + (isDistrictAvailable ? ', ' + district : '');
    }

    private computeEstateType(estateType: string): string {
        if (estateType === 'Dzialka') {
            return 'Działka';
        }
        if (estateType === 'Biurowiec') {
            return 'Obiekt';
        }
        return estateType;
    }

    private convertFloor(floor: string): number {
        const containsNumber = /\d/;
        if (containsNumber.test(floor)) {
            // Removes leter p following floor number.
            return Number(floor.match(/\d+/)[0]);
        }
        else if (floor.toLowerCase().includes('parter')) {
            return 0;
        }
        return -1;
    }
}