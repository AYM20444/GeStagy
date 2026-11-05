import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges
} from '@angular/core';

/**
 * 1. [tilt3d] Directive
 * Applies real-time 3D perspective tilt (rotateX / rotateY / scale3d) based on cursor X/Y offset
 * with spring physics interpolation and a dynamic radial glare highlight following the cursor.
 */
@Directive({
  selector: '[tilt3d]',
  standalone: true
})
export class Tilt3dDirective implements OnInit, OnDestroy {
  @Input() tiltMaxAngle = 8;
  @Input() tiltScale = 1.02;

  private targetRotateX = 0;
  private targetRotateY = 0;
  private currentRotateX = 0;
  private currentRotateY = 0;
  private currentScale = 1;
  private targetScale = 1;
  private isHovered = false;
  private rafId: number | null = null;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const nativeEl = this.el.nativeElement;
    this.renderer.addClass(nativeEl, 'tilt-3d-surface');
    this.renderer.setStyle(nativeEl, 'transformStyle', 'preserve-3d');
    this.renderer.setStyle(nativeEl, 'willChange', 'transform');
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.isHovered = true;
    this.targetScale = this.tiltScale;
    this.startSpringLoop();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Normalized -1 to +1
    const normX = (x - centerX) / (centerX || 1);
    const normY = (y - centerY) / (centerY || 1);

    this.targetRotateX = -normY * this.tiltMaxAngle;
    this.targetRotateY = normX * this.tiltMaxAngle;

    // Set cursor coordinates for dynamic radial glare & border shimmer
    this.el.nativeElement.style.setProperty('--mouse-x', `${x}px`);
    this.el.nativeElement.style.setProperty('--mouse-y', `${y}px`);
    this.el.nativeElement.style.setProperty('--glare-opacity', '1');
    this.startSpringLoop();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isHovered = false;
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    this.targetScale = 1;
    this.el.nativeElement.style.setProperty('--glare-opacity', '0');
    this.startSpringLoop();
  }

  private startSpringLoop(): void {
    if (this.rafId !== null) return;
    const step = () => {
      const stiffness = 0.16;
      this.currentRotateX += (this.targetRotateX - this.currentRotateX) * stiffness;
      this.currentRotateY += (this.targetRotateY - this.currentRotateY) * stiffness;
      this.currentScale += (this.targetScale - this.currentScale) * stiffness;

      this.el.nativeElement.style.transform =
        `perspective(1000px) rotateX(${this.currentRotateX.toFixed(2)}deg) rotateY(${this.currentRotateY.toFixed(2)}deg) scale3d(${this.currentScale.toFixed(3)}, ${this.currentScale.toFixed(3)}, ${this.currentScale.toFixed(3)})`;

      const settled =
        !this.isHovered &&
        Math.abs(this.currentRotateX) < 0.05 &&
        Math.abs(this.currentRotateY) < 0.05 &&
        Math.abs(this.currentScale - 1) < 0.002;

      if (settled) {
        this.el.nativeElement.style.transform =
          'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        this.rafId = null;
      } else {
        this.rafId = requestAnimationFrame(step);
      }
    };
    this.rafId = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

/**
 * 2. [magneticBtn] Directive
 * Implements magnetic cursor attraction, dynamic cursor-direction border shimmer,
 * 3D bevel lighting, and tactile spring press-down displacement.
 */
@Directive({
  selector: '[magneticBtn]',
  standalone: true
})
export class MagneticButtonDirective implements OnInit, OnDestroy {
  @Input() magneticStrength = 0.28;

  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private pressOffsetZ = 0;
  private targetPressZ = 0;
  private isActive = false;
  private rafId: number | null = null;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'magnetic-3d-btn');
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.isActive = true;
    this.startLoop();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const relX = event.clientX - rect.left;
    const relY = event.clientY - rect.top;
    const deltaX = relX - rect.width / 2;
    const deltaY = relY - rect.height / 2;

    this.targetX = deltaX * this.magneticStrength;
    this.targetY = deltaY * this.magneticStrength;

    this.el.nativeElement.style.setProperty('--btn-x', `${relX}px`);
    this.el.nativeElement.style.setProperty('--btn-y', `${relY}px`);
    this.startLoop();
  }

  @HostListener('mousedown')
  onMouseDown(): void {
    this.targetPressZ = 1;
    this.startLoop();
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    this.targetPressZ = 0;
    this.startLoop();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isActive = false;
    this.targetX = 0;
    this.targetY = 0;
    this.targetPressZ = 0;
    this.startLoop();
  }

  private startLoop(): void {
    if (this.rafId !== null) return;
    const animate = () => {
      const spring = 0.22;
      this.currentX += (this.targetX - this.currentX) * spring;
      this.currentY += (this.targetY - this.currentY) * spring;
      this.pressOffsetZ += (this.targetPressZ - this.pressOffsetZ) * 0.35;

      const pressY = this.pressOffsetZ * 3.5;
      const scale = 1 - this.pressOffsetZ * 0.04;

      this.el.nativeElement.style.transform =
        `translate3d(${this.currentX.toFixed(2)}px, ${(this.currentY + pressY).toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;

      const settled =
        !this.isActive &&
        Math.abs(this.currentX) < 0.08 &&
        Math.abs(this.currentY) < 0.08 &&
        Math.abs(this.pressOffsetZ) < 0.01;

      if (settled) {
        this.el.nativeElement.style.transform = 'translate3d(0px, 0px, 0px) scale(1)';
        this.rafId = null;
      } else {
        this.rafId = requestAnimationFrame(animate);
      }
    };
    this.rafId = requestAnimationFrame(animate);
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

/**
 * 3. [countUp] Directive
 * Animates numerical telemetry counters from 0 to target value using ease-out cubic physics.
 */
@Directive({
  selector: '[countUp]',
  standalone: true
})
export class CountUpDirective implements OnChanges, OnDestroy {
  @Input('countUp') targetValue = 0;
  @Input() countSuffix = '';
  @Input() countDecimals = 0;
  @Input() countDuration = 1100;

  private rafId: number | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['targetValue']) {
      this.animateCount();
    }
  }

  private animateCount(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    const endValue = Number(this.targetValue) || 0;
    const startTime = performance.now();
    const duration = this.countDuration;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = endValue * eased;

      const formatted =
        this.countDecimals > 0
          ? current.toFixed(this.countDecimals)
          : Math.round(current).toString();

      this.el.nativeElement.textContent = `${formatted}${this.countSuffix}`;

      if (progress < 1) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        const finalFormatted =
          this.countDecimals > 0 ? endValue.toFixed(this.countDecimals) : Math.round(endValue).toString();
        this.el.nativeElement.textContent = `${finalFormatted}${this.countSuffix}`;
        this.rafId = null;
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

/**
 * 4. [revealOnScroll] Directive
 * Smoothly reveals components entering the viewport with 3D depth motion.
 */
@Directive({
  selector: '[revealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;
  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const node = this.el.nativeElement;
    this.renderer.addClass(node, 'reveal-3d-init');
    if (this.revealDelay > 0) {
      node.style.transitionDelay = `${this.revealDelay}ms`;
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.renderer.addClass(node, 'reveal-3d-visible');
              this.observer?.unobserve(node);
            }
          });
        },
        { threshold: 0.08 }
      );
      this.observer.observe(node);
    } else {
      this.renderer.addClass(node, 'reveal-3d-visible');
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

