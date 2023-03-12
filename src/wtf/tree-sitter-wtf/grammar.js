/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
/* eslint-disable no-undef */

module.exports = grammar({
    name: "wtf",

    rules: {
        program: ($) => repeat($._value),

        tuple: ($) => seq("(", optionalCommaSep1($._value), ")"),

        _value: ($) => choice($._literal, $.tuple),

        _literal: ($) => choice($.identifier, $.number, $.boolean, $.null),

        // wtf identifiers are JS identifiers
        identifier: ($) => {
            const alpha =
                /[^\x00-\x1F\s\p{Zs}0-9:;`"'@#.,|^&<=>+\-*/\\%?!~()\[\]{}\uFEFF\u2060\u200B]|\\u[0-9a-fA-F]{4}|\\u\{[0-9a-fA-F]+\}/;
            const alphanumeric =
                /[^\x00-\x1F\s\p{Zs}:;`"'@#.,|^&<=>+\-*/\\%?!~()\[\]{}\uFEFF\u2060\u200B]|\\u[0-9a-fA-F]{4}|\\u\{[0-9a-fA-F]+\}/;
            return token(seq(alpha, repeat(alphanumeric)));
        },

        true: ($) => "true",
        false: ($) => "false",
        boolean: ($) => choice($.true, $.false),
        null: ($) => "null",

        // wtf numbers are JS numbers:
        number: ($) => {
            const hex_literal = seq(choice("0x", "0X"), /[\da-fA-F](_?[\da-fA-F])*/);

            const decimal_digits = /\d(_?\d)*/;
            const signed_integer = seq(optional(choice("-", "+")), decimal_digits);
            const exponent_part = seq(choice("e", "E"), signed_integer);

            const binary_literal = seq(choice("0b", "0B"), /[0-1](_?[0-1])*/);

            const octal_literal = seq(choice("0o", "0O"), /[0-7](_?[0-7])*/);

            const bigint_literal = seq(
                choice(hex_literal, binary_literal, octal_literal, decimal_digits),
                "n",
            );

            const decimal_integer_literal = choice(
                "0",
                seq(optional("0"), /[1-9]/, optional(seq(optional("_"), decimal_digits))),
            );

            const decimal_literal = choice(
                seq(
                    decimal_integer_literal,
                    ".",
                    optional(decimal_digits),
                    optional(exponent_part),
                ),
                seq(".", decimal_digits, optional(exponent_part)),
                seq(decimal_integer_literal, exponent_part),
                seq(decimal_digits),
            );

            return token(
                choice(hex_literal, decimal_literal, binary_literal, octal_literal, bigint_literal),
            );
        },
    },
});

function optionalCommaSep1(rule) {
    return seq(rule, repeat(seq(optional(","), rule)));
}
