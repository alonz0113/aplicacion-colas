const fs = require('fs');

class Ticket {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;

    }

}


class TicketControl {


    constructor() { // se inician variables

        this.ultimo = 0;
        this.hoy = new Date().getDate(); // saber que dia es hoy
        this.tickets = [];
        this.ultimos4 = [];

        try {
            let data = require('../data/data.json'); // Esto es para leer el archivo json

            if (data.hoy === this.hoy) {
                if (data.ultimo) {
                    this.ultimo = data.ultimo;
                }

                if (data.tickets) {
                    this.tickets = data.tickets;
                }

                if (data.ultimos4) {
                    this.ultimos4 = data.ultimos4;
                }

            } else {
                this.reiniciarConteo();
            }
        } catch (e) {
            this.reiniciarConteo();
        }



    }

    siguiente() {

        this.ultimo += 1;

        let ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.grabarArchivo();

        return `Ticket ${ this.ultimo }`;

    }

    getUltimoTicket() {
        return `Ticket ${ this.ultimo }`;
    }

    getUltimoTicket4() {
        return this.ultimos4;
    }


    atenderTicket(escritorio) {

        if (this.tickets.length === 0) {
            return 'No hay tickets';
        }

        let numeroTicket = this.tickets[0].numero;
        this.tickets.shift();

        let atenderTicket = new Ticket(numeroTicket, escritorio);

        this.ultimos4.unshift(atenderTicket);

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1); // borra el ultimo
        }

        console.log('Ultimos 4');
        console.log(this.ultimos4);

        this.grabarArchivo();

        return atenderTicket;

    }

    reiniciarConteo() {

        this.ultimo = 0;
        this.tickets = [];
        this.ultimos4 = [];

        console.log('Se ha inicializado el sistema');
        this.grabarArchivo();

    }

    grabarArchivo() {

        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);

    }

}





module.exports = {
    TicketControl
}