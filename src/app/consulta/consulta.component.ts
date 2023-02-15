import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AlertService, UserService, AuthenticationService } from '@/_services';
import { Infracao } from '@/_models/infracao.model';

@Component({ templateUrl: 'consulta.component.html' })
export class ConsultaComponent implements OnInit {
    loadedInfracao: Infracao[] = [];
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        private http: HttpClient

    ) {
        
    }


    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            placa: ['', Validators.required],
        });
    }

    private fetchInfracao() {
        const placa = this.registerForm.controls.placa.value;
        console.log(placa);

        this.http
        .get<{ [key: string]: Infracao}>('http://localhost:8080/api/infracoes/find?placa='+placa)
        .pipe(
            map(responseData => {
            const infracaoArray: Infracao[] = [];
            for (const key in responseData){
                if (responseData.hasOwnProperty(key)) {
                infracaoArray.push({...responseData[key], id: key});
                }
            }
            return infracaoArray;        
        }))
        .subscribe(infracao => {
            this.loadedInfracao = infracao;
            console.log(infracao);
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {


        this.submitted = true;

        

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.fetchInfracao();
    

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
    navigateToLogin() {
        this.router.navigate(['/login']);
      }
}
