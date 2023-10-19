# PdfGen

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.6.

- - - -

## Dependancies
* jspdf version 2.5.1 - Run `npm i jspdf --save`
* ngx-toastr version  13.2.1 - Run `npm i ngx-toastr@13.2.1 --save`
* bootstrap version  5.3.2 - Run `npm i bootstrap --save`
* @angular/material version  14.2.7 - Run `ng add @angular/material@14.2.7 --save`

### OR 
Clone the project `git clone https://github.com/MoawiaMaw/Html-To-Pdf.git` and Run `npm i`
 
## Development server

Run `ng serve` Or `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Notes

* Users are saved on Json file `users.json` on assets folders and are called with `HttpClientModule`
* To login please choose one of the users specified on the folder with the credentials
* Employee User can remove added item by clicking on the row and before all managers approves the quotation
* Manager user can reject item by clicking on the on the row - the item quantity will then be 0

