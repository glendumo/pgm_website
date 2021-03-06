// imports
import { BAAS } from '../services';

// class to display contacts
class ContactsList {
  // get the data of contacts from the BAAS
  // sort the data based on the name
  async getContacts () {
    const contacts = await BAAS.getContacts();
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    return contacts.map(contact => `
    <div class="col-9 col-md-6 col-lg-3">
      <div class="card contact__list-item">
        <img src="${contact.thumbnail}" alt="Image of ${contact.name}" class="card__image">
        <div class="d-flex card__info">
          <i class="fas fa-user no-borders"></i>
          <p>${contact.name}</p>
        </div>
        <div class="d-flex card__info">
          <i class="fas fa-wrench no-borders"></i>
          <p>${contact.function}</p>
        </div>
        <div class="d-flex card__info">
          <i class="fas fa-envelope no-borders"></i>
          <a href="${contact.email_href}" target="_blank">${contact.email}</a>
        </div>
      </div>
    </div>
    `).join('');
  }

  // render the content
  async render () {
    return `
      ${await this.getContacts()}
    `;
  }

  async afterRender () {
    // Connect the listeners
    return this;
  }
}

// exporting the class
export default ContactsList;
