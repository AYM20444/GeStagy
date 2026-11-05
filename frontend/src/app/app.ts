import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AmbientBackgroundComponent } from './components/ambient-background/ambient-background.component';

@Component({
  imports: [RouterOutlet, NavbarComponent, AmbientBackgroundComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
