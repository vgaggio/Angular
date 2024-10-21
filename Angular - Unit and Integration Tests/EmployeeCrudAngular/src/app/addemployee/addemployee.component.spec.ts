import { TestBed, ComponentFixture } from '@angular/core/testing'; // Asegúrate de importar ComponentFixture
import { AddemployeeComponent } from './addemployee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // para simular observables
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Importar ToastrService para la simulación

describe('AddemployeeComponent', () => {
  let component: AddemployeeComponent;
  let fixture: ComponentFixture<AddemployeeComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AddemployeeComponent], // Importa el componente standalone aquí
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: 1 }), // simula el parámetro id en la URL
          },
        },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });

    fixture = TestBed.createComponent(AddemployeeComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(
      ToastrService
    ) as jasmine.SpyObj<ToastrService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error if name is less than 2 characters', () => {
    component.newEmployee.name = 'A A'; // nombre con partes de menos de 2 caracteres
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith(
      'Cada parte del nombre debe tener al menos dos caracteres.'
    );
  });

  it('should display error if name contains numbers', () => {
    component.newEmployee.name = 'John1 Doe';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith(
      'El nombre no puede contener números.'
    );
  });

  it('should display error if name exceeds 100 characters', () => {
    component.newEmployee.name = 'A'.repeat(101);
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith(
      'El nombre no puede exceder los 100 caracteres.'
    );
  });

  it('should display error if name is empty', () => {
    component.newEmployee.name = '';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith(
      'El nombre no puede estar vacío o compuesto solo de espacios.'
    );
  });

  it('should display error if name is just spaces', () => {
    component.newEmployee.name = '    ';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith(
      'El nombre no puede estar vacío o compuesto solo de espacios.'
    );
  });

  it('should not display errors for valid name', () => {
    component.newEmployee.name = 'John Doe';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).not.toHaveBeenCalled();
  });
});
