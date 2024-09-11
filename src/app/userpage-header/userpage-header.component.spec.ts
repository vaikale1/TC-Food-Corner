import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpageHeaderComponent } from './userpage-header.component';

describe('UserpageHeaderComponent', () => {
  let component: UserpageHeaderComponent;
  let fixture: ComponentFixture<UserpageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserpageHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserpageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
