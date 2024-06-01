import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SodukoGameComponent } from './soduko-game.component';

describe('SodukoGameComponent', () => {
  let component: SodukoGameComponent;
  let fixture: ComponentFixture<SodukoGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SodukoGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SodukoGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
