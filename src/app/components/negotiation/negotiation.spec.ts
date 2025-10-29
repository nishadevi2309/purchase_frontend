import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotiationComponent } from './negotiation';

describe('NegotiationComponent', () => {
  let component: NegotiationComponent;
  let fixture: ComponentFixture<NegotiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NegotiationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NegotiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
