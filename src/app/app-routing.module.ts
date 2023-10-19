import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormComponent } from './components/form/form.component';
import { ReviewPdfComponent } from './components/review-pdf/review-pdf.component';

const PUBLIC_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'form', component: FormComponent },
  { path: 'review-pdf', component: ReviewPdfComponent },
  // { path: 'tasks/upload', component: UploadFileComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

const SECURE_ROUTES: Routes = [{}, {}, {}];

const routes: Routes = [
  { path: '', component: AppComponent, children: PUBLIC_ROUTES },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
