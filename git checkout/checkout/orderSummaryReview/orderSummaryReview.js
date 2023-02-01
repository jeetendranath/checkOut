import { LightningElement,api,track,wire } from 'lwc';
import  handlerShippingAddress from '@salesforce/apex/OrderReviewClass.handlerShippingAddress';
import  getCartDeliveryGroup from '@salesforce/apex/OrderReviewClass.getCartDeliveryGroup';
import  getUserDetails from '@salesforce/apex/OrderReviewClass.getUserDetails';
import  handlerShippingAddresscart from '@salesforce/apex/OrderReviewClass.handlerShippingAddresscart';
import  getUserDetailscart from '@salesforce/apex/OrderReviewClass.getUserDetailscart';
import  getDeliveryInstructions from '@salesforce/apex/OrderReviewClass.getDeliveryInstructions';







export default class CheckoutSummary extends LightningElement {
    @api OrderSummaryId;

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
        handlerShippingAddresscart({cartSummaryId : this.OrderSummaryId,  addressType : 'Shipping'})
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
        handlerShippingAddresscart({cartSummaryId : this.OrderSummaryId , addressType : 'Billing'})
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