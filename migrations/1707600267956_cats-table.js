/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql(`
    create table cats (
        id serial primary key,
        name varchar(240),
        date_of_birth TIMESTAMPTZ,
        color varchar(50),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`);
};

exports.down = (pgm) => {
    pgm.sql(`drop table cats;`);
};
