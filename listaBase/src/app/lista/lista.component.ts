import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {
  @ViewChild('lista') datagrid!: DxDataGridComponent; //acceso al componente del data-grid

  //listaComidas = comidas;

  model: any = {};

  editOnkeyPress = true;

  enterKeyAction: DxDataGridTypes.EnterKeyAction = 'startEdit';

  enterKeyDirection: DxDataGridTypes.EnterKeyDirection = 'row';

  foods: any = {}; //vacio por defecto
  constructor(private http: HttpClient, private apiService: ApiService) {}

  ngOnInit(): void {
    //acceso a todos los datos de la api
    this.apiService.get().subscribe({
      next: (response) => (this.foods = response),
      error: (error) => console.log(error),
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

    this.apiService.add(newFood).subscribe({
      next: (_) => {
        this.apiService.get().subscribe({
          next: (response) => {
            (this.foods = response), this.datagrid.instance.refresh();
          },
          error: (error) => console.log(error),
        });
      },
    });

    /*//Crear nueva comida con valores del model (from)
    if (this.model.id != undefined) {
      const newFood: Comida = {
        id: this.model.id,
        nombre: this.model.nombre,
        descripcion: this.model.descripcion,
        precio: this.model.precio,
        saludable: this.model.saludable,
      };
      //Añadimos a la lista de comidas
      this.foods.push(newFood);
      this.datagrid.instance.refresh();
    } else {
      alert('Debes especificar un id!');
    }*/
  }

  deleteFood() {
    const idDelete = this.model.idDelete;
    console.log(idDelete);
    this.apiService.remove(idDelete).subscribe({
      next: (_) => {
        for (let i = 0; i < this.foods.length; i++) {
          if (this.foods[i].id == idDelete) {
            this.foods.splice(i, 1);
            break;
          }
        }
      },
    });
    /*const idDelete = this.model.idDelete;
    for (let i = 0; i < this.foods.length; i++) {
      if (this.foods[i].id == idDelete) {
        this.foods.splice(i, 1);
        break;
      }
    }
    this.datagrid.instance.refresh();*/
  }

  onEditorPreparing(e: any) {
    e.editorOptions.onFocusIn = (args: any) => {
      var input = args.element.querySelector('.dx-texteditor-input');
      if (input != null) {
        input.select();
      }
    };
  }

  updateFoodApi(e: any) {
    //Obtener datos modificados
    const updatedData = e.changes; //almacena un array
    updatedData.forEach((data: any) => {
      const newFood = data.data; //todos los datos de todas las filas modificadas
      this.apiService.update(newFood.id, newFood).subscribe({
        next: (_) => this.datagrid.instance.refresh(),
        error: (error) => console.log(error),
      });
    });
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
