import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  role: String = localStorage.getItem('role') || '';

  displayedColumns: string[] = [
    'no',
    'name',
    'price',
    'quantity',
    'amount',
    // 'action'
  ];

  approved: boolean = false;
  approvals: any = {managers: [], count: 0};
  isItemRejected: boolean = false;
  rejectedItemName: String = '';
  rejectedItemsReasons: any[] = [];

  items: any[] = [];
  total: number = 0;
  dataSource = new MatTableDataSource<any>(this.items);

  html: String = '';

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    quantity: [
      0,
      [Validators.required, Validators.min(1), Validators.max(100000)],
    ],
    unitPrice: [0, [Validators.required, Validators.min(0.5)]],
  });
  noteForm: FormGroup = this.fb.group({
    note: ['', [Validators.required]],
  });

  constructor(private router: Router, private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit(): void {
    if (!(localStorage.getItem('loggedIn') === 'true')) {
      this.router.navigate(['/login']);
    }
    this.role = localStorage.getItem('role') || '';

    if (localStorage.getItem('approvals')) {
      this.approvals = JSON.parse(localStorage.getItem('approvals')!);
    }

    if (localStorage.getItem('rejectionReasons')) {
      this.rejectedItemsReasons = JSON.parse(
        localStorage.getItem('rejectionReasons')!
      );
    }

    if (localStorage.getItem('items')) {
      this.items = JSON.parse(localStorage.getItem('items')!);
      this.items.forEach((item) => {
        this.total += item.amount;
      });
      this.dataSource.data = this.items;
    }
  }

  submit() {
    let name = this.form.get('name')?.value;
    name = name[0].toUpperCase() + name.slice(1);
    let quantity = this.form.get('quantity')?.value;
    let unitPrice = this.form.get('unitPrice')?.value;
    let amount = quantity * unitPrice;
    this.total += amount;

    this.items.push({ name, unitPrice, quantity, amount });
    this.dataSource.data = this.items;

    this.toastr.success('Item Added..')
    this.form.reset();
    document.getElementById('name')?.focus();
  }

  submitNote() {
    const index = parseInt(localStorage.getItem('rejectedItemIndex')!);
    const itemName = localStorage.getItem('rejectedItemName') || '';
    const note = `${itemName}: ${this.noteForm.get('note')?.value}`;
    this.rejectedItemsReasons.push({note, index});
    localStorage.setItem(
      'rejectionReasons',
      JSON.stringify(this.rejectedItemsReasons)
    );
    this.isItemRejected = false;
    this.noteForm.reset();
    this.toastr.success('Note Submitted..')
  }

  remove(row: any, index: number) {
    if (this.items.indexOf(row) === index && this.role === 'employee') {
      this.items.splice(index, 1);
      this.dataSource.data = this.items;
      this.total -= row.amount;
      this.toastr.success('Item Removed..')
    }

    if (this.items.indexOf(row) === index && this.role === 'manager') {
      if (row.amount === 0) {
        return;
      }
      this.total -= row.amount;
      this.items = this.items.map((item, i) => {
        if (index === i) {
          item.quantity = 0;
          item.amount = 0;
        }
        return item;
      });
      this.dataSource.data = this.items;
      this.isItemRejected = true;
      this.toastr.success('Item Rejected..')
      localStorage.setItem('items', JSON.stringify(this.items));
      localStorage.setItem('rejectedItemName', row.name);
      localStorage.setItem('rejectedItemIndex', index.toString());
    }
  }

  submitQuotation() {
    this.toastr.success('Quotation Submitted')
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  reviewPdf() {
    this.router.navigate(['/review-pdf'])
  }

  approveQuotation() {
    const username = localStorage.getItem('username');
    if (this.approvals.managers.includes(username)) {
      return;
    }
    this.approvals.managers.push(username);
    this.approvals.count += 1;
    localStorage.setItem('approvals', JSON.stringify(this.approvals));
    this.toastr.success('Quotation Approved..')
  }
}
