import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;
  form: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (
      localStorage.getItem('loggedIn') &&
      localStorage.getItem('loggedIn') === 'true'
    ) {
      this.router.navigate(['/form']);
    }
  }

  submit() {
    const username = this.form.get('username')?.value;
    const password = this.form.get('password')?.value;
    this.http.get('assets/users.json').subscribe({
      next: (resp: any) => {
        const userRecord = resp.users.filter(
          (user: any) => user.username === username
        )[0];

        if (!userRecord || password !== userRecord.password) {
          this.toastr.error('Invalid Credentials..');
          this.form.reset();
          document.getElementById('username')?.focus();
          return;
        }
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('role', userRecord.role);
        localStorage.setItem('username', userRecord.username);
        this.toastr.success('Logged In Successfully..');
        this.router.navigate(['/form']);
      },
      error: (error) => {
        this.toastr.error('Sorry, Something went wrong!');
      },
    });
  }
}
