import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('jumbotron') jumbotron!: ElementRef;

  feedbacks: string[] = [
    '../../../assets/img/recensione1.png',
    '../../../assets/img/recensione2.png',
    '../../../assets/img/recensione3.png'
  ];
 
  ourBurgersPosts = [
    {
      description: "Benvenuti nel cuore della città! Il nostro ristorante, accogliente e dal design curato, vi offre una deliziosa selezione di hamburger: Black Angus argentino, Fassona piemontese, Pollo, Chianina toscana e Cinghiale. Venite a trovarci per un'esperienza gustosa e rilassante!",
      photoUrl: "../../../assets/img/hamburger1.png"
    },
    {
      description: "La particolarità sta nella totale personalizzazione dell’hamburger: partendo dal taglio di carne che preferisce, il cliente scatena la propria fantasia, combinando tra loro i vari condimenti, per creare il panino dei suoi sogni!",
      photoUrl: "../../../assets/img/hamburger2.jpg"
    },
    {
      description: ' Il risultato è quello di un hamburger che valorizza a pieno le straordinarie risorse gastronomiche del territorio italiano. Una fantastica unione tra made in Italy e Stati Uniti.',
      photoUrl: "../../../assets/img/hamburger3.jpg"
    },
    {
      description: 'Il nostro obiettivo è quello di garantire un servizio eccellente, non solo attraverso i nostri prodotti, ma anche nell’accoglienza, grazie ad uno staff formato, cordiale e sempre a disposizione del cliente. L’HamburgeriaRC è ormai un punto di riferimento fisso a Reggio Calabria, un luogo di incontro, dove mangiare buoni hamburger, tra musica e sorrisi.',
      photoUrl: "../../../assets/img/Screenshot2024-06-25020842.png"
    },
  ];

  othersPosts1 = [
    {
      name: "Burgers",
      description: "I nostri hamburger sono preparati con le migliori carni: Black Angus argentino, Fassona piemontese, Pollo, Chianina toscana e Cinghiale. Ogni morso è una scoperta di sapori autentici e succulenti. Venite a gustare le nostre specialità e trovate il vostro preferito!",
      photoUrl: "../../../assets/img/hamburger2.jpg"
    },
    {
      name: "Sandwich",
      description: ", I nostri sandwich sono preparati con ingredienti freschi e tanto amore. Scoprite le nostre deliziose combinazioni, dai classici ai più originali. Ce n'è per tutti i gusti! Venite a provarli e lasciatevi conquistare!",
      photoUrl: "../../../assets/img/sandwich.jpg"
    },
    {
      name: "Insalatone",
      description: "Le nostre insalatone sono fresche, colorate e piene di gusto! Prepariamo ogni piatto con ingredienti di qualità, combinando sapori unici per un'esperienza leggera e deliziosa. Venite a scoprire le nostre creazioni e trovate la vostra insalatona preferita!",
      photoUrl: "../../../assets/img/salad.jpg"
    },
  ];

  othersPosts2 = [
    {
      name: "Fritture",
      description: "Le nostre fritture sono irresistibili e croccanti! Prepariamo ogni piatto con ingredienti freschi e di qualità per offrirvi un'esperienza di gusto unica. Perfette per condividere o per uno sfizio personale. Venite a provarle e lasciatevi tentare!",
      photoUrl: "../../../assets/img/frittura.png"
    },
    {
      name: "Hot-Dog",
      description: "I nostri hot dog sono un'esplosione di gusto! Preparati con salsicce di alta qualità e arricchiti con ingredienti freschi e saporiti, sono perfetti per ogni occasione. Venite a provarli e scoprite il vostro preferito!",
      photoUrl: "../../../assets/img/hotdog.jpg"
    },
    {
      name: "Dolci",
      description: "I nostri dolci sono un'esplosione di creatività e bontà! Preparati con ingredienti particolari e arricchiti con snack e biscotti, sono perfetti per chi ama le golosità uniche.",
      photoUrl: "../../../assets/img/dessert.jpg"
    },
  ];

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;

  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (
      this.unpauseOnArrow &&
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || NgbSlideEventSource.ARROW_RIGHT)
    ) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

  ngAfterViewInit() {
    const scrollRevealConfig = {
      distance: '-100px',
      duration: 1000,
      easing: 'ease-in-out',
      reset: false  // L'animazione si attiva solo una volta
    };

    ScrollReveal().reveal('.fade-in-left', {
      ...scrollRevealConfig,
      origin: 'left'
    });

    ScrollReveal().reveal('.fade-in-right', {
      ...scrollRevealConfig,
      origin: 'right'
    });

    this.setupScrollAnimation();
  }

  setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.jumbotron.nativeElement.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(this.jumbotron.nativeElement);
  }
}