interface KeywordData {
    id: Number
    key: string
    def: string
}

export class Keyword {
  id : Number;
  key : String;
  def : String;

  copy() : Keyword {
    var copyKw = new Keyword();
    copyKw.id=this.id;
    copyKw.key=this.key;
    copyKw.def=this.def;
    return copyKw;
  }

  fromHashMap(data : KeywordData){
    this.id=Number(data.id);
    this.key=String(data.key);
    this.def=String(data.def);
  }
}