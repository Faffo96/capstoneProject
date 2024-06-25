import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  ngAfterViewInit() {
    const imgs = document.getElementsByClassName('hover-image') as HTMLCollectionOf<HTMLImageElement>;
    const divs = document.getElementsByClassName('cta-h3') as HTMLCollectionOf<HTMLDivElement>;
    const iconName = ["cart", "dining-table"];


    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];

      const div = divs[i];
      div.addEventListener('mouseenter', () => {
        const hoverSrc = img.getAttribute('src');
        if (hoverSrc) {
          img.src = hoverSrc;
          img.src = `../../../assets/icons/animate/gif/${iconName[i]}.gif`;
        }
      });
    }
  }
}
