import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../common/product';
import {ActivatedRoute} from '@angular/router';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId = 1;
  previousCategoryId = 1;
  searchMode = false;

  // new properties for pagination
  thePageNumber = 1;
  thePageSize = 20;
  theTotalElements = 0;

  previousKeyword = null;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  private handleSearchProducts(): void {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // if different keyword set thePageNumber to 1
    if (this.previousKeyword !== theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    // search for products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                              theKeyword).subscribe(this.processResult());
  }

  handleListProducts(): void {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param and convert to number with a +
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      // default to 1
      this.currentCategoryId = 1;
    }

    //
    // Check if we have a different category id than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //


    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


    // get products for the given category id
    this.productService.getProductListPaginate(
      this.thePageNumber - 1,
              this.thePageSize,
              this.currentCategoryId).subscribe(this.processResult());
  }

  // tslint:disable-next-line:typedef
  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  // tslint:disable-next-line:typedef
  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  // tslint:disable-next-line:typedef
  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
