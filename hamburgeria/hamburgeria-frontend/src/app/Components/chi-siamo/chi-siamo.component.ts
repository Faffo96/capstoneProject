import { Component } from '@angular/core';

@Component({
  selector: 'app-chi-siamo',
  templateUrl: './chi-siamo.component.html',
  styleUrl: './chi-siamo.component.scss'
})
export class ChiSiamoComponent {
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
}
