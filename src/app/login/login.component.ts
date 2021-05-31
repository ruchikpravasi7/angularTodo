import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;


  constructor(public auth: AngularFireAuth,private router:Router,private fb: FormBuilder,) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  login() {
    const { email, password, fullName } = this.loginForm.value;
    this.auth.signInWithEmailAndPassword(email,password).then(()=>{
      this.router.navigate(['dashboard']);
    })
  }

}
