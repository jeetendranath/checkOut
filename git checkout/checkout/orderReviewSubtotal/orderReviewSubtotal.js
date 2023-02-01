import { LightningElement,api } from 'lwc';
import  getSubTotal from '@salesforce/apex/OrderReviewClass.getSubTotal';
export default class OrderReviewSubtotal extends LightningElement {
   
    @api cartId;
    TotalProductAmount=0;
    TotalChargeAmount;
    TotalTaxAmount;
    grandTotalAmount=0;
   

    connectedCallback()
    {
        getSubTotal({cartId : this.cartId})
            .then((result)=>
            {
                
                this.TotalProductAmount = result.TotalProductAmount;
                this.TotalChargeAmount = result.TotalChargeAmount;
                this.TotalTaxAmount = 0;
                this.grandTotalAmount = result.GrandTotalAmount;
                
    
            })
            .catch((error)=>
            {
                console.log(error);
            });
    }
}