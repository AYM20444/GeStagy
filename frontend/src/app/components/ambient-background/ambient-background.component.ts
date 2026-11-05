import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface AmbientNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
}

@Component({
  selector: 'app-ambient-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <!-- Volumetric Aurora Glow Orbs -->
      <div class="ambient-orb ambient-orb-primary"></div>
      <div class="ambient-orb ambient-orb-secondary"></div>
      <div class="ambient-orb ambient-orb-tertiary"></div>

      <!-- Subtle Perspective Cyber Grid -->
      <div class="ambient-cyber-grid"></div>

      <!-- Interactive 60FPS Particle Constellation Canvas -->
      <canvas #meshCanvas class="w-full h-full block opacity-75"></canvas>
    </div>
  `
})
export class AmbientBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('meshCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private nodes: AmbientNode[] = [];
  private rafId: number | null = null;
  private mouse = { x: -1000, y: -1000, active: false };
  private width = 1440;
  private height = 900;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    this.initNodes();
    this.animate();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
    this.initNodes();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.active = true;
  }

  @HostListener('window:mouseleave')
  onMouseLeave(): void {
    this.mouse.active = false;
  }

  private resizeCanvas(): void {
    if (typeof window === 'undefined') return;
    const canvas = this.canvasRef.nativeElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width;
    canvas.height = this.height;
  }

  private initNodes(): void {
    const count = Math.min(Math.max(Math.floor((this.width * this.height) / 24000), 28), 65);
    this.nodes = Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 1.1,
      pulsePhase: Math.random() * Math.PI * 2
    }));
  }

  private getThemeRgb(): { r: number; g: number; b: number; sr: number; sg: number; sb: number } {
    if (typeof document === 'undefined') {
      return { r: 0, g: 240, b: 255, sr: 0, sg: 102, sb: 255 };
    }
    const theme = document.documentElement.getAttribute('data-theme') || 'cyan';
    if (theme === 'violet') {
      return { r: 184, g: 41, b: 255, sr: 255, sg: 41, sb: 117 };
    }
    if (theme === 'emerald') {
      return { r: 0, g: 255, b: 157, sr: 16, sg: 185, sb: 129 };
    }
    // Default Option A: Cyber Cyan (#00F0FF) & Electric Blue (#0066FF)
    return { r: 0, g: 240, b: 255, sr: 0, sg: 102, sb: 255 };
  }

  private animate = (): void => {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const { r, g, b, sr, sg, sb } = this.getThemeRgb();

    // Update & draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      n.pulsePhase += 0.025;

      // Wrap around screen edges smoothly
      if (n.x < 0) n.x = this.width;
      if (n.x > this.width) n.x = 0;
      if (n.y < 0) n.y = this.height;
      if (n.y > this.height) n.y = 0;

      // Subtle magnetic cursor interaction
      if (this.mouse.active) {
        const dx = this.mouse.x - n.x;
        const dy = this.mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180 && dist > 1) {
          const force = (180 - dist) / 180;
          n.x += (dx / dist) * force * 0.65;
          n.y += (dy / dist) * force * 0.65;

          // Draw energy filament to cursor
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(this.mouse.x, this.mouse.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(force * 0.35).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw glowing node
      const alpha = 0.45 + Math.sin(n.pulsePhase) * 0.25;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect nearby nodes
      for (let j = i + 1; j < this.nodes.length; j++) {
        const m = this.nodes[j];
        const dx = n.x - m.x;
        const dy = n.y - m.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 135) {
          const lineAlpha = (1 - dist / 135) * 0.16;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${lineAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    this.rafId = requestAnimationFrame(this.animate);
  };

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

