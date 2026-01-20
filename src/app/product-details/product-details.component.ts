import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService, Product } from '../product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  // product: Product | null = null;
  product: any;
  loading = true;
  // error: string | null = null;
  error: any;
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Id:', id);
    if (id) {
      this.productService.getProduct(id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.product = response.data;
            console.log('Product succeeded:', this.product);
            this.loading = false;
            this.cdr.detectChanges();
          } else {
            this.error = 'Failed to load product details.';
            console.log('Product Failed:', response.data);
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load product details. Please try again.';
          this.loading = false;
          console.error(err);
        },
      });
    }
  }

  nextImage(): void {
    if (this.product && this.currentImageIndex < this.product.imageUrls.length - 1) {
      this.currentImageIndex++;
    }
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  getStockStatus(): string {
    if (!this.product) return '';
    return this.product.stock < 5 ? 'Low Stock' : 'In Stock';
  }

  getStockClass(): string {
    if (!this.product) return '';
    return this.product.stock < 5 ? 'low-stock' : 'in-stock';
  }
}
