import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductsService } from '../../services/products.service';
import { ProductResponse } from '../../models/product-response';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatToolbarModule, RouterModule, MatCardModule, MatOptionModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {
  editProductForm: FormGroup;

  constructor(private fb: FormBuilder, public usersService: UsersService, private productsService: ProductsService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.editProductForm = this.fb.group({
      productid: ['', Validators.required],
      productname: ['', [Validators.required]],
      category: ['', [Validators.required]],
      unitprice: [''],
      quantityinstock: [''],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      var productid = params['productid']; // Replace with your actual parameter name

      this.productsService.getProductByProductID(productid).subscribe({
        next: (response: ProductResponse) => {
          this.editProductForm.setValue({
            productid: response.productid,
            productname: response.productname,
            category: response.category,
            unitprice: response.unitprice,
            quantityinstock: response.quantityinstock
          });
        },

        error: (err) => {
          console.log(err);
        }
      });
    });
  }

  update(): void {
    if (this.editProductForm.valid) {
      const editProduct = this.editProductForm.value;
      this.productsService.updateProduct(editProduct).subscribe({
        next: (response: ProductResponse) => {
          if (response)
            this.router.navigate(['admin', 'products']);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }

  get productIDFormControl(): FormControl {
    return this.editProductForm.get('productid') as FormControl;
  }

  get productNameFormControl(): FormControl {
    return this.editProductForm.get('productname') as FormControl;
  }

  get categoryFormControl(): FormControl {
    return this.editProductForm.get('category') as FormControl;
  }

  get unitPriceFormControl(): FormControl {
    return this.editProductForm.get('unitprice') as FormControl;
  }

  get quantityInStockFormControl(): FormControl {
    return this.editProductForm.get('quantityinstock') as FormControl;
  }
}
