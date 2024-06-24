import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements AfterViewInit {
  ngAfterViewInit() {
    const imgs = document.getElementsByClassName('hover-image') as HTMLCollectionOf<HTMLImageElement>;
    const iconName = ["hamburger", "chips", "sandwich", "hotdog", "salad", "dessert", "beer", "chicken", "gluten-free"];
  
    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
  
      img.addEventListener('mouseenter', () => {
        const hoverSrc = img.getAttribute('src');
        if (hoverSrc) {
          img.src = hoverSrc;
          img.src = `../../../assets/icons/animate/gif/${iconName[i]}.gif`;
        }
      });
    }
  }
  
}
