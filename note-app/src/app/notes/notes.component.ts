import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {

  constructor(private auth: AuthService) {
  }

  notes: any[] = [];
  ngOnInit() {
    this.auth.notes$.subscribe(data => {
      this.notes = data;
    });
  }

  form = new FormGroup({
    header: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required)
  });

  title = "";
  btn = "";
  id = "";

  showNewDialog() {
    const dialog: HTMLDialogElement | null = document.querySelector('.dialog');
    if (dialog) {
      dialog.showModal();
    }
    this.form = new FormGroup({
      header: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required)
    });
    this.title = "Not Ekle";
    this.btn = "Ekle";

  }
  showDialog(note: any) {
    const dialog: HTMLDialogElement | null = document.querySelector('.dialog');
    if (dialog) {
      dialog.showModal();
    }
    this.form = new FormGroup({
      header: new FormControl(note.header, Validators.required),
      content: new FormControl(note.content, Validators.required)
    });
    this.title = "Not Güncelle";
    this.btn = "Güncelle";
    this.id = note.id;
  }


  onsubmit() {
    const dialog: HTMLDialogElement | null = document.querySelector('.dialog');
    if (dialog) {
      dialog.close();
    }
    if (this.btn === "Ekle") {

      this.auth.addNote(this.form.value.header!, this.form.value.content!);

    }
    if (this.btn === "Güncelle") {
      for (const note of this.notes) {
        if (note.id == this.id) {
          this.auth.updateNote(note.id, this.form.value.header!, this.form.value.content!);
        }
      }
    }
  }

  deleteButton = (id: string) => {
    this.auth.deleteNote(id);
  }

  close() {
    this.auth.logout();
  }
}
