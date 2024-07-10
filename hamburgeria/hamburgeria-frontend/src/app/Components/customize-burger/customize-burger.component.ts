import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CustomizableProductService } from '../../Services/customizable-product.service';
import { CustomizableProductDTO } from '../../models/customizable-product-dto';
import { ProductService } from '../../Services/product.service';
import { ErrorService } from '../../Services/error-service.service';

@Component({
    selector: 'app-customize-burger',
    templateUrl: './customize-burger.component.html',
    styleUrls: ['./customize-burger.component.scss']
  })
  export class CustomizeBurgerComponent implements OnInit {
    menuProducts: Product[] = [];
    selectedProducts: Product[] = [];
    sections: { name: string, products: Product[] }[] = [
        { name: 'Pane', products: [] },
        { name: 'Hamburger', products: [] },
        { name: 'Verdure', products: [] },
        { name: 'Formaggi', products: [] },
        { name: 'Salse', products: [] },
        { name: 'Varie', products: [] }
    ];

    constructor(
        private productService: ProductService,
        private customizableProductService: CustomizableProductService,
        private errorService: ErrorService
    ) {
        this.productService.products$.subscribe(data => {
            this.menuProducts = data;
            this.loadCategories();
        });
    }

    ngOnInit(): void {
        this.productService.getProducts().subscribe(data => {
            this.productService.setProducts(data);
        });
    }

    loadCategories() {
        this.sections.forEach(section => section.products = []); // Reset sections

        for (let product of this.menuProducts) {
            switch (product.category) {
                case 'CUSTOMHAM_MEAT':
                    this.sections.find(section => section.name === 'Hamburger')?.products.push(product);
                    break;
                case 'CUSTOMHAM_BREAD':
                    this.sections.find(section => section.name === 'Pane')?.products.push(product);
                    break;
                case 'CUSTOMHAM_CHEESE':
                    this.sections.find(section => section.name === 'Formaggi')?.products.push(product);
                    break;
                case 'CUSTOMHAM_VEGETABLE':
                    this.sections.find(section => section.name === 'Verdure')?.products.push(product);
                    break;
                case 'CUSTOMHAM_SAUCE':
                    this.sections.find(section => section.name === 'Salse')?.products.push(product);
                    break;
                case 'CUSTOMHAM_OTHER':
                    this.sections.find(section => section.name === 'Varie')?.products.push(product);
                    break;
                default:
                    break;
            }
        }
    }

    toggleProductSelection(product: Product) {
        if (product.category === 'CUSTOMHAM_BREAD') {
            this.removeBread();
        } else if (product.category === 'CUSTOMHAM_MEAT') {
            this.removeMeat();
        }

        this.selectedProducts.push(product);
        this.productService.setSelectedProducts(this.selectedProducts);
        console.log('Selected products:', this.selectedProducts.map(p => p.id));
    }

    removeBread() {
        this.selectedProducts = this.selectedProducts.filter(product => product.category !== 'CUSTOMHAM_BREAD');
    }

    removeMeat() {
        this.selectedProducts = this.selectedProducts.filter(product => product.category !== 'CUSTOMHAM_MEAT');
    }

    isSelected(product: Product): boolean {
        return this.selectedProducts.some(p => p.id === product.id);
    }

    isSelectionDisabled(sectionName: string, product: Product): boolean {
        if (sectionName === 'Pane') {
            return false;
        } else if (sectionName === 'Hamburger') {
            return !this.isBreadSelected();
        } else {
            return !this.isBreadSelected() || !this.isMeatSelected();
        }
    }

    isBreadSelected(): boolean {
        return this.selectedProducts.some(p => p.category === 'CUSTOMHAM_BREAD');
    }

    isMeatSelected(): boolean {
        return this.selectedProducts.some(p => p.category === 'CUSTOMHAM_MEAT');
    }

    resetSelections() {
        this.selectedProducts = [];
        this.productService.setSelectedProducts(this.selectedProducts);
        console.log('Selections reset');
    }

    createCustomizableBurger() {
        if (this.selectedProducts.length < 2) {
            this.errorService.showMenuSectionsError('Per favore, seleziona almeno il pane e la carne.');
            return;
        }

        const customizableProduct: CustomizableProductDTO = {
            id: 0,
            italianName: 'Burger Personalizzato',
            englishName: 'Burger',
            italianDescription: '',
            englishDescription: '',
            price: this.selectedProducts.reduce((sum, product) => sum + product.price, 0),
            category: "CUSTOM_BURGER",
            available: true,
            productList: this.selectedProducts.map(product => product.id)
        };

        this.customizableProductService.createCustomizableProduct(customizableProduct).subscribe(response => {
            console.log('Customizable Burger created:', response);
            this.productService.showTopBreadSubject.next(true);
            setTimeout(() => {
                this.productService.setCartProducts([...this.productService.getCartProductsValue(), response]);
                this.errorService.showErrorModal('✅ Burger aggiunto', 'Burger aggiunto al carrello');
                this.resetSelections();
                this.productService.showTopBreadSubject.next(false); // Imposta showTopBread su false dopo l'animazione
            }, 2000);
        });
    }
}