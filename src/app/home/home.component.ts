import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../product.service';
import { signal } from '@angular/core'; // ← أضف هذا الـ import

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // حوّل الـ properties إلى signals
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.products.set(response.data); // ← set() يحدث الـ signal ويطلق change detection تلقائيًا
          console.log('Products succeeded:', this.products());
        } else {
          this.error.set('Failed to load products.');
          console.log('Products Failed:', response.data);
        }
        this.loading.set(false); // ← set() هنا يكفي لتحديث الـ view
      },
      error: (err) => {
        this.error.set('Failed to load products. Please try again.');
        console.log('Failed to load products. Please try again.', err);
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
