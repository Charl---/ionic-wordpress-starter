import {
  Component,
  Input,
  Output,
  OnInit,
  OnDestroy,
  EventEmitter,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { ControlGroup, FormBuilder } from '@angular/common';
import { Subscription } from 'rxjs/Rx';

export interface SearchWidgetOptions {
  class?: string;
  placeholder?: string;
  autofocus?: boolean;
}

@Component({
  selector: 'wp-search-widget',
  templateUrl: 'build/components/search-widget/search-widget.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchWidgetComponent implements OnInit, OnDestroy {
  searchForm: ControlGroup;
  searchSub: Subscription;
  @Input() query: string;
  @Input() options: SearchWidgetOptions;
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private elementRef: ElementRef,
    private formBuilder: FormBuilder
  ) { }

  private buildForm(value = ''): ControlGroup {
    return this.formBuilder.group({
      search: [value]
    });
  }

  ngOnInit(): void {
    this.searchForm = this.buildForm(this.query);

    this.searchSub = this.searchForm.valueChanges
      .debounceTime(1000)
      .map(form => form.search)
      .subscribe(search => this.onSearch.emit(search));

    if (this.options) {
      const form = this.elementRef.nativeElement.querySelector('form');
      const input = form.querySelector('ion-input');
      input.setAttribute('autofocus', this.options.autofocus);
      form.classList.add(this.options.class);
      if (this.options.placeholder)
        input.setAttribute('placeholder', this.options.placeholder);
    }
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }
}
