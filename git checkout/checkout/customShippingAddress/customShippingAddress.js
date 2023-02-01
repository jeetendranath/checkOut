import { LightningElement ,track,api} from 'lwc';
import getShippingAddress from '@salesforce/apex/AddressController.getShippingAddress';
import  createShipingAddress from '@salesforce/apex/AddressController.createShipingAddress';
import  getBillingAddress from '@salesforce/apex/AddressController.getBillingAddress';
import  handlerShippingAddress from '@salesforce/apex/AddressController.handlerShippingAddress';
import  updateBillingAddress from '@salesforce/apex/AddressController.updateBillingAddress';





export default class CustomShippingAddress extends LightningElement {
    /* cartId value is getting from the flow*/
    @api strRecordId;
    @api billingValue;
    @api value;
    @api isShowCartSummary;
    @api instructions;
    @api defaultStreet;
    @api defaultCity;
    @api defaultState;
    @api defaultCountry;
    @api defaultPostalCode;
    @api defaultName; 
    
    

    @track options;
    @track billingOptions;
    @track shippingInstruction;
    @track showCombobox = false;
    
    
    @track shippingAddress='No Instructions Provided';
    @track street;
    @track city;
    @track state;
    @track country;
    @track postalCode;


    @track billingAddress ={};

    @track openModal;
    @track name;
    @track isDefault = false;
    @api saveAddress =false;
    @api saveAddressString;
    @api isSaveAddress;
    
    @track selectedLabel;
    
   /**
     * The connectedCallback() lifecycle hook fires when a component is inserted into the DOM.
     */
   connectedCallback() {
    this.getShippingAddressList();
    this.getBillingAddressList();
    this.isSaveAddress =true;
    console.log('Is Save Address : '+ this.isSaveAddress);
    this.handlerUpdateBillingAddress();
    //this.getShippingInstruction();
}

  getShippingAddressList() {
        console.log(this.cartId);
        getShippingAddress({cartId : this.strRecordId })
        .then((result) => {
            let options = [];
            if (result) {
                console.log(result);
                for(var key in result){
                    var isDefault = result[key].substring(result[key].lastIndexOf("/") +1);
                    console.log(isDefault);
                    if(isDefault == 'true')
                    {
                        this.value = key;
                        this.defaultHandleShippingAddress();
                        
                    }
                    this.shippingAddress = result[key].substring(0,result[key].lastIndexOf("/") )
                    options.push({value:key, label:this.shippingAddress});
                }
                
            }
            this.options =options;
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getBillingAddressList() {
        console.log(this.cartId);
        console.log('this is saveaddressString : '+this.saveAddressString);
        getBillingAddress({cartId : this.strRecordId })
        .then((result) => {
            let options = [];
            if (result) {
                console.log(result);
                for(var key in result){
                    var isDefault = result[key].substring(result[key].lastIndexOf("/") +1);
                    console.log(isDefault);
                    if(isDefault == 'true')
                    {
                        this.billingValue = key;
                        this.defaultHandleBillingAddress();
                    }
                    let address = result[key].substring(0,result[key].lastIndexOf("/") )
                    options.push({value:key, label:address});
                }
                
            }
            this.billingOptions=options;
        })
        .catch((error) => {
            console.log(error);
        });
    }

    handleChange(event){
        this.street= event.target.street;
        this.city=event.target.city;
        this.state=event.target.province;
        this.country=event.target.country;
        this.postalCode=event.target.postalCode;
    }
    handleChangeIsdefault(event){
            this.isDefault = event.target.value;


       }
    handleInstructions(event){
        this.instructions = event.target.value;
    }


    handleShippingAddress(event){
        this.selectedLabel = event.target.options.find(opt => opt.value === event.detail.value).label;
        //this.selectedValue = event.target.options.find(opt => opt.value === event.detail.value).value;
        this.value = event.target.value;
        console.log(this.selectedLabel);
        console.log(this.value);

        handlerShippingAddress({addressId : this.value})
        .then((result)=>{
            this.street=result.street;
            this.city=result.city;
            this.state=result.state;
            this.country=result.country;
            this.postalCode = result.postalCode;
            console.log('ADDRESS :   '+this.street +','+this.city+','+this.state+','+this.country+','+this.postalCode);

        })


    }

    handleBillingAddress(event){
        this.selectedLabel = event.target.options.find(opt => opt.value === event.detail.value).label;
       // this.selectedValue = event.target.options.find(opt => opt.value === event.detail.value).value;
        this.billingValue = event.target.value;
        console.log(this.selectedLabel);
        console.log(this.billingValue);
        this.handlerUpdateBillingAddress();
        handlerShippingAddress({addressId : this.billingValue})
        .then((result)=>{
            

            this.billingAddress.Street = result.street;
            this.billingAddress.City = result.city;
            this.billingAddress.State = result.state;
            this.billingAddress.Country = result.country;
            this.billingAddress.Postalcode = result.postalCode;
            console.log('ADDRESS :   '+this.billingstreet +','+this.billingcity+','+this.billingstate+','+this.billingcountry+','+this.billingpostalCode);

        })


    }
    defaultHandleShippingAddress(){
        console.log('Default Key :' + this.value);
        handlerShippingAddress({addressId : this.value})
        .then((result)=>{
            this.street=result.street;
            this.city=result.city;
            this.state=result.state;
            this.country=result.country;
            this.postalCode = result.postalCode;
            console.log('ADDRESS :   '+this.street +','+this.city+','+this.state+','+this.country+','+this.postalCode);

        })

    }


    defaultHandleBillingAddress(){
        console.log('Default Key :' + this.billingValue);
        handlerShippingAddress({addressId : this.billingValue})
        .then((result)=>{
            
            this.billingAddress.Street = result.street;
            this.billingAddress.City = result.city;
            this.billingAddress.State = result.state;
            this.billingAddress.Country = result.country;
            this.billingAddress.Postalcode = result.postalCode;
            console.log('ADDRESS :   '+this.billingstreet +','+this.billingcity+','+this.billingstate+','+this.billingcountry+','+this.billingpostalCode);

        })

    }


    handlerUpdateBillingAddress(){
        updateBillingAddress({cartId : this.strRecordId})
        .then((result)=>{
            console.log(result);
        })
        .catch((error)=>{
            console.log(error);
        })
    }  

        
    
    handleChangeName(event){
        this.name=event.target.value;
    }
    
    handleChangeSaveAddress(event){
        this.saveAddress = event.target.value;
               
    }


    saveAddresses(){  
        if(this.saveAddress != 'true'){
            this.isSaveAddress=false;

        } 
        /*console.log('In saving Address ');
        console.log('street '+ this.street);
        console.log('city '+this.city);
        console.log('state '+this.state);
        console.log('country '+this.country);
        console.log('postalcode '+this.postalCode);
        console.log('isDefault '+this.isDefault);
        console.log('name '+this.name);
        console.log('saveaddress '+this.saveAddress);
        console.log('Is save Address 2 '+ this.isSaveAddress);*/

        createShipingAddress({name: this.name,street : this.street,city : this.city, state: this.state,
            country : this.country,postalCode :this.postalCode, isDefault : this.isDefault,saveAddress: this.saveAddress,cartId : this.strRecordId})
        
        .then((result)=>
        {
            
            if(result == 'Not Saved'){
                console.log(result);  
                this.showCombobox = true; 
                this.defaultStreet = this.street;
                this.defaultCity =this.city;
                this.defaultState=this.state;
                this.defaultCountry =this.country;
                this.defaultPostalCode=this.postalCode;
                this.defaultName =this.name;
                this.saveAddress =false;
                
            }
            else if(result == 'Inserted'){
                console.log(result);
                this.updateRecordView();
            }
            this.closeModal();
            
        })

        .catch((error)=>
        {
            console.log(error);
        });
        
    }
    

    createAddress(){
        this.openModal = true;
    }
    closeModal() {
        this.openModal = false;
    }
    updateRecordView() {
        setTimeout(() => {
             eval("$A.get('e.force:refreshView').fire();");
        }, 1000); 
     }
      
}