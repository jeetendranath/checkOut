public without sharing class OrderReviewClass {

    /*
    This method returns the shipping and billing address from the cart.
    */
    
    @AuraEnabled
    public static Map<String,String> handlerShippingAddress(Id cartId,String addressType){
        try {
            List<WebCart> accountIdList = [SELECT AccountId FROM WebCart WHERE id=: cartId];
            String accountId = accountIdList[0].AccountId;
            List<ContactPointAddress> result = new List<ContactPointAddress>();
            if(addressType == 'Shipping'){
                result = [SELECT Address FROM ContactPointAddress WHERE ParentId=:accountId AND IsDefault = true AND AddressType = 'Shipping' ];
            }
            else if(addressType == 'Billing')
            {
                result = [SELECT Address FROM ContactPointAddress WHERE ParentId=:accountId AND IsDefault = true AND AddressType = 'Billing' ];
            }
            
            Map<String,String> Map1 = new Map<String,String>();
            Address add = result[0].Address;
            Map1.put('street',add.getStreet());
            Map1.put('city',add.getCity());
            Map1.put('state',add.getState());
            Map1.put('country',add.getCountry());
            Map1.put('postalCode',add.getPostalCode());
            system.debug(Map1);
            return Map1;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /*
    This method returns the shipping and billing address from the orderSummary.
    */

    @AuraEnabled
    public static Map<String,String> handlerShippingAddresscart(Id cartSummaryId,String addressType){
        try {
            List<OrderSummary> OrderSummaryList = [SELECT AccountId FROM OrderSummary WHERE id=: cartSummaryId];
            String accountId = OrderSummaryList[0].AccountId;
            List<ContactPointAddress> result = new List<ContactPointAddress>();
            if(addressType == 'Shipping'){
                result = [SELECT Address FROM ContactPointAddress WHERE ParentId=:accountId AND IsDefault = true AND AddressType = 'Shipping' ];
            }
            else if(addressType == 'Billing')
            {
                result = [SELECT Address FROM ContactPointAddress WHERE ParentId=:accountId AND IsDefault = true AND AddressType = 'Billing' ];
            }
            
            Map<String,String> Map1 = new Map<String,String>();
            Address add = result[0].Address;
            Map1.put('street',add.getStreet());
            Map1.put('city',add.getCity());
            Map1.put('state',add.getState());
            Map1.put('country',add.getCountry());
            Map1.put('postalCode',add.getPostalCode());
            system.debug(Map1);
            return Map1;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // this method gets the details of the cart delivery group.


    @AuraEnabled
    public static Map<String,String> getCartDeliveryGroup(Id cartId){
        try {
            list<CartDeliveryGroup> result = [SELECT DeliverToName,DeliverToAddress,ShippingInstructions,TotalProductAmount,TotalChargeAmount,
                                                    TotalTaxAmount,TotalAmount FROM CartDeliveryGroup WHERE CartId=: cartId];
            Map<String,String> returnMap = new Map<String,String>();
            returnMap.put('ShippingInstruction',result[0].ShippingInstructions);
            returnMap.put('SubTotal',String.valueOf(result[0].TotalProductAmount.format()));
            returnMap.put('ShippingCost',String.valueOf(result[0].TotalChargeAmount.format()));
            returnMap.put('Tax',String.valueOf(result[0].TotalProductAmount.format()));
            returnMap.put('TotalAmount',String.valueOf(result[0].TotalAmount.format()));
            Address add = result[0].DeliverToAddress;
            returnMap.put('street',add.getStreet());
            returnMap.put('city',add.getCity());
            returnMap.put('state',add.getState());
            returnMap.put('country',add.getCountry());
            returnMap.put('postalCode',add.getPostalCode());

            return returnMap;

            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // this method gets the details of the user from cartid.

    @AuraEnabled
    public static Map<String,String> getUserDetails(Id cartId){
        try {
            List<WebCart> userList = [SELECT OwnerId FROM WebCart WHERE Id =: cartId];
            String userId = userList[0].OwnerId;
            List<User> userDetails = [SELECT Name,Email,Contact.Phone FROM User WHERE Id=: userId];

            
            Map<String,String> returnMap = new Map<String,String>();
            returnMap.put('Name', userDetails[0].Name);
            returnMap.put('Email', userDetails[0].Email);
            returnMap.put('Phone', userDetails[0].Contact.Phone);
            return returnMap;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // this method gets the details of the user from ordersummaryId.

    @AuraEnabled
    public static Map<String,String> getUserDetailscart(Id OrderSummaryId){
        try {
            List<OrderSummary> userList = [SELECT OwnerId FROM OrderSummary WHERE Id =: OrderSummaryId];
            String userId = userList[0].OwnerId;
            List<User> userDetails = [SELECT Name,Email,Contact.Phone FROM User WHERE Id=: userId];

            Map<String,String> returnMap = new Map<String,String>();
            returnMap.put('Name',userDetails[0].Name);
            returnMap.put('Email',userDetails[0].Email);
            returnMap.put('Phone',userDetails[0].Contact.Phone);
            return returnMap;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean getPaymentMethod(Id OrderSummaryId){
        try {
            List<OrderSummary> userList = [SELECT PoNumber FROM OrderSummary WHERE Id =: OrderSummaryId];
            if(userList[0].PoNumber != null)
            {
                return true;

            }
            else{
                return false;
            }

            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }



    //this method details gets the product details from cartItems.
    @AuraEnabled
    public static List<CartItem> getCartItems(Id cartId){
        try {
            List<CartItem> cartItemList = [SELECT Id,Name,Sku,ListPrice,SalesPrice,Quantity,TotalAmount FROM CartItem WHERE CartId =: cartId AND Name !='Test Delivery Group Method'];
            return cartItemList;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //this method details gets the product details from OrderItems.

    @AuraEnabled
    public static List<OrderItemSummary> getOrderSummaryItems(Id orderSummaryId){
        try {
            List<OrderItemSummary> OrderItemSummaryList = [SELECT Id,Name,StockKeepingUnit,ListPrice,UnitPrice,QuantityOrdered,TotalLineAmount FROM OrderItemSummary WHERE OrderSummaryId =: orderSummaryId AND Name !='Test Delivery Group Method'];
            return OrderItemSummaryList;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //this method details gets the Delivery Instructions from OrderItems.
    @AuraEnabled
    public static String getDeliveryInstructions(Id orderSummaryId){
        try {
            List<OrderDeliveryGroupSummary> result =[SELECT DeliveryInstructions  FROM OrderDeliveryGroupSummary WHERE OrderSummaryId =: orderSummaryId];
            String Instruction = result[0].DeliveryInstructions;
            return Instruction;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //this method details gets the Delivery Instructions from OrderItems.
    @AuraEnabled
    public static Map<String,String> getSubTotal(Id cartId){
        try {
            Map<String,String> myMap = new Map<String,String>();
            List<WebCart> cartData = [SELECT Id, AccountId, TotalProductAmount, TotalChargeAmount, GrandTotalAmount  FROM WebCart WHERE Id=:cartId];

             myMap.put('TotalProductAmount',String.valueOf(cartData[0].TotalProductAmount.format()));
             myMap.put('TotalChargeAmount',String.valueOf(cartData[0].TotalChargeAmount.format()));
             myMap.put('GrandTotalAmount',String.valueOf(cartData[0].GrandTotalAmount.format()));
             return myMap;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

     //this method details gets the Order details from OrderSummary.
    @AuraEnabled
    public static Map<String,String> getOrderNumber(Id orderSummaryId){
        try {
            Map<String,String> mapResult = new Map<String,String>();
            List<OrderSummary> result =[SELECT OrderNumber,GrandTotalAmount,TotalAdjustedProductAmount,
            TotalAdjustedDeliveryAmount,TotalTaxAmount ,OwnerId  FROM OrderSummary WHERE Id =: orderSummaryId];
            String userId = result[0].OwnerId;

            List<User> userDetails = [SELECT Username,CommunityNickname,Name,MobilePhone,Phone,Email,Contact.Phone FROM User WHERE Id=: userId];

            mapResult.put('orderNumber',result[0].OrderNumber);
            mapResult.put('grandTotal',String.valueOf(result[0].GrandTotalAmount.format()));
            mapResult.put('subTotal',String.valueOf(result[0].TotalAdjustedProductAmount.format()));
            mapResult.put('shipping',String.valueOf(result[0].TotalAdjustedDeliveryAmount.format()));
            mapResult.put('Tax',String.valueOf(result[0].TotalTaxAmount.format()));
            mapResult.put('Email',userDetails[0].Email);
           

            String orderNumber = result[0].OrderNumber;
            return mapResult;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
