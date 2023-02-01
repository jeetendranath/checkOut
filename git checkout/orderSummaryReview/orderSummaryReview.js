import { LightningElement,api,track,wire } from 'lwc';
import  handlerShippingAddress from '@salesforce/apex/OrderReviewClass.handlerShippingAddress';
import  getCartDeliveryGroup from '@salesforce/apex/OrderReviewClass.getCartDeliveryGroup';
import  getUserDetails from '@salesforce/apex/OrderReviewClass.getUserDetails';
import  handlerShippingAddresscart from '@salesforce/apex/OrderReviewClass.handlerShippingAddresscart';
import  getUserDetailscart from '@salesforce/apex/OrderReviewClass.getUserDetailscart';
import  getDeliveryInstructions from '@salesforce/apex/OrderReviewClass.getDeliveryInstructions';
import  getPaymentMethod from '@salesforce/apex/OrderReviewClass.getPaymentMethod';






export default class CheckoutSummary extends LightningElement {
    @api OrderSummaryId;

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
        handlerShippingAddresscart({cartSummaryId : this.OrderSummaryId,  addressType : 'Shipping'})
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
        handlerShippingAddresscart({cartSummaryId : this.OrderSummaryId , addressType : 'Billing'})
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
        getDeliveryInstructions({orderSummaryId : this.OrderSummaryId})
        .then((result)=>
        {
            console.log(result);
            this.shippingInstructions = result;

        })
        .catch((error)=>
        {
            console.log(error);
        });
    }

    getUserDetails(){
        getUserDetailscart({OrderSummaryId : this.OrderSummaryId})
        .then((result)=>
        {
            console.log('User Details '+result);
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