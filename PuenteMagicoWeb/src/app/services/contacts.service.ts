import { Injectable } from '@angular/core';

interface Contact {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  fecha: Date;
  estado: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private contacts: Contact[] = [];

  constructor() {
    if (this.isLocalStorageAvailable()) {
      const contactsSaved = localStorage.getItem('contacts');
      this.contacts = contactsSaved ? JSON.parse(contactsSaved) : [];
    } else {
      this.contacts = [];
    }
  }

  registerContacts(name: string, email: string, phone: string, subject: string, message: string): boolean {
    console.log('Intentando registrar contacto cliente:', { name, email, phone, subject, message });
    const fecha = new Date();
    const estado = 'Nuevo';
    const id = this.contacts.length + 1;

    const newConctact: Contact = { name, email, phone, subject, message, fecha, estado, id };
    this.contacts.push(newConctact);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }
    this.mostrarAlerta('Contacto cliente registrado exitosamente.', 'success');
    console.log('Contacto cliente registrado exitosamente:', newConctact);
    return true;
  }

  updateContact(name: string, email: string, phone: string, subject: string, message: string, id: number): boolean {
    console.log('Intentando actualizar contacto cliente:', { name, email, phone, subject, message, id });
    const contactExisting = this.contacts.find(contact => contact.id === id);
    const fecha = new Date();
    const estado = 'Resuelto';
    if (contactExisting) {
      const contactIndex = this.contacts.findIndex(contact => contact.id === id);
      if (contactIndex !== -1) {
        console.log('Se actualiza estado contacto cliente');
        this.contacts[contactIndex] = { name: name, email: email, phone: phone, subject: subject, message: message, fecha: fecha, estado : estado, id : id };
        localStorage.setItem('contacts', JSON.stringify(this.contacts));

        this.mostrarAlerta('Contacto cliente actualizado exitosamente.', 'success');
        console.log('Contacto cliente actualizado exitosamente:', this.contacts[contactIndex]);
        return true;
      } else {
          this.mostrarAlerta('Error al actualizar el contacto cliente.', 'danger');
          console.log('Error al actualizar el contacto cliente:', email);
          return false;
      } 
    }

    this.mostrarAlerta('Contacto cliente no actualizado.', 'danger');
    console.log('Contacto cliente no actualizado:', email);
    return false;
  }

  private mostrarAlerta(mensaje: string, tipo: string): void {
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

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  findContact(id: number): boolean {
    console.log('Buscando contacto cliente:', { id });
    const contact = this.contacts.find(contact => contact.id === id);
    if (contact) {
      this.mostrarAlerta('Contacto cliente encontrado.', 'success');
      console.log('Contacto cliente encontrado:', contact);
      return true;
    } else {
      this.mostrarAlerta('Contacto cliente no encontrado.', 'danger');
      console.log('Contacto cliente no encontrado.');
      return false;
    }
  }

  private formatToFormDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  private formatToStorageDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
}
