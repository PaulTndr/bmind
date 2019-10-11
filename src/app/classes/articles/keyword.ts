interface KeywordData {
    id: Number
    langue: String
    key: string
    def: string
}

export class Keyword {
  id : Number;
  langue : String;
  key : String;
  def : String;

  copy() : Keyword {
    var copyKw = new Keyword();
    copyKw.id=this.id;
    copyKw.langue=this.langue;
    copyKw.key=this.key;
    copyKw.def=this.def;
    return copyKw;
  }

  fromHashMap(data : KeywordData){
    this.id=Number(data.id);
    this.langue=String(data.langue);
    this.key=String(data.key);
    this.def=String(data.def);
  }
}