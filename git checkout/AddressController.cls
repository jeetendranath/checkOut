public without sharing class AddressController {

    /*
    Method Name : getShippingAddress 
    Attributes : Id cartId
    return type : Map<Id,String>

    in this method it gets the shipping Address which is selected and returns it.
    */
    
    @AuraEnabled
    public static Map<Id,String> getShippingAddress(Id cartId){
        try {
            Map<Id,String> shippingMap = new Map<Id,String>(); 
            List<WebCart> cartList = [SELECT AccountId FROM WebCart WHERE id=: cartId];
            Id accountId = cartList[0].AccountId;
            List<ContactPointAddress> result = [SELECT Id,Name,Address,AddressType,ParentId,IsDefault FROM ContactPointAddress WHERE ParentId =:accountId AND AddressType ='Shipping'];
            for(ContactPointAddress c : result)
            {
                
                Boolean isDefault = c.IsDefault;
                String name = c.Name;
                String isDefault1 = isDefault ? 'true' : 'false';                
                String shippingAddress = name+'/'+isDefault1;
                Id addressId = c.Id;
                String addressType= c.AddressType;               
                shippingMap.put(addressId,shippingAddress);

            }
           /* for(Id	key: shippingMap.keyset())
            {
                String add = shippingMap.get(key);
                System.debug(key +':'+add);
            }*/
            return shippingMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /*
     Method Name : hamdlerShippingAddress
     Attributes : addressId
     Return Type : Map<String,String>

     In this method it gets the address where user selected and updates the address as Default one and returns the
     Selected address.

    */
    @AuraEnabled
    public static Map<String,String> handlerShippingAddress(Id addressId){
        try {
            List<ContactPointAddress> result = [SELECT Name,Address,IsDefault FROM ContactPointAddress WHERE id=:addressId];
            result[0].IsDefault = true;
            update result;
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
    Method Name : getBillingAddress 
    Attributes : Id cartId
    return type : Map<Id,String>

    in this method it gets the Billing Address which is selected and returns it.
    */
    @AuraEnabled
    public static Map<Id,String> getBillingAddress(Id cartId){
        try {
            Map<Id,String> billingMap = new Map<Id,String>(); 
            List<WebCart> cartList = [SELECT AccountId FROM WebCart WHERE id=: cartId];
            Id accountId = cartList[0].AccountId;
            List<ContactPointAddress> result = [SELECT Id,Name,Address,AddressType,ParentId,IsDefault FROM ContactPointAddress WHERE ParentId =:accountId AND AddressType ='Billing'];
            for(ContactPointAddress c : result)
            {  
                Boolean isDefault = c.IsDefault;
                String isDefault1 = isDefault ? 'true' : 'false';
                String name = c.Name;
                String billingAddress = name+'/'+isDefault1;
                Id addressId = c.Id;
                String addressType= c.AddressType;               
                billingMap.put(addressId,billingAddress);

            }
           /* for(Id	key: billingMap.keyset())
            {
                String add = billingMap.get(key);
                System.debug(key +':'+add);
            }*/
            return billingMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /*     
     Method Name : createShipingAddress     
     Return Type : String
     In this method it creates the shipping address by taking the inputs from the user from LWC.  
    
    */

    @AuraEnabled
    public static String createShipingAddress(String name,String street,String city,String state, String country,
                                                String postalCode,Boolean isDefault,Boolean saveAddress,Id cartId ){
        try {
            String mssg ='not inserted';
            List<WebCart> cartList = [SELECT AccountId FROM WebCart WHERE id=: cartId];
            Id accountId = cartList[0].AccountId;
            if(name!=null && city != null && state != null && country != null && postalCode!=null && saveAddress == true)
            {

                ContactPointAddress address2=new ContactPointAddress();
                address2.Street=street;
                address2.City=city;
                address2.State=state;
                address2.Country=country;
                address2.PostalCode=postalCode;
                address2.IsDefault = isDefault;
                address2.Name = name;
                address2.ParentId=accountId;
                address2.AddressType='Shipping';
                insert address2;
                mssg = 'Inserted';
                
            }
            else if(name!=null && city != null && state != null && country != null && postalCode!=null && saveAddress == false)
            {
                mssg = 'Not Saved';
            }
            
            return mssg;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    /*     
     Method Name : updateBillingAddress     
     Return Type : String
     In this method it updates the billing contactpointaddress in the cart.  
    
    */
    
    @AuraEnabled
    public static String updateBillingAddress(Id cartId){
        try {
            List<WebCart> cartList = [SELECT AccountId FROM WebCart WHERE id=: cartId];
            Id accountId = cartList[0].AccountId;

            List<ContactPointAddress> billingAddress = [SELECT Street,City,State,Country,PostalCode FROM ContactPointAddress WHERE IsDefault = TRUE AND AddressType ='Billing' AND ParentId =:accountId];
            WebCart cart = [SELECT Id FROM WebCart WHERE Id=:cartId];
            cart.BillingStreet = billingAddress[0].Street;
            cart.BillingState = billingAddress[0].State;
            cart.BillingCity = billingAddress[0].City;
            cart.BillingCountry = billingAddress[0].Country;
            cart.BillingPostalCode = billingAddress[0].PostalCode;

            update cart;
            String carts = 'Updated BILLING Address ' + billingAddress[0].Street + billingAddress[0].State + billingAddress[0].City;
            return carts;

            
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

   /* @AuraEnabled
    public static string updatePaymentMethod(Id cartId ,String paymentType){
        try {
            String paymentMethod;

            WebCart cart = [SELECT Id FROM WebCart WHERE Id=:cartId];
            if(paymentType == 'CardPayment')
            {
                cart.PaymentMethodId ='Card Payment Method';
                paymentMethod = 'Credit Card';
                update cart;

            }
            else {
                cart.PaymentMethodId ='Purchase_Order';
                paymentMethod = 'Purchase Order';
                update cart;
            }
            
            
            return paymentMethod;

            
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }*/
}
