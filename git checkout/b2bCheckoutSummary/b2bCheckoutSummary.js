import { LightningElement, api } from 'lwc';

import getOrderNumber from '@salesforce/apex/OrderReviewClass.getOrderNumber';
export default class B2bCheckoutSummary extends LightningElement {

    @api orderSummaryId;
    @api TotalProductAmount=0;
    @api TotalChargeAmount;
    @api TotalTaxAmount;
    @api grandTotalAmount=0;
   




    connectedCallback()
    {
       getOrderNumber({orderSummaryId : this.orderSummaryId})
            .then((result)=>
            {
                console.log('CheckOut Summary '+result.grandTotal +' ' +result.subTotal +' ' + result.shipping +' ' + result.Tax);
                this.TotalProductAmount = result.subTotal;
                this.TotalChargeAmount = result.shipping;
                this.TotalTaxAmount = result.Tax;
                this.grandTotalAmount = result.grandTotal;
                          
    
            })
            .catch((error)=>
            {
                console.log(error);
            });
    }
}