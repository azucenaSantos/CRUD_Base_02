import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { SafeHtml } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextInputComponent } from '../_forms/text-input/text-input.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {
  @ViewChild('lista') datagrid!: DxDataGridComponent; //acceso al componente del data-grid

  @ViewChild('inputFocus') inputFocus!: TextInputComponent;

  registerForm: FormGroup = new FormGroup({});

  editOnkeyPress = true;

  enterKeyAction: DxDataGridTypes.EnterKeyAction = 'startEdit';

  enterKeyDirection: DxDataGridTypes.EnterKeyDirection = 'row';

  taskSubject: string = '';

  taskDetailsHtml: SafeHtml | undefined;

  taskStatus: string = '';

  taskProgress: string = '';

  data: any = ['', '', '', '', ''];

  foods: any;
  types: any;

  rowFocus: number = 0;

  activated: boolean = false;

  deleteButton: boolean= false;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private toaster: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    //acceso a todos las comidas
    this.apiService.get().subscribe({
      next: (response) => {
        this.foods = response;
        //console.log(response);
        this.getFirstRow();
      },
      error: (error) => console.log(error.error),
    });

    //acceso a todos los tipos de comida
    this.apiService.getTypes().subscribe({
      next: (response) => {
        this.types = response;
        //console.log(response);
      },
      error: (error) => console.log(error.error),
    });

    //inicializacion del formulario
    this.initializeForm();
    this.registerForm.markAsTouched();
  }

  addFood() {
    this.activated = false;
    this.registerForm.reset();
    this.inputFocus.focus();
    this.rowFocus = -1;
    this.data = ['', '', '', '', '', ''];
  }

  deleteFood() {
    const idDelete = this.data.id;
    //Busamos el indice de la fila eliminada
    const indexToDelete = this.foods.findIndex(
      (food: any) => food.id === idDelete
    );

    this.apiService.remove(idDelete).subscribe({
      next: (_) => {
        for (let i = 0; i < this.foods.length; i++) {
          if (this.foods[i].id == idDelete) {
            this.foods.splice(i, 1);
            break;
          }
        }
        //vacio form tras borrar
        this.registerForm.reset();
        //Controlamos el foco (si hay datos, si es el primer elemento...)
        if (indexToDelete == 0) {
          this.rowFocus = 0;
          this.data = ['', '', '', '', '', ''];
        } else {
          this.rowFocus = indexToDelete - 1;
        }

        const row = this.foods[this.rowFocus]; // Obtener la fila superior al borrado
        if (row) {
          this.data = row;
          this.registerForm.patchValue({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            precio: row.precio,
            saludable: row.saludable,
            tipocomida: row.tipocComida,
          });
        } else {
          //si nos quedamos sin filas reseteamos
          this.registerForm.reset();
        }
      },
      error: () => this.toaster.error('Error en la eliminacion'),
    });
  }

  saveFoodApi() {
    //Comprobar si estamos añadiendo una nueva o guardando modificaciones
    if (!this.data.nombre) {
      console.log('añadiendo');
      //estamos añadiendo
      const tipoAdd: Tipo = {
        id: this.registerForm.controls['tipocomida'].value
      };
      const newFood: Comida = {
        id: 0,
        nombre: this.registerForm.controls['nombre'].value,
        descripcion: this.registerForm.controls['descripcion'].value,
        precio: this.registerForm.controls['precio'].value,
        saludable: this.registerForm.controls['saludable'].value ?? false, //fuerzo a false cuado el control valga null (no marcado)
        typeEntity: tipoAdd, //se crea una new food con el id del tipo del select
      };
      console.log('Nuevo tipo de comida seleccionado:', newFood.typeEntity);

      if (this.registerForm.status == 'VALID') {
        this.apiService.add(newFood).subscribe({
          next: (_) => {
            this.apiService.get().subscribe({
              next: (response) => {
                (this.foods = response), this.datagrid.instance.refresh();
                // Establecer el foco en la última fila agregada
                setTimeout(() => {
                  this.rowFocus = this.foods.length;
                }, 100);
                //foco en el primer input del form
                this.deleteButton = false;
                this.registerForm.markAsPristine();                
                this.inputFocus.focus();
                this.activated = false;
              },
            });
          },
          error: () => {
            this.toaster.error('Revise los datos introducidos');
          },
        });
      } else {
        this.activated = true;
        this.toaster.error(
          'No se ha podido añadir, revise los valores introducidos'
        );
      }
    } else {
      console.log('modificando');
      //estamos modificando
      const tipoAdd: Tipo = {
        id: this.registerForm.controls['tipocomida'].value
      };
      const updatedFood: Comida = {
        id: this.data.id,
        nombre: this.registerForm.controls['nombre'].value,
        descripcion: this.registerForm.controls['descripcion'].value,
        precio: this.registerForm.controls['precio'].value,
        saludable: this.registerForm.controls['saludable'].value ?? false,
        typeEntity: tipoAdd,
      };
      if (this.registerForm.status == 'VALID') {
        //Actualizacion de los datos en la api y refrescar datagrid
        this.apiService.update(this.data.id, updatedFood).subscribe({
          next: (_) => {
            this.apiService.get().subscribe({
              next: (response) => {
                console.log(response),
                (this.foods = response), this.datagrid.instance.refresh();
              },
            });
            this.registerForm.markAsPristine();
            this.inputFocus.focus();
            this.activated = false;
          },
          error: (error) => this.toaster.error(error.error),
        });
      } else {
        this.activated = true;
        this.toaster.error(
          'No se ha podido añadir, revise los valores introducidos'
        );
      }
    }
    console.log(this.foods);
  }

  getDataFromRowSelected(e: any) {
    this.activated = false;
    this.data = e.data;
    this.deleteButton = !this.data || !this.data.id;
    //Funcion para sincronizar los valores de la lista con el formulario
    this.registerForm.patchValue({
      id: e.data.id,
      nombre: e.data.nombre,
      descripcion: e.data.descripcion,
      precio: e.data.precio,
      saludable: e.data.saludable,
      tipocomida: e.data.typeEntity.id,
    });
  }

  getFirstRow() {
    if (this.foods && this.foods.length > 0) {
      const firstRow = this.foods[0]; // Obtener la primera fila
      this.data = firstRow; // Sincronizar con el objeto `data`
      this.registerForm.patchValue({
        id: firstRow.id,
        nombre: firstRow.nombre,
        descripcion: firstRow.descripcion,
        precio: firstRow.precio,
        saludable: firstRow.saludable,
        tipocomida: firstRow.typeEntity.id,
      });
      this.rowFocus = 0; // Establecer el foco en la primera fila
    } else {
      //this.toaster.warning('No hay datos disponibles en la tabla');
    }
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      //Especificamos los campos de control del formulario
      nombre: ['', [Validators.required, Validators.minLength(6)]], //validacion de 9 caracteres para el nombre
      descripcion: [''],
      precio: ['', Validators.required],
      saludable: [false],
      tipocomida: ['Seleccione un tipo de comida', Validators.required],
    });
  }
}

class Comida {
  id!: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  saludable?: boolean;
  typeEntity?: Tipo; //Objeto con id y nombre del tipo
}

class Tipo {
  id!: number;
  nombre?: string;
}
