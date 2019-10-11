interface TypeData {
    langue: String
    key: String
}

export class Type {
  langue : String;
  key : String;

  copy() : Type {
    var copyType = new Type();
    copyType.langue=this.langue;
    copyType.key=this.key;
    return copyType;
  }

  fromHashMap(data : TypeData){
    this.langue=String(data.langue);
    this.key=String(data.key);
  }
}