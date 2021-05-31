import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { Task } from '../../models/task';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  addTask: FormGroup;
  tasks: Task[] = [];

  constructor(
    private fb: FormBuilder,
    public auth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
  ) {}

  ngOnInit(): void {
    this.addTask = this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
    this.getAllTask();
  }

  onAddTask() {
    const { title, description } = this.addTask.value;
    var user = firebase.auth().currentUser;
    const taskref = this.db.list('tasks');
    taskref
      .push({
        email: user.email,
        title,
        description,
      })
      .then(() => {
        this.addTask.reset();
      });
      this.reload();
  }

  async getAllTask() {
    const taskref = await this.db.list('tasks');
    var user = await firebase.auth().currentUser;

    taskref.snapshotChanges().subscribe(async (data) => {
      await data.map((task) => {
        const tempTask = task.payload.val();
        const key = task.payload.key;
        if (user['email'] === tempTask['email']) {
          this.tasks.push({
            key: key,
            title: tempTask['title'],
            description: tempTask['description'],
          });
        }
      });
    });
  }

  onLogout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['']);
    });
  }

  async deleteTask(key) {
    const taskref = await this.db.list('tasks');
    taskref.remove(key);
    this.reload();
  }

  reload(){
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
