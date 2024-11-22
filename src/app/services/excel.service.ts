import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const CSV_TYPE = 'text/csv;charset=UTF-8';
// const CSV_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const CSV_EXTENSION = '.csv';

@Injectable({
  providedIn: 'root'
})

export class ExcelService {

  constructor() { }

  public exportAsCsvFile(json: any[], excelFileName: string): void {
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // this.saveAsExcelFile(excelBuffer, excelFileName);

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'csv', type: 'array' });
    // const csvOutput: string = XLSX.utils.sheet_to_csv(worksheet);

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: CSV_TYPE });
    const date = new Date();
    // const datepipe: DatePipe = new DatePipe('en-US');
    // const formattedDate = datepipe.transform(date, 'yyyyMMdd_HHmm');

    FileSaver.saveAs(data, `${fileName}${CSV_EXTENSION}`);
    // FileSaver.saveAs(data, `${fileName}_export_${formattedDate}${CSV_EXTENSION}`);
    // FileSaver.saveAs(new Blob([csvOutput]), `${fileName}_export_${new Date().getTime()}${CSV_EXTENSION}`);
  }

}
