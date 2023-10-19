import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-review-pdf',
  templateUrl: './review-pdf.component.html',
  styleUrls: ['./review-pdf.component.css'],
})
export class ReviewPdfComponent implements OnInit {
  displayedColumns: string[] = [
    'no',
    'name',
    'price',
    'quantity',
    'amount',
    // 'action'
  ];
  rejectedItemsReasons: any[] = [];

  items: any[] = [];
  total: number = 0;
  dataSource = new MatTableDataSource<any>(this.items);
  pagesNum: number = 1;

  @ViewChild('content', { static: false }) el!: ElementRef;
  constructor(private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {

    this.items = JSON.parse(localStorage.getItem('items')!);
    if (!this.items || this.items.length < 1) {
      this.router.navigate(['/form'])
    }
    this.items.forEach((item: any) => {
      this.total += item.amount;
    });
    this.dataSource.data = this.items;
    this.rejectedItemsReasons = JSON.parse(
      localStorage.getItem('rejectionReasons')!
    );
  }

  download(type: string) {
    const pdf = new jsPDF('p', 'pt', 'a4');

    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {
        this.pagesNum = pdf.getNumberOfPages();
        pdf.setProperties({ title: 'Price_Quotation.pdf', author: 'My name', creator: 'my name', subject: 'price quotation' });
        if (type === 'preview') {
          window.open(pdf.output('bloburl'));
        }
        if (type === 'download') {
          pdf.save('Price_Quotation.pdf');
  
          // remove data from local storage
          localStorage.removeItem('items');
          localStorage.removeItem('approvals');
          localStorage.removeItem('rejectionReasons');
          this.toastr.success('Quotation Downloaded..');
          this.router.navigate(['/form']);
        }
      },
    });
  }
}
