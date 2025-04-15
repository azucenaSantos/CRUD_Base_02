import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {
[x: string]: any;
  @ViewChild('lista') datagrid!: DxDataGridComponent;

  listaComidas = comidas;

  model: any = {};

  editOnkeyPress = true;

  enterKeyAction: DxDataGridTypes.EnterKeyAction = 'startEdit';

  enterKeyDirection: DxDataGridTypes.EnterKeyDirection = 'row';

  constructor() {}

  ngOnInit(): void {}

  addFood() {
    //Crear nueva comida con valores del model (from)
    if (this.model.id != undefined) {
      const newFood: Comida = {
        id: this.model.id,
        nombre: this.model.nombre,
        descripcion: this.model.descripcion,
        precio: this.model.precio,
        saludable: this.model.saludable,
      };
      //Añadimos a la lista de comidas
      this.listaComidas.push(newFood);
      this.datagrid.instance.refresh();
    } else {
      alert('Debes especificar un id!');
    }
  }

  deleteFood() {
    const idDelete = this.model.idDelete;
    for (let i = 0; i < this.listaComidas.length; i++) {
      if (this.listaComidas[i].id == idDelete) {
        this.listaComidas.splice(i, 1);
        break;
      }
    }
    this.datagrid.instance.refresh();
  }

  onEditorPreparing(e: any) {
    e.editorOptions.onFocusIn = (args: any) => {  
      var input = args.element.querySelector(".dx-texteditor-input");  
      if(input != null){  
            input.select();  
      }  
    }  
  }
}

class Comida {
  id!: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  saludable?: boolean;
}

var comidas: Comida[] = [
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
];
