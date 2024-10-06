import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeakedCredentialsComponent } from './leaked-credentials.component';

describe('LeakedCredentialsComponent', () => {
  let component: LeakedCredentialsComponent;
  let fixture: ComponentFixture<LeakedCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeakedCredentialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeakedCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
