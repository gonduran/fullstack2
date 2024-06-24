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
  private storageKey = 'contacts';

  constructor() {
    if (this.isLocalStorageAvailable()) {
      const contactsSaved = localStorage.getItem('contacts');
      this.contacts = contactsSaved ? JSON.parse(contactsSaved) : [];
    } else {
      this.contacts = [];
    }
  }

  /**
   * @description
   * Registra un nuevo contacto en la lista y en localStorage.
   * 
   * @param {string} name - El nombre del contacto.
   * @param {string} email - El correo electrónico del contacto.
   * @param {string} phone - El número de teléfono del contacto.
   * @param {string} subject - El asunto del contacto.
   * @param {string} message - El mensaje del contacto.
   * @return {boolean} - Retorna true si el contacto fue registrado exitosamente, de lo contrario false.
   */
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

  /**
   * @description
   * Actualiza un contacto existente en la lista y en localStorage.
   * 
   * @param {string} name - El nombre del contacto.
   * @param {string} email - El correo electrónico del contacto.
   * @param {string} phone - El número de teléfono del contacto.
   * @param {string} subject - El asunto del contacto.
   * @param {string} message - El mensaje del contacto.
   * @param {number} id - El ID del contacto a actualizar.
   * @return {boolean} - Retorna true si el contacto fue actualizado exitosamente, de lo contrario false.
   */
  updateContacts(name: string, email: string, phone: string, subject: string, message: string, id: number): boolean {
    console.log('Intentando actualizar contacto cliente:', { name, email, phone, subject, message, id });
    const contactExisting = this.contacts.find(contact => contact.id === id);
    const fecha = new Date();
    const estado = 'Procesado';
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

  /**
   * @description
   * Muestra una alerta en la interfaz de usuario.
   * 
   * @param {string} mensaje - El mensaje de la alerta.
   * @param {string} tipo - El tipo de alerta (e.g., 'success', 'danger').
   */
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

  /**
   * @description
   * Verifica si localStorage está disponible.
   * 
   * @return {boolean} - Retorna true si localStorage está disponible, de lo contrario false.
   */
  isLocalStorageAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @description
   * Busca un contacto por ID.
   * 
   * @param {number} id - El ID del contacto a buscar.
   * @return {boolean} - Retorna true si el contacto fue encontrado, de lo contrario false.
   */
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

  /**
   * @description
   * Obtiene todos los contactos almacenados en localStorage.
   * 
   * @return {Contact[]} - Retorna un arreglo de contactos.
   */
  getContacts(): Contact[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  /**
   * @description
   * Agrega un nuevo contacto a la lista y a localStorage.
   * 
   * @param {Contact} contact - El contacto a agregar.
   */
  addContact(contact: Contact): void {
    const contacts = this.getContacts();
    contacts.push(contact);
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
  }

  /**
   * @description
   * Actualiza un contacto existente en la lista y en localStorage.
   * 
   * @param {number} index - El índice del contacto a actualizar.
   * @param {Contact} updatedContact - El contacto actualizado.
   */
  updateContact(index: number, updatedContact: Contact): void {
    const contacts = this.getContacts();
    contacts[index] = updatedContact;
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
  }

  /**
   * @description
   * Elimina un contacto de la lista y de localStorage.
   * 
   * @param {number} index - El índice del contacto a eliminar.
   */
  deleteContact(index: number): void {
    const contacts = this.getContacts();
    contacts.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
  }
}
