import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  isNavigating = false;
  constructor(private router: Router) {}
  ngAfterViewInit(): void {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const delay = el.getAttribute('data-delay') || '0s';
          el.style.transitionDelay = delay;

          if (entry.isIntersecting) {
            el.classList.add('show');
          } else {
            el.classList.remove('show'); // Remove class when out of view
          }
        });
      },
      {
        threshold: 0.2
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  login() {
    if (this.isNavigating) return;
    this.isNavigating = true;
    this.router.navigate(['/login']);
  }
}
