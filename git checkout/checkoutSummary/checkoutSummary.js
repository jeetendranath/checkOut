import { LightningElement,api,track,wire } from 'lwc';
import  handlerShippingAddress from '@salesforce/apex/OrderReviewClass.handlerShippingAddress';
import  getCartDeliveryGroup from '@salesforce/apex/OrderReviewClass.getCartDeliveryGroup';
import  getUserDetails from '@salesforce/apex/OrderReviewClass.getUserDetails';



export default class CheckoutSummary extends LightningElement {
    @api CartId;

    @track shippingstreet;
    @track shippingcity;
    @track shippingstate;
    @track shippingcountry;
    @track shippingpostalCode;

    @track billingstreet;
    @track billingcity;
    @track billingstate;
    @track billingcountry;
    @track billingpostalCode;

    @track userName;
    @track email;
    @track phoneNumber;

    @track shippingInstructions;
    @track error;

    connectedCallback(){
        this.getShippingAddress();
        this.getBillingAddress();
        this.getShippingInstruction();
        this.getUserDetails();
    }

    getShippingAddress(){
        getCartDeliveryGroup({cartId : this.CartId})
        .then((data)=>
        {
            this.shippingstreet=data.street;
            this.shippingcity=data.city;
            this.shippingstate=data.state;
            this.shippingcountry=data.country;
            this.shippingpostalCode=data.postalCode;

        })
        .catch((error)=>
        {
            console.log(error);
        });
    }

    getBillingAddress(){
        handlerShippingAddress({cartId : this.CartId , addressType : 'Billing'})
        .then((data)=>
        {
            this.billingstreet=data.street;
            this.billingcity=data.city;
            this.billingstate=data.state;
            this.billingcountry=data.country;
            this.billingpostalCode=data.postalCode;

        })
        .catch((error)=>
        {
            console.log(error);
        });
    }

    getShippingInstruction(){
        getCartDeliveryGroup({cartId : this.CartId})
        .then((result)=>
        {
            console.log(result);
            this.shippingInstructions = result.ShippingInstruction;

        })
        .catch((error)=>
        {
            console.log(error);
        });
    }

    getUserDetails(){
        getUserDetails({cartId : this.CartId})
        .then((result)=>
        {
            
            console.log('UserDetails '+result);
            this.userName = result.Name;
            this.email = result.Email;
            this.phoneNumber = result.Phone;
        })
        .catch((error)=>
        {
            console.log(error);
        });
    }




    
}