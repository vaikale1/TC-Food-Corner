import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [NgxPayPalModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{
  orderId: string | null = null;
  totalPrice: number | null = null;
  public payPalConfig?: IPayPalConfig;
  public showSuccess: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Retrieve query parameters
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      this.totalPrice = +params['totalPrice']; // Convert string to number
      this.initPayPalConfig();
    });
  }
  private initPayPalConfig(): void {
    this.payPalConfig = {
      currency: 'EUR', // Set currency based on your requirements
      clientId: 'sb', // Replace with your actual client ID in production
      createOrderOnClient: (): ICreateOrderRequest => ({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: this.totalPrice ? this.totalPrice.toString() : '0.00',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: this.totalPrice ? this.totalPrice.toString() : '0.00',
                }
              }
            },
            items: [
              {
                name: `Order ID: ${this.orderId}`, // Use order ID or item name
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: this.totalPrice ? this.totalPrice.toString() : '0.00',
                },
              }
            ]
          }
        ]
      }),
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - full order details: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - inform your server about completed transaction', data);
        this.showSuccess = true; // Show success message
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.error('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
