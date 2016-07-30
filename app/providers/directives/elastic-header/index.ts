import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[elasticHeader]'
})
export class ElasticHeaderDirective implements OnInit {
  ticking: boolean = false;
  translateAmt: number = null;
  scaleAmt: number = null;
  scrollTop: number = null;
  lastScrollTop: number = null;
  headerHeight: number;
  scrollerHandle: HTMLElement;
  header: HTMLElement;
  title: HTMLElement;
  constructor(
    private element: ElementRef
  ) { }

  ngOnInit() {
    this.scrollerHandle = this.element.nativeElement.children[0];
    this.header = this.element.nativeElement.querySelector('ion-card img');
    this.headerHeight = this.scrollerHandle.clientHeight;
    this.header.style.webkitTransformOrigin = 'center bottom';

    this.title = this.element.nativeElement.querySelector('ion-card .card-title');
    window.addEventListener('resize', () => {
      console.log('resize', this.scrollerHandle.clientHeight)
      this.headerHeight = this.scrollerHandle.clientHeight;
    }, false);

    this.scrollerHandle.addEventListener('scroll', () => {
      console.log('scroll')
      if (!this.ticking) {
        console.log('no ticking')
        window.requestAnimationFrame(this.updateElasticHeader.bind(this));
      }

      this.ticking = true;

    });

  }

  private updateElasticHeader() {
    this.scrollTop = this.scrollerHandle.scrollTop;
    if (this.scrollTop >= 0) {
      this.translateAmt = this.scrollTop / 2;
      this.scaleAmt = 1;
    } else {
      this.translateAmt = 0;
      this.scaleAmt = -this.scrollTop / this.headerHeight + 1;
    }
    this.header.style.webkitTransform = 'translate3d(0,' + this.translateAmt + 'px,0) scale(' + this.scaleAmt + ',' + this.scaleAmt + ')';
    this.updateTitle();
    this.ticking = false;
  }

  private updateTitle() {
    this.scrollTop > 80
      ? this.title.classList.add('fixed-title')
      : this.title.classList.remove('fixed-title')
  }

}
