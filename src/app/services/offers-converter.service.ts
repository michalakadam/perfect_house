import { Injectable } from '@angular/core';

import { Offer, Room } from '../shared/models';

const toBeReplaced = "Oferta wysłana z systemu Galactica Virgo";

@Injectable({
    providedIn: 'root',
})
export class OffersConverter {

    convertToReadableOffers(rawOffers: any[]): Offer[] {
        return rawOffers.map(offer => {
            return {
                id: this.convertToNumber(offer.ID),
                estateType: this.computeEstateType(offer.Przedmiot || ''),
                agentId: this.convertToNumber(offer.Agent),
                title: offer.TytulOferty || '',
                description: (offer.UwagiOpis || '').replace(toBeReplaced, ''),
                additionalDescription: offer.DodatkowyOpis || '',
                additionalRemarks: offer.UwagiOpis || '',
                releaseDate: offer.TerminWydaniaData?.text || '',
                // TerminWydaniaLista is always a single element object.
                releaseDateTitle: offer.TerminWydaniaLista?.text || '',
                number: this.convertToNumber(offer.Nr),
                symbol: offer.Symbol || '',
                status: offer.Status || '',
                legalStatus: offer.StanPrawny || '',
                standard: this.convertToNumber(offer.Standard?.text),
                isAlarmSet: this.convertToBoolean(offer.Alarm?.text),
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
                pricePerSquareMeter: this.convertToNumber(offer.CenaM2),
                pricePerUsableSquareMeter: this.convertToNumber(offer.CenaM2PowUzytk?.text),
                rentPrice: this.convertToNumber(offer.CzynszLetni?.text),
                grossRentPricePerSquareMeter: this.convertToNumber(offer.CzynszNajmuBrutto_m2?.text),
                netRentPricePerSquareMeter: this.convertToNumber(offer.CzynszNajmuNetto_m2?.text),
                deposit: this.convertToNumber(offer.Kaucja?.text),
                depositType: offer.TypKaucji?.text,
                additionalFees: this.convertToArray(
                    offer.DodatkoweOplatyWCzynszu?.lista ||
                    offer.DodatkoweOplatyWgLicznikow?.lista),
                garagePrice: this.convertToNumber(offer.CenaGarazu?.text),
                
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
                neighbourhood: offer.Otoczenie?.text || offer.Sasiedztwo?.lista || '',
                accessRoad: offer.Dojazd?.text || '',
                distance: this.convertToNumber(offer.Odleglosc),

                totalArea: this.convertToNumber(offer.PowierzchniaCalkowita),
                landArea: this.convertToNumber(offer.PowierzchniaDzialki?.text),
                usableArea: this.convertToNumber(offer.PowierzchniaUzytkowa?.text),
                terraceArea: this.convertToNumber(offer.PowierzchniaTarasBalkon?.text),
                officeArea: this.convertToNumber(
                    offer.PowierzchniaBiurowa?.text ||
                    offer.PowierzchniaPomieszczenBiurowychDo?.text),
                officeBuildingArea: this.convertToNumber(offer.PowierzchniaBiurowca?.text),
                floorArea: this.convertToNumber(offer.PowierzchniaKondygnacji?.text),

                rooms: this.convertRooms(this.convertToArray(offer.Pomieszczenia?.Pomieszczenie)),
                numberOfRooms: this.convertToNumber(offer.IloscPokoi),
                roomsHeight: this.convertToNumber(offer.WysokoscPomieszczen),
                floor: this.convertFloor(offer.Pietro || ''),
                numberOfFloors: this.convertToNumber(
                    offer.IloscKondygnacji ||
                    offer.IloscPieter?.text || ''),
                floorHeight: this.convertToNumber(offer.WysokoscKondygnacji?.text),
                isBasementAvailable: this.convertToBoolean(offer.Piwnica),
                numberOfBedrooms: this.convertToNumber(offer.IloscSypialni?.text),
                numberOfTerraces: this.convertToNumber(offer.IloscBalkonow?.text),
                noiseLevel: offer.Glosnosc?.text || '',
                isTerraceAvailable: this.convertToBoolean(offer.Balkon?.text),
                buildingType: offer.RodzajBudynku || offer.RodzajObiektu?.text || '',
                officeBuildingCategory: offer.KategoriaBiurowca?.text || '',
                flatType: offer.RodzajMieszkania?.text || '',
                gasConnectionDetails: offer.Gaz?.text || '',
                sewageConnectionDetails: offer.Kanalizacja?.text || '',
                waterConnectionDetails: offer.Woda?.text || '',
                electricityConnectionDetails: offer.Prad?.text || '',
                garage: offer.Garaz?.text || offer.GarazMieszkanie?.text || '',
                isParkingAvailable: this.convertToBoolean(
                    offer.WlasnyParking ||
                    offer.MozliwoscParkowania?.text),
                isElevatorAvailable: this.convertToBoolean(offer.WindaJest?.text),
                isFenceAvailable: this.convertToBoolean(offer.Ogrodzenie),
                isMarketPrimary: this.convertToBoolean(offer.Pierwotny),
                acquisitionType: offer.PodstawaNabycia?.text || '',
                burden: offer.Obciazenia?.text || '',
                // UsytuowanieLista is always a single element object.
                flatSetUp: offer.UsytuowanieLista?.text || '',
                yearBuilt: this.convertToNumber(offer.RokBudowy?.text),
                constructionTechnology: offer.TechnologiaBudowlana || '',
                // Okna is always a single element object.
                windowsType: offer.Okna?.text || '',
                heatingType: offer.Ogrzewanie?.text || '',
                isAccessible: this.convertToBoolean(offer.Niepelnosprawni?.text),
                buildingName: offer.NazwaObiektu || '',
                minimumRentingPeriodInMonths: this.convertToNumber(offer.MinOkresNajmu?.text),
                predestination: this.convertToArray(
                    offer.PrzeznaczenieLokalu?.lista ||
                    offer.PrzeznaczenieHali?.lista ||
                    offer.PrzeznaczenieHaliSet?.lista ||
                    offer.PrzeznaczenieDzialkiSet?.lista),
                isReceptionAvailable: this.convertToBoolean(offer.Recepcja?.text),
                isComputerNetworkAvailable: this.convertToBoolean(offer.SiecKomputerowa?.text),
                securityType: offer.DozorBudynkuLista?.text || '',
                entrance: offer.Wejscie?.text || '',

                isFloorDustFree: this.convertToBoolean(offer.PosadzkaNiepylaca?.text),
                isLoadingRampAvailable: this.convertToBoolean(offer.RampaRozladunkowa?.text),
                warehouseArea: this.convertToNumber(offer.PowierzchniaPomieszczenMagazynowych?.text),
                warehouseYardArea: this.convertToNumber(offer.PowierzchniaPlacuUtwardzonego?.text),
                isYardHardened: this.convertToBoolean(offer.PlacUtwardzany?.text),
                isManeuveringAreaAvailable: this.convertToBoolean(offer.PlacManewrowy?.text),
                isTruckParkingAvailable: this.convertToBoolean(offer.ParkowanieTir?.text),
                isGantryAvailable: this.convertToBoolean(offer.Suwnica?.text),
                isGoodsLiftAvailable: this.convertToBoolean(offer.WindaTowarowa?.text),

                // StanLokaluLista is always a single element object.
                premiseState: offer.StanLokaluLista?.text || '',
                premiseType: offer.RodzajLokalu?.text || '',
                premiseBackRoomArea: this.convertToNumber(offer.PowierzchniaZaplecza?.text),
                premiseSalesRoomArea: this.convertToNumber(offer.PowierzchniaHaliSprzedazy?.text),

                mpzp: offer.MPZP?.text || '',
                mpzpInfo: offer.MPZPInformacja?.text || '',
                landLotUse: offer.ZagospodarowanieDzialki?.text || '',
                landLotDetailedSize: offer.WymiaryDzialki?.text || '',
                landLotConstructionConditions: offer.WarunkiZabudowy?.text || '',
                landLotForm: offer.UksztaltowanieDzialki?.text || '',
                landLotFrontLineWidth: this.convertToNumber(offer.SzerokoscFrontuDzialki?.text),
                landLotShape: offer.KsztaltDzialki?.text || '',
                landLotLegalStatus: offer.StanPrawnyGruntu || '',
                landLotFenceType: offer.OgrodzenieDzialki?.text || '',
                landLotBuildings: offer.ZabudowaDzialki?.text || '',
            };
        });
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