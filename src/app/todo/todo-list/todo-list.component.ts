import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoService } from '../services/todo.service';
import { TodoViewModel } from '../models/todo-view-model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  constructor(private modalService: NgbModal,
    private todoService: TodoService) { }

  ngOnInit() {
    this.loadTodos();
  }

  todos: TodoViewModel[] = [];
  loadTodos() {
      this.todoService.getTodos().subscribe(response => {
        this.todos = [];
        response.docs.forEach(value => {
          const data = value.data();
          const id = value.id;
          const todo: TodoViewModel = {
            id: id,
            title: data.title,
            description: data.description,
            done: data.done,
            lastModifiedDate: data.lastModifiedDate.toDate()
          };
          this.todos.push(todo);
        });
      });
    }
  

  clickAddTodo() {
    const modal = this.modalService.open(TodoFormComponent);
    modal.result.then(
      this.handleModalTodoFormClose.bind(this),
      this.handleModalTodoFormClose.bind(this)
    )
  }

  handleModalTodoFormClose(response) {
    // is response an object?
    if (response === Object(response)) {
      if (response.createMode) {
        response.todo.id = response.id;
        this.todos.unshift(response.todo);
      } else {
        let index = this.todos.findIndex(value => value.id == response.id);
        this.todos[index] = response.todo;
      }
    }
  }



  checkedDone(index: number) {
    const newDoneValue = !this.todos[index].done
    this.todos[index].done = newDoneValue;
    const obj = { done: newDoneValue };
    const id = this.todos[index].id
    this.todoService.editTodoPartial(id, obj);
  }

  handleEditClick(todo: TodoViewModel) {
    const modal = this.modalService.open(TodoFormComponent);
    modal.result.then(
      this.handleModalTodoFormClose.bind(this),
      this.handleModalTodoFormClose.bind(this)
    )
    modal.componentInstance.createMode = false;
    modal.componentInstance.todo = todo;
  }

  handleDeleteClick(todoId: string, index: number) {
    this.todoService.deleteTodo(todoId)
      .then(() => {
        this.todos.splice(index, 1);
      })
      .catch(err => console.error(err));
  }



}
