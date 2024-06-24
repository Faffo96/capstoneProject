import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  ngAfterViewInit() {
    const imgs = document.getElementsByClassName('hover-image') as HTMLCollectionOf<HTMLImageElement>;
    const iconName = ["chips", "hamburger", "chicken", "beer", "salad", "dessert", "hotdog", "gluten-free", "sandwich"];
  
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
