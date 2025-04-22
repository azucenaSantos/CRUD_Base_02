import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import {
  BrowserModule,
  DomSanitizer,
  SafeHtml,
} from '@angular/platform-browser';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {
  @ViewChild('lista') datagrid!: DxDataGridComponent; //acceso al componente del data-grid

  //listaComidas = comidas;
  //focusedRowKey = 5;

  model: any = {};

  editOnkeyPress = true;

  enterKeyAction: DxDataGridTypes.EnterKeyAction = 'startEdit';

  enterKeyDirection: DxDataGridTypes.EnterKeyDirection = 'row';

  taskSubject: string = '';

  taskDetailsHtml: SafeHtml | undefined;

  taskStatus: string = '';

  taskProgress: string = '';

  data: any = ['', '', '', '', ''];

  foods: any;
  sanitizer: any;
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    //acceso a todos los datos de la api
    this.apiService.get().subscribe({
      next: (response) => (this.foods = response),
      error: (error) => console.log(error.error),
    });
  }

  addFood() {
    const newFood: Comida = {
      id: this.model.id,
      nombre: this.model.nombre,
      descripcion: this.model.descripcion,
      precio: this.model.precio,
      saludable: this.model.saludable,
    };
    console.log(newFood);

    this.apiService.add(newFood).subscribe({
      next: (_) => {
        this.apiService.get().subscribe({
          next: (response) => {
            (this.foods = response), this.datagrid.instance.refresh();
          },
        });
      },
      error: (error) => this.toaster.error(error.error),
    });
  }

  deleteFood() {
    const idDelete = this.data.id;
    this.apiService.remove(idDelete).subscribe({
      next: (_) => {
        for (let i = 0; i < this.foods.length; i++) {
          if (this.foods[i].id == idDelete) {
            this.foods.splice(i, 1);
            break;
          }
        }
      },
      error: (error) => this.toaster.error(error.error),
    });
  }

  updateFoodApi() {
    if (this.data.id) { //Comprobar si hemos seleccionado un objeto de la lista
      //Objeto con datos actualizadps
      const updatedFood: Comida = {
        id: this.model.id,
        nombre: this.model.nombre,
        descripcion: this.model.descripcion,
        precio: this.model.precio,
        saludable: this.model.saludable,
      };

      //Actualizacion de los datos en la api y refrescar datagrid
      this.apiService.update(updatedFood.id, updatedFood).subscribe({
        next: (_) => {
          this.apiService.get().subscribe({
            next: (response) => {
              (this.foods = response), this.datagrid.instance.refresh();
            },
          });
        },
        error: (error) => this.toaster.error(error.error),
      });
    } else {
      this.toaster.warning('Seleccione un elemento para actualizar');
    }
  }  

  updateFoodApi2(e: any) {
    //Obtener datos modificados
    const updatedData = e.changes; //almacena un array
    console.log(updatedData);
    /*updatedData.forEach((data: any) => {
      const newFood = data.data; //todos los datos de todas las filas modificadas
      this.apiService.update(newFood.id, newFood).subscribe({
        next: (_) => this.datagrid.instance.refresh(),
        error: (error) => this.toaster.error(error.error),
      });
    });*/
  }


  getDataFromRowSelected(e: any) {
    this.data = e.data;
    //Sincronizar los valores del objeto de la lista con el model
    //para poder editarlos tras seleccionarlos
    this.model = { ...e.data };
  }

  //Selecciona todo el contenido del input a modificar
  onEditorPreparing(e: any) {
    e.editorOptions.onFocusIn = (args: any) => {
      var input = args.element.querySelector('.dx-texteditor-input');
      if (input != null) {
        input.select();
      }
    };
  }
}

class Comida {
  id!: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  saludable?: boolean;
}

/*var comidas: Comida[] = [
  {
    id: 1,
    nombre: 'Patatas',
    descripcion: 'Patatas condimentadas con diferentes especias',
    precio: 5,
    saludable: false,
  },
  {
    id: 2,
    nombre: 'Ensalada',
    descripcion: 'Variado de verduras y legumbres frescas',
    precio: 7,
    saludable: true,
  },
  {
    id: 3,
    nombre: 'Bocadillo',
    descripcion: 'Pan de masa madre con fiambre variado',
    precio: 5,
    saludable: true,
  },
  {
    id: 4,
    nombre: 'Plato combinado',
    descripcion: 'Plato que depende del menú del día',
    precio: 10,
    saludable: false,
  },
];*/
