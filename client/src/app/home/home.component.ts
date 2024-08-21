import { Component, OnInit } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MarkmapsHome } from '@dts/markmaps';
import { MarkmapHomeComponent } from '@components/markmap-home/markmap-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MarkmapHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  allMarkmaps: MarkmapsHome[] = [];
  error: string | null = null;
  constructor(private readonly httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.getAllMarkmaps().subscribe({
      next: (markmaps) => {
        this.allMarkmaps = markmaps;
      },

      error: (error) => {
        this.error =
          'Something went wrong, please restart the page or try again later.';
      },
    });
  }
}
