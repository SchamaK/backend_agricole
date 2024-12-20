import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UtilitieService {

 /**
   * Vérifie si une date est valide selon un format et des contraintes de plage.
   * @param dateToCheck - La date à vérifier.
   * @param format - Le format attendu de la date (ex: "DD/MM/YYYY").
   * @param options - Options pour les plages minDate et maxDate.
   * @returns True si la date est valide, sinon False.
   */
 verifyDate(
    dateToCheck: string,
    format: string,
    options: { minDate?: string; maxDate?: string } = {}
  ): boolean {
    const { minDate, maxDate } = options;

    // Vérifie si la date est valide selon le format
    const isValid = moment(dateToCheck, format, true).isValid();
    if (!isValid) return false;

    const date = moment(dateToCheck, format);

    // Vérifie si la date est après la date minimale
    if (minDate && date.isBefore(moment(minDate, format))) {
      return false;
    }

    // Vérifie si la date est avant la date maximale
    if (maxDate && date.isAfter(moment(maxDate, format))) {
      return false;
    }

    return true;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Définir le nombre de rounds pour le sel
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  generateCode(moduleName: string): string {
    console.log(moduleName , "je suis le name");
    
    const date = new Date();
    const formattedDate = date.toISOString().replace(/[-:.TZ]/g, ''); // Supprime les caractères non désirés
    return `${moduleName}-${formattedDate}`;
  }

  /**
   * Formate une date au format "jj/mm/AAAA".
   * @param date - La date à formater (string, Date, ou autre format supporté par Moment.js).
   * @returns La date formatée en "jj/mm/AAAA".
   */
  formatToFrenchDate(date: string | Date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  /**
   * Formate une date en "jj/mm/AAAA, H:mm:ss".
   * @param date - La date à formater (string ou Date).
   * @returns La date formatée en "jj/mm/AAAA, H:mm:ss".
   */
  formatToFrenchDateTime(date: string | Date) {
    return moment(date).format('DD/MM/YYYY, HH:mm:ss');
  }

  /**
   * Vérifie si un numéro est un contact valide.
   * Critères :
* - 10 caractères.
   * - Commence par 01, 05 ou 09.
   * @param phoneNumber - Le numéro à vérifier.
   * @returns True si le numéro est valide, sinon False.
   */
  isValidContact(phoneNumber: string): boolean {
    const contactRegex = /^(01|05|09)\d{8}$/;
    return contactRegex.test(phoneNumber);
  }

  /**
   * Calcule la différence entre deux dates en jours.
   * @param startDate - Date de début.
   * @param endDate - Date de fin.
   * @returns La différence en jours entre les deux dates.
   */
  calculateDateDifference(startDate: string | Date, endDate: string | Date): number {
    const start = moment(startDate);
    const end = moment(endDate);
    return end.diff(start, 'days');
  }

  /**
   * Vérifie si une date donnée est un week-end.
   * @param date - La date à vérifier.
   * @returns True si la date est un week-end, sinon False.
   */
  isWeekend(date: string | Date): boolean {
    const day = moment(date).day();
    return day === 6 || day === 0; // 6 = Samedi, 0 = Dimanche
  }

  /**
   * Ajoute un nombre de jours à une date.
   * @param date - La date initiale.
   * @param days - Le nombre de jours à ajouter.
   * @returns La nouvelle date avec les jours ajoutés.
   */
  addDays(date: string | Date, days: number): string {
    return moment(date).add(days, 'days').format('DD/MM/YYYY');
  }

  /**
   * Soustrait un nombre de jours à une date.
   * @param date - La date initiale.
   * @param days - Le nombre de jours à soustraire.
   * @returns La nouvelle date avec les jours soustraits.
   */
  subtractDays(date: string | Date, days: number): string {
    return moment(date).subtract(days, 'days').format('DD/MM/YYYY');
  }
}
