interface OfferData {
    id: Number;
    title: String
    linkPDF: String
}

export class Offre {
    id: Number;
    title: String;
    linkPDF: String;

    fromHashMap(data: OfferData) {
        this.id = Number(data.id);
        this.title = String(data.title);
        this.linkPDF = String(data.linkPDF);
    }

    copy(): Offre {
        var copyOffer = new Offre();
        copyOffer.id = this.id;
        copyOffer.linkPDF = this.linkPDF;
        copyOffer.title = this.title;
        return copyOffer;
    }
}