class ErrorsAPI extends Error {
    constructor(name, statusCode, errorCode, message = null) {
    super(message || name);
    this.name = name;
    this.status = statusCode;
    this.errorCode = errorCode;
    }   
 }
 class ElementAlreadyExistsError extends ErrorsAPI{
     constructor(){
         super("ElementAlreadyExistsError",409,"RESOURCE_ALREADY_EXISTS")
     }
 }

 class ElementNotFound extends ErrorsAPI{
     constructor(){
         super("ElementNotFound", 404 , "RESOURCE_NOT_FOUND")
     }
 }

 class RelatedElementNotFound extends ErrorsAPI{
     constructor(){
         super("RelatedElementNotFound",404,"RELATED_RESOURCE_NOT_FOUND")
     }
 }

 class InvalidJSON extends ErrorsAPI{
     constructor(){
         super("InvalidJSON",400,"BAD_REQUEST")
     }
 }
 class ServerOFFError extends APIError{
    constructor(){
        super("Server OFF" , 400 , "SERVER_OFF")
    }
}

class MissingArgumentJSON extends APIError{
   constructor(){
       super("MissingArgumentJSON",400,"BAD_REQUEST")
   }
}

module.exports={
    ElementAlreadyExistsError: ElementAlreadyExistsError,
    ElementNotFound : ElementNotFound,
    RelatedElementNotFound : RelatedElementNotFound,
    InvalidJSON,
    MissingArgumentJSON : MissingArgumentJSON,
    ServerOFFError : ServerOFFError,
    Errores : [ElementAlreadyExistsError,ElementNotFound,RelatedElementNotFound,InvalidJSON]
}