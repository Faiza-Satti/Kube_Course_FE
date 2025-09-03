import { Injectable, booleanAttribute } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { CartItem } from '../models/cart-item';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/order-response';
import { NewOrderRequest } from '../models/new-order-request';
import { UsersService } from './users.service';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private ordersAPIURL: string = environment.ordersAPIURL;
    private cart: CartItem[] = [];

    constructor(private http: HttpClient, private usersService: UsersService) {
    }

    addCartItem(cartItem: CartItem): void {
        var isFound: boolean = false;
        this.cart = this.cart.map(item => {
            //console.log(item.productid, cartItem.productid, item.productid == cartItem.productid);
            if (item.productid == cartItem.productid) {
                item.quantity++;
                isFound = true;
            }
            return item;
        });

        //console.log(cartItem, isFound);
        if (!isFound) {
            cartItem.quantity = 1;
            this.cart.push(cartItem);
        }
    }

    removeCartItem(productid: string): void {
        var shouldRemoveItem: boolean = false;

        //console.log(this.cart, productid);

        this.cart = this.cart.map(item => {
            if (item.productid == productid) {
                if (item.quantity > 1)
                    item.quantity--;
                else
                    shouldRemoveItem = true;
            }
            return item;
        });

        //console.log(this.cart, productid, shouldRemoveItem);

        if (shouldRemoveItem) {
            this.cart = this.cart.filter(item => {
                return item.productid != productid;
            })
        }
    }

    clearCartItems(): void {
        this.cart = [];
    }

    getCartItems(): CartItem[] {
        return this.cart;
    }

    newOrder(): Observable<OrderResponse> {
        var newOrderRequest: NewOrderRequest = {
            userID: this.usersService.authResponse?.userID!,
            orderDate: new Date(),
            orderItems: []
        };
        this.cart.forEach(cartItem => {
            newOrderRequest.orderItems.push({
                productid: cartItem.productid,
                unitprice: cartItem.unitprice,
                quantity: cartItem.quantity
            });
        });

        return this.http.post<OrderResponse>(`${this.ordersAPIURL}`, newOrderRequest);
    }

    getOrdersByUserID(userID: string): Observable<OrderResponse[]> {
        return this.http.get<OrderResponse[]>(`${this.ordersAPIURL}search/userid/${userID}`);
    }

    getOrders(): Observable<OrderResponse[]> {
        return this.http.get<OrderResponse[]>(`${this.ordersAPIURL}`);
    }
}
