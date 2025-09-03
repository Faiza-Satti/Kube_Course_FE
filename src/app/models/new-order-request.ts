import { NewOrderItemRequest } from "./new-order-item-request";

export interface NewOrderRequest {
    userId: string;
    orderDate: Date;
    orderItems: NewOrderItemRequest[];
}
