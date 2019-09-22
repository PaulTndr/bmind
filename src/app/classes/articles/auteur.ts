interface AutorData {
    id: Number
    prenom: string
    nom: string
    fonction: string
}

export class Auteur {
  id : Number;
  prenom : String;
  nom : String;
  fonction : String;

  copy() : Auteur {
    var copyAutor = new Auteur();
    copyAutor.id=this.id;
    copyAutor.prenom=this.prenom;
    copyAutor.nom=this.nom;
    copyAutor.fonction=this.fonction;
    return copyAutor;
  }

  fromHashMap(data : AutorData){
    this.id=Number(data.id);
    this.prenom=String(data.prenom);
    this.nom=String(data.nom);
    this.fonction=String(data.fonction);
  }
}