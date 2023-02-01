import { LightningElement,api,track } from 'lwc';
import getOrderNumber from '@salesforce/apex/OrderReviewClass.getOrderNumber';

import IMAGES from "@salesforce/resourceUrl/static_images";
export default class Confirmationmessage extends LightningElement {
    @api orderSummaryId;
    @track orderNumber;
    @track Email;
    logo =IMAGES + '/static_images/logo/logo.png'; 

    connectedCallback(){
        
        getOrderNumber({orderSummaryId : this.orderSummaryId})
            .then((result)=>
            {
                console.log('CheckOut Summary '+result);
                this.orderNumber = result.orderNumber;
                this.Email = result.Email;
    
            })
            .catch((error)=>
            {
                console.log(error);
            });
        

    }

    
}