interface OfferData {
    title: String
    linkPDF: String
}

export class Offre {
    title: String;
    linkPDF: String;

    fromHashMap(data: OfferData) {
        this.title = String(data.title);
        this.linkPDF = String(data.linkPDF);
    }
}