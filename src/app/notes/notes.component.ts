import { Component, OnInit } from '@angular/core';
import { Note, NoteInfo, NotesService } from '../notes.service';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const notSelectedNote = {id:-1, title: '', text:'', createdAt: Date.now()}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})//references to View elements for View elements have direct direct access to properties
export class NotesComponent implements OnInit {
  notes = new BehaviorSubject<NoteInfo[]>([]);
  currentNote: Note = notSelectedNote;
  createNote = false;
  editNote = false;
  editNoteForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private notesModel: NotesService) { }

  ngOnInit() {
    this.notesModel.subscribe(this.notes);
    this.editNoteForm = this.formBuilder.group({
      title: ['', Validators.required],
      text: ['', Validators.required]
    });
  }

  onSelectNote(id: number) {
    this.currentNote = this.notesModel.getNote(id);
  }

  noteSelected(): boolean {
    return this.currentNote.id >= 0;
  }

  onNewNote() {
    this.editNoteForm.reset();
    this.createNote = true;
    this.editNote = true;
  }

  onEditNote() {
    if (this.currentNote.id < 0) return;
    this.editNoteForm.get('title').setValue(this.currentNote.title);
    this.editNoteForm.get('text').setValue(this.currentNote.text);
    this.createNote = false;
    this.editNote = true;
  }

  onDeleteNote() {
    if (this.currentNote.id < 0) return;
    this.notesModel.deleteNote(this.currentNote.id);
    this.currentNote = {id:-1, title: '', text:'', createdAt: Date.now()};
    this.editNote = false;
  }

  updateNote() {
    if (!this.editNoteForm.valid) return;
    const title = this.editNoteForm.get('title').value;
    const text = this.editNoteForm.get('text').value;
    if (this.createNote) {
      this.currentNote = this.notesModel.addNote(title, text);
    } else {
      const id = this.currentNote.id;
      this.notesModel.updateNote(id, title, text);
      this.currentNote = notSelectedNote;
    }
    this.editNote = false;
  }
}
//file contains what we do in different note changes
