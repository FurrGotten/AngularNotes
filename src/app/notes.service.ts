import {Injectable} from '@angular/core';
import {BehaviorSubject, Observer} from 'rxjs';

export class NoteInfo {
  id: number;
  title: string;
}//Note id and title for our note list

export class Note {
  id: number;
  title: string;
  text: string;
}//full Note information, needed when you chose one note

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private notes: Note[];
  private nextId = 0;
  private notesSubject = new BehaviorSubject<NoteInfo[]>([]);

  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    for (const note of this.notes) {
      if (note.id >= this.nextId) this.nextId = note.id + 1;
    }
    this.update();
  }//Our model constructor, and container for notes array and nextId, that marks our current id count

  subscribe(observer: Observer<NoteInfo[]>) {
    this.notesSubject.subscribe(observer);
  }

  addNote(title: string, text: string): Note {
    const note = {id: this.nextId++, title, text};
    this.notes.push(note);
    this.update();
    return note;
  }//Adds a Note to our notes Array and add +1 to our nextId

  getNote(id: number): Note {
    const index = this.findIndex(id);
    return this.notes[index];
  }

  updateNote(id: number, title: string, text: string) {
    const index = this.findIndex(id);
    this.notes[index] = {id, title, text};
    this.update();
  }


  deleteNote(id: number) {
    const index = this.findIndex(id);
    this.notes.splice(index, 1);
    this.update();
  }

  private update() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
    this.notesSubject.next(this.notes.map(
      note => ({id: note.id, title: note.title})
    ));
  }//private update method is called to update and save our notes in the Local storage
  //also update we use for giving a new value to notesSubject

  private findIndex(id: number): number {
    for (let i = 0; i < this.notes.length; i++) {
      if (this.notes[i].id === id) return i;
    }
    throw new Error(`Note with id ${id} was not found!`);
  }
}
