import { LightningElement,api,track,wire } from 'lwc';
import getCartItems from '@salesforce/apex/OrderReviewClass.getCartItems';
import getOrderSummaryItems from '@salesforce/apex/OrderReviewClass.getOrderSummaryItems';


export default class ProductList extends LightningElement {
    @api cartId;
    @track records;
    @track dataNotFound;
    @track error;
    @api orderSummaryId;
    @api isOrderSummary = false;


    connectedCallback(){
        this.getCartItemList();
    }
    /*@wire (getCartItems,{cartId:'$cartId'})
    wireRecord({data,error}){
    if(data){
        console.log(data);
        this.records = data;
        this.error = undefined;
        
    }else{
        this.error = error;
        console.log(this.error);
        this.data=undefined;
    }
    }*/
    
    getCartItemList(){
        if(this.isOrderSummary == true){
            getOrderSummaryItems({orderSummaryId : this.orderSummaryId})
            .then((result)=>
            {
                console.log(result);
                this.records = result;

            })
            .catch((error)=>
            {
                console.log(error);
            });

        }
        else if(this.isOrderSummary == false){
            getCartItems({cartId : this.cartId})
            .then((result)=>
            {
                console.log(result);
                this.records = result;

            })
            .catch((error)=>
            {
                console.log(error);
            });

        }
        
    }


}