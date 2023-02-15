import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {HttpClient } from '@angular/common/http';
import { AlertService, UserService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'cadastro.component.html' })
export class CadastroComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        //private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        private http: HttpClient
        
    ) 
    {
       
        // redirect to home if already logged in
        /*if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }*/
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            id: ['', Validators.required],
            placa: ['', Validators.required],
            valor: ['', Validators.required],
            observacao: ['', Validators.required],
            local: ['', Validators.required],
            veiculo: ['', Validators.required],
            data: ['', [Validators.required, ]]
        });
        
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls;
        
    }

    onSubmit() {
        this.submitted = true;

        console.log(this.registerForm.controls.id.value);
        //send http request
        
        const postData = {
            id: this.registerForm.controls.id.value,
            placa: this.registerForm.controls.placa.value,
            valor: this.registerForm.controls.valor.value,
            observacoes: this.registerForm.controls.observacao.value,
            local: this.registerForm.controls.local.value,
            veiculo: this.registerForm.controls.veiculo.value,
            data: this.registerForm.controls.data.value,
          };
        
        //Cors example
        const headers = { 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*', }
        this.http.post('http://localhost:8080/api/infracoes/',postData,{headers}).subscribe(responseData => {
            console.log(responseData);
            this.alertService.success('Cadastro realizado com sucesso', true);
            this.router.navigate(['/cadastro']);
        });
        // reset alerts on submit
        this.alertService.clear();
        

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Cadastro realizado com sucesso', true);
                    this.router.navigate(['/cadastro']);
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
