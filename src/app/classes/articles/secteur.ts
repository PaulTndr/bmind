interface SecteurData {
    langue: String
    key: String
}

export class Secteur {
  langue : String;
  key : String;

  copy() : Secteur {
    var copySector = new Secteur();
    copySector.langue=this.langue;
    copySector.key=this.key;
    return copySector;
  }

  fromHashMap(data : SecteurData){
    this.langue=String(data.langue);
    this.key=String(data.key);
  }
}