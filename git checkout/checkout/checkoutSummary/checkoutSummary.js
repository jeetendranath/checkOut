import { LightningElement,api,track,wire } from 'lwc';
import  handlerShippingAddress from '@salesforce/apex/OrderReviewClass.handlerShippingAddress';
import  getCartDeliveryGroup from '@salesforce/apex/OrderReviewClass.getCartDeliveryGroup';
import  getUserDetails from '@salesforce/apex/OrderReviewClass.getUserDetails';



export default class CheckoutSummary extends LightningElement {
    @api CartId;
    @track shippingAddress ={};
    @track billingAddress ={};
    @track userDetails ={};
    

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
            
            this.shippingAddress.Street = data.street;
            this.shippingAddress.PostelCode = data.postalCode;
            this.shippingAddress.Country = data.country;
            this.shippingAddress.State = data.state;
            this.shippingAddress.City = data.city;

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
            
            this.billingAddress.Street = data.street;
            this.billingAddress.PostelCode = data.postalCode;
            this.billingAddress.Country = data.country;
            this.billingAddress.State = data.state;
            this.billingAddress.City = data.city;

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
            
            this.userDetails.Username = result.Name;
            this.userDetails.Email = result.Email;
            this.userDetails.Phonenumber = result.Phone;
        })
        .catch((error)=>
        {
            console.log(error);
        });
    }




    
}