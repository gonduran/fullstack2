import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * @description 
 * Interface de Mensajes de Contacto.
 */
export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  fecha: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 1ea3bf3a-4c70-4f76-9c84-c5a078fdaa10'
    })
  }

  private jsonUrl = 'https://firebasestorage.googleapis.com/v0/b/puentemagicojson.appspot.com/o/contacts.json?alt=media&token=1ea3bf3a-4c70-4f76-9c84-c5a078fdaa10'; 

  /**
   * @description 
   * Constructor del servicio. Inicializa el servicio HTTP.
   * 
   * @param {HttpClient} http - Servicio HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {}

  /**
   * @description 
   * Sobrescribe el archivo JSON con la lista de mensajes de contacto proporcionada.
   * 
   * @param {Contact[]} listaContactos - La lista de mensajes de contacto a sobrescribir en el archivo JSON.
   * @return {void}
   */
  MetodoContacto(listaContactos: Contact[]): void {
    console.log('listaContactos', listaContactos);
    this.http.post(this.jsonUrl, listaContactos, this.httpOptions).subscribe(
      response => {
        console.log('MetodoContacto: Archivo JSON sobrescrito con éxito', response);
      },
      error => {
        console.error('MetodoContacto: Error al sobrescribir el archivo JSON', error);
      }
    );
  }

  /**
   * @description 
   * Obtiene la lista de mensajes de contacto desde el archivo JSON.
   * 
   * @return {Observable<Contact[]>} - Un observable con la lista de mensajes de contacto.
   */
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.jsonUrl).pipe(
      catchError(error => {
        console.error('Error al recuperar clientes:', error);
        return throwError(error);
      })
    );
  }

  /**
   * @description 
   * Agrega un nuevo mensaje de contacto a la lista.
   * 
   * @param {Contact} newContact - Los datos del nuevo mensaje de contacto.
   * @return {Observable<Contact[]>} - Un observable con la lista de mensajes de contacto actualizada.
   */
  addContact(newContact: Contact): Observable<Contact[]> {
    return this.getContacts().pipe(
      map(contacts => {
        newContact.id = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
        contacts.push(newContact);
        this.MetodoContacto(contacts);
        return contacts;
      }),
      catchError(error => {
        console.error('Error al agregar mensaje de contacto:', error);
        return throwError(error);
      })
    );
  }

  /**
   * @description 
   * Muestra una alerta en la interfaz de usuario.
   * 
   * @param {string} mensaje - El mensaje de la alerta.
   * @param {string} tipo - El tipo de alerta (e.g., 'success', 'danger').
   * @return {void}
   */
  mostrarAlerta(mensaje: string, tipo: string): void {
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alert alert-${tipo}`;
    alertaDiv.appendChild(document.createTextNode(mensaje));
    const container = document.querySelector('.container');
    if (container) {
      const firstChild = container.firstChild;
      if (firstChild) {
        container.insertBefore(alertaDiv, firstChild);
      } else {
        container.appendChild(alertaDiv);
      }

      setTimeout(() => {
        const alerta = document.querySelector('.alert');
        if (alerta) {
          alerta.remove();
        }
      }, 6000);
    }
  }

  /**
   * @description 
   * Formatea una fecha en formato YYYY-MM-DD a DD-MM-YYYY.
   * 
   * @param {string} date - La fecha en formato YYYY-MM-DD.
   * @return {string} - La fecha formateada en formato DD-MM-YYYY.
   */
  private formatToFormDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  /**
   * @description 
   * Formatea una fecha en formato DD-MM-YYYY a YYYY-MM-DD.
   * 
   * @param {string} date - La fecha en formato DD-MM-YYYY.
   * @return {string} - La fecha formateada en formato YYYY-MM-DD.
   */
  private formatToStorageDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
}