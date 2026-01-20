import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService, Product } from '../product.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  currentImageIndex = signal(0);

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No product ID provided.');
      this.loading.set(false);
      return;
    }

    console.log('Fetching product with ID:', id);

    this.productService.getProduct(id).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.product.set(response.data);
          console.log('Product loaded:', response.data);
          this.currentImageIndex.set(0); // reset to first image
          this.loading.set(false);
        } else {
          this.error.set('Product not found or invalid response.');
          console.log('invalid response:', response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.error.set('Failed to load product details. Please try again later.');
        this.loading.set(false);
      },
    });
  }

  nextImage(): void {
    const prod = this.product();
    if (prod && this.currentImageIndex() < prod.imageUrls.length - 1) {
      this.currentImageIndex.update((i) => i + 1);
    }
  }

  prevImage(): void {
    if (this.currentImageIndex() > 0) {
      this.currentImageIndex.update((i) => i - 1);
    }
  }

  goToImage(index: number): void {
    const prod = this.product();
    if (prod && index >= 0 && index < prod.imageUrls.length) {
      this.currentImageIndex.set(index);
    }
  }

  getStockStatus(): string {
    const prod = this.product();
    if (!prod) return '';
    return prod.stock < 5 ? 'Low Stock' : 'In Stock';
  }

  getStockClass(): string {
    const prod = this.product();
    if (!prod) return '';
    return prod.stock < 5 ? 'low-stock' : 'in-stock';
  }
}
