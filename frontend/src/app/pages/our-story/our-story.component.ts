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
            <img [src]="section.image" [alt]="section.title" loading="lazy" />
          </div>
        </section>
      </div>
      <div class="founder-section">
        <div class="founder-inner">
          <div class="founder-image">
            <img src="/assets/images/about/founder.jpg" alt="Amar Ramesh — Photographer, Author & Founder" />
          </div>
          <div class="founder-text">
            <h2>Amar Ramesh</h2>
            <p class="founder-role">Photographer, Author & Founder</p>
            <p class="founder-bio">Artist & Multipotentialite — documenting the untold tales of South India, preserved in pages. Creator of MOGAPPU, Pudhu Mandapam, Kolli Kannu, and more.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .story-page { padding-top: var(--header-height); }
    .story-header { text-align: center; padding: 80px 24px 60px; background: var(--color-gray-100);
      h1 { font-size: clamp(2.5rem, 6vw, 4rem); margin-bottom: 12px; }
      .story-tagline { font-size: 18px; color: var(--color-gray-700); letter-spacing: 2px; text-transform: uppercase; }
    }
    .story-content { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .story-section { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; padding: 80px 0; align-items: center;
      border-bottom: 1px solid var(--color-gray-200);
      &:last-child { border-bottom: none; }
      &.reverse { direction: rtl; > * { direction: ltr; } }
    }
    .section-text {
      h2 { font-size: 2rem; margin-bottom: 20px; color: var(--color-gold); }
      p { font-size: 16px; line-height: 1.9; color: var(--color-gray-700); }
    }
    .section-visual {
      overflow: hidden;
      img {
        width: 100%; height: auto; display: block;
        transition: transform 0.6s ease;
        &:hover { transform: scale(1.03); }
      }
    }
    .founder-section {
      background: var(--color-dark); color: var(--color-white); padding: 80px 24px;
    }
    .founder-inner {
      max-width: 1000px; margin: 0 auto;
      display: grid; grid-template-columns: 300px 1fr; gap: 60px; align-items: center;
    }
    .founder-image {
      img {
        width: 100%; height: auto; display: block;
        border: 3px solid var(--color-gold);
      }
    }
    .founder-text {
      h2 { font-size: 2.5rem; margin-bottom: 8px; }
      .founder-role { font-size: 18px; color: var(--color-gold); margin-bottom: 20px; letter-spacing: 1px; }
      .founder-bio { font-size: 16px; line-height: 1.8; color: var(--color-gray-400); }
    }
    @media (max-width: 768px) {
      .story-section { grid-template-columns: 1fr; gap: 32px; padding: 40px 0; &.reverse { direction: ltr; } }
      .founder-inner { grid-template-columns: 1fr; text-align: center; gap: 32px; }
      .founder-image { max-width: 250px; margin: 0 auto; }
    }
  `]
})
export class OurStoryComponent implements OnInit {
  sections: AboutSection[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getAboutSections().subscribe(s => this.sections = s); }
}
