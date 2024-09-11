import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpageHomeComponent } from './userpage-home.component';

describe('UserpageHomeComponent', () => {
  let component: UserpageHomeComponent;
  let fixture: ComponentFixture<UserpageHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserpageHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserpageHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
