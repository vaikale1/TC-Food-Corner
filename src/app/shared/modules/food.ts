export interface Food{
    itemName:string;
    description:string;
    price:number;
    category:string;
    itemImage:string;
    itemId:number;
 }

 export interface CartItem{
  id?:number,
  itemName?:string;
  price?:number;
  itemId?:number;
  quantity?:number;
  itemImage?:string;
}
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}
export interface User {
  userId: number;
  email: string;
  password: string;
  fullName: string;
  phoneNo: string;
  accountType: 'CUSTOMER' | 'ADMIN';

}
export interface Order {
  orderId: number;        // ID of the order
  orderStatus: string;    // Status of the order (e.g., "Pending", "Completed")
  cartId: number;}
export interface OrderItem {
  id?: number;
  itemId?: number;
  quantity?: number;
  itemName?:string;
  price?:number;
  // Include other fields as necessary
}




