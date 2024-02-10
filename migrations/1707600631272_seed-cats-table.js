/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
    insert into cats 
        (name, date_of_birth, color) 
    values 
        ('Kiki', '2010-09-06', 'gray'),
        ('Pika', '2010-09-06', 'black');`);
};

exports.down = (pgm) => {
    pgm.sql(`delete from cats;`);
};
