import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AboutSection } from '../../models/interfaces';

@Component({
  selector: 'app-our-story',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="story-page">
      <div class="story-header">
        <h1>Our Story</h1>
        <p class="story-tagline">Premium Coffee Table Books on Indian Heritage</p>
      </div>
      <div class="story-content">
        <section *ngFor="let section of sections; let odd = odd" class="story-section" [class.reverse]="odd">
          <div class="section-text">
            <h2>{{ section.title }}</h2>
            <p>{{ section.content }}</p>
          </div>
          <div class="section-visual">
            <div class="visual-placeholder">
              <span class="visual-letter">{{ section.title.charAt(0) }}</span>
            </div>
          </div>
        </section>
      </div>
      <div class="founder-section">
        <div class="container">
          <h2>Amar Ramesh</h2>
          <p>Photographer, Author & Founder of Mara Labs</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .story-page { padding-top: var(--header-height); }
    .story-header { text-align: center; padding: 80px 24px 60px; background: var(--color-gray-100);
      h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 12px; }
      .story-tagline { font-size: 18px; color: var(--color-gray-700); }
    }
    .story-content { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .story-section { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; padding: 80px 0; align-items: center;
      &.reverse { direction: rtl; > * { direction: ltr; } }
    }
    .section-text {
      h2 { font-size: 2rem; margin-bottom: 20px; color: var(--color-gold); }
      p { font-size: 16px; line-height: 1.9; color: var(--color-gray-700); }
    }
    .visual-placeholder { aspect-ratio: 1; background: var(--color-dark); display: flex; align-items: center; justify-content: center; }
    .visual-letter { font-family: var(--font-heading); font-size: 120px; font-weight: 900; color: var(--color-gold); opacity: 0.3; }
    .founder-section { text-align: center; background: var(--color-dark); color: var(--color-white); padding: 80px 24px;
      h2 { font-size: 2rem; margin-bottom: 12px; }
      p { color: var(--color-gray-500); font-size: 16px; }
    }
    @media (max-width: 768px) {
      .story-section { grid-template-columns: 1fr; gap: 32px; padding: 40px 0; &.reverse { direction: ltr; } }
    }
  `]
})
export class OurStoryComponent implements OnInit {
  sections: AboutSection[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getAboutSections().subscribe(s => this.sections = s); }
}
