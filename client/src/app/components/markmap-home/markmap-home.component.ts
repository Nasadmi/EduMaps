import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MarkmapsHome } from '@dts/markmaps';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ionStar } from '@ng-icons/ionicons';

@Component({
  selector: 'app-markmap-home',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './markmap-home.component.html',
  styleUrl: './markmap-home.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [provideIcons({ ionStar })],
})
export class MarkmapHomeComponent {
  @Input({ required: true })
  markmaps!: MarkmapsHome;
}
