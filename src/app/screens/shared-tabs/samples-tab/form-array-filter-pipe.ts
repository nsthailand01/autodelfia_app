import { Pipe, PipeTransform } from '@angular/core';
import { FormArray } from '@angular/forms';

@Pipe({
  name: 'formArrayFilterPipe'
})
export class FormArrayFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {

    return items;

    console.log('searchText :: ', searchText);
    if (!items) { return []; }
    console.log('items pipe :: ', items);
    if (!searchText) { return items; }

    searchText = searchText.toLowerCase();
    const itemFilter = items.filter((item: any) => {
      console.log('item :: ', item);
      return (item.value.requestID === searchText);
    }); // items.filter((it) => it);
    console.log('item pipe filter :: ', itemFilter);

    return itemFilter;
  }

}
