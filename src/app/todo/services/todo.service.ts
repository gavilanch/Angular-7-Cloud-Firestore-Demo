import { Injectable } from '@angular/core';
import { Todo } from 'src/app/todo/models/todo';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TodoViewModel } from '../models/todo-view-model';
 
@Injectable({
  providedIn: 'root'
})
export class TodoService {
 
  constructor(private db: AngularFirestore) { }
 
  private todoCollectionName = 'todos';
 
  getTodos(): Observable<firebase.firestore.QuerySnapshot> {
    return this.db.collection<Todo>(this.todoCollectionName, ref => ref.orderBy('lastModifiedDate', 'desc')).get();
  }
  saveTodo(todo: Todo): Promise<DocumentReference> {
    return this.db.collection(this.todoCollectionName).add(todo);
  }
  editTodo(todo: TodoViewModel): Promise<void>{
    return this.db.collection(this.todoCollectionName).doc(todo.id).update(todo);
  }
  editTodoPartial(id: string, obj: Object): Promise<void>{
    return this.db.collection(this.todoCollectionName).doc(id).update(obj);
  }
  deleteTodo(idTodo: string): Promise<void>{
    return this.db.collection(this.todoCollectionName).doc(idTodo).delete();
  }
}
