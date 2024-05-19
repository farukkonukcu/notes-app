import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc, getFirestore, onSnapshot, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { BehaviorSubject } from 'rxjs';

const firebaseConfig = {

  
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);


  login(email: string, password: string) {
    signInWithEmailAndPassword(auth, email, password).then((user) => {
      this.router.navigateByUrl('/notes');

    })
  }

  register(email: string, password: string) {
    createUserWithEmailAndPassword(auth, email, password).then(() => {
      this.router.navigateByUrl('/login');

    })
  }

  logout() {
    signOut(auth).then(() => {
      this.router.navigateByUrl('/login');
    });
  }

  addNote(noteHeader: string, noteContent: string) {
    const user = auth.currentUser;
    if (user) {
      addDoc(collection(db, 'notes'), {
        uid: user.uid,
        header: noteHeader,
        content: noteContent
      });
    }
  }


  updateNote(nid: string, noteHeader: string, noteContent: string) {
    const user = auth.currentUser;
    if (user) {
      const noteRef = doc(db, 'notes', nid);
      updateDoc(noteRef, {
        uid: user.uid,
        header: noteHeader,
        content: noteContent
      });
    }
  }


  deleteNote(id: string) {
    deleteDoc(doc(db, 'notes', id));
  }

  private notesSubject = new BehaviorSubject<any[]>([]);
  notes$ = this.notesSubject.asObservable();

  constructor() {
    this.listen();
  }

  listen() {
    onAuthStateChanged(auth, user => {
      if (user) {
        const notesQuery = query(collection(db, 'notes'), where('uid', '==', user.uid));
        onSnapshot(notesQuery, (snapshot) => {
          const notes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          this.notesSubject.next(notes);
        });
      }
    })
  }
}
