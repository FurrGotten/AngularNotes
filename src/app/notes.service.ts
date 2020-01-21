import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observer} from 'rxjs';

const baseUrl = 'http://localhost:5000';

export class NoteInfo {
  id: number;
  title: string;
  createdAt: number;
} // Note id and title for our note list

export class Note {
  id: number;
  title: string;
  text: string;
  createdAt: number;
} // full Note information, needed when you chose one note

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private notes: Note[];
  private nextId = 0;
  private notesSubject = new BehaviorSubject<NoteInfo[]>([]);

  constructor(private http: HttpClient) {
    this.update();
  } // Our model constructor, and container for notes array and nextId, that marks our current id count

  subscribe(observer: Observer<NoteInfo[]>) {
    this.notesSubject.subscribe(observer);
  }

  addNote(title: string, text: string): Note {
    const note = {id: this.nextId++, title, text, createdAt: Date.now()};
    this.notes.push(note);
    this.request('post', '/notes', note).then(() => this.update());
    return note;
  } // Adds a Note to our notes Array and add +1 to our nextId

  getNote(id: number): Note {
    const index = this.findIndex(id);
    return this.notes[index];
  }

  updateNote(id: number, title: string, text: string) {
    const index = this.findIndex(id);
    const createdAt = this.notes[index].createdAt;
    const updatedNote = {id, title, text, createdAt};
    this.notes[index] = updatedNote;
    this.request('put', '/notes', updatedNote).then(() => this.update());
  }

  deleteNote(id: number) {
    const index = this.findIndex(id);
    this.notes.splice(index, 1);
    this.request('delete', `/notes?id=${id}`).then(() => this.update());
  }

  private async request(method: string, url: string, data?: any) {
    const result = this.http.request(method, `${baseUrl}${url}`, {
      body: data,
      responseType: 'json',
      observe: 'body',
    });

    return new Promise<any>((resolve, reject) => {
      result.subscribe(resolve as any, reject as any);
    });
  }

  private update() {
    this.request('get', '/notes').then(notes => {
      this.notes = notes;
      for (const note of this.notes) {
        if (note.id >= this.nextId) this.nextId = note.id + 1;
      }
      this.notesSubject.next(this.notes.map(
        note => ({id: note.id, title: note.title, createdAt: note.createdAt})
      ));
    });
  } // private update method is called to update and save our notes in the Local storage
    // also update we use for giving a new value to notesSubject

  private findIndex(id: number): number {
    for (let i = 0; i < this.notes.length; i++) {
      if (this.notes[i].id === id) return i;
    }
    throw new Error(`Note with id ${id} was not found!`);
  }
}
