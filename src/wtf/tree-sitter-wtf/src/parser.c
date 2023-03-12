#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 14
#define LARGE_STATE_COUNT 12
#define SYMBOL_COUNT 16
#define ALIAS_COUNT 0
#define TOKEN_COUNT 9
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 0
#define MAX_ALIAS_SEQUENCE_LENGTH 4
#define PRODUCTION_ID_COUNT 1

enum {
  anon_sym_LPAREN = 1,
  anon_sym_COMMA = 2,
  anon_sym_RPAREN = 3,
  sym_identifier = 4,
  sym_true = 5,
  sym_false = 6,
  sym_null = 7,
  sym_number = 8,
  sym_program = 9,
  sym_tuple = 10,
  sym__value = 11,
  sym__literal = 12,
  sym_boolean = 13,
  aux_sym_program_repeat1 = 14,
  aux_sym_tuple_repeat1 = 15,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [anon_sym_LPAREN] = "(",
  [anon_sym_COMMA] = ",",
  [anon_sym_RPAREN] = ")",
  [sym_identifier] = "identifier",
  [sym_true] = "true",
  [sym_false] = "false",
  [sym_null] = "null",
  [sym_number] = "number",
  [sym_program] = "program",
  [sym_tuple] = "tuple",
  [sym__value] = "_value",
  [sym__literal] = "_literal",
  [sym_boolean] = "boolean",
  [aux_sym_program_repeat1] = "program_repeat1",
  [aux_sym_tuple_repeat1] = "tuple_repeat1",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [anon_sym_LPAREN] = anon_sym_LPAREN,
  [anon_sym_COMMA] = anon_sym_COMMA,
  [anon_sym_RPAREN] = anon_sym_RPAREN,
  [sym_identifier] = sym_identifier,
  [sym_true] = sym_true,
  [sym_false] = sym_false,
  [sym_null] = sym_null,
  [sym_number] = sym_number,
  [sym_program] = sym_program,
  [sym_tuple] = sym_tuple,
  [sym__value] = sym__value,
  [sym__literal] = sym__literal,
  [sym_boolean] = sym_boolean,
  [aux_sym_program_repeat1] = aux_sym_program_repeat1,
  [aux_sym_tuple_repeat1] = aux_sym_tuple_repeat1,
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [anon_sym_LPAREN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COMMA] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RPAREN] = {
    .visible = true,
    .named = false,
  },
  [sym_identifier] = {
    .visible = true,
    .named = true,
  },
  [sym_true] = {
    .visible = true,
    .named = true,
  },
  [sym_false] = {
    .visible = true,
    .named = true,
  },
  [sym_null] = {
    .visible = true,
    .named = true,
  },
  [sym_number] = {
    .visible = true,
    .named = true,
  },
  [sym_program] = {
    .visible = true,
    .named = true,
  },
  [sym_tuple] = {
    .visible = true,
    .named = true,
  },
  [sym__value] = {
    .visible = false,
    .named = true,
  },
  [sym__literal] = {
    .visible = false,
    .named = true,
  },
  [sym_boolean] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_program_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_tuple_repeat1] = {
    .visible = false,
    .named = false,
  },
};

static const TSSymbol ts_alias_sequences[PRODUCTION_ID_COUNT][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
};

static const uint16_t ts_non_terminal_alias_map[] = {
  0,
};

static const TSStateId ts_primary_state_ids[STATE_COUNT] = {
  [0] = 0,
  [1] = 1,
  [2] = 2,
  [3] = 3,
  [4] = 4,
  [5] = 5,
  [6] = 6,
  [7] = 7,
  [8] = 8,
  [9] = 9,
  [10] = 10,
  [11] = 11,
  [12] = 12,
  [13] = 13,
};

static inline bool sym_identifier_character_set_1(int32_t c) {
  return (c < 160
    ? (c < '['
      ? (c < 0
        ? c == 0
        : (c <= '#' || (c >= '%' && c <= '@')))
      : (c <= '^' || (c < '{'
        ? c == '`'
        : c <= '~')))
    : (c <= 160 || (c < 8287
      ? (c < 8192
        ? c == 5760
        : (c <= 8203 || c == 8239))
      : (c <= 8288 || (c < 65279
        ? c == 12288
        : c <= 65279)))));
}

static inline bool sym_identifier_character_set_2(int32_t c) {
  return (c < 160
    ? (c < ':'
      ? (c < 0
        ? c == 0
        : (c <= '#' || (c >= '%' && c <= '/')))
      : (c <= '@' || (c < '`'
        ? (c >= '[' && c <= '^')
        : (c <= '`' || (c >= '{' && c <= '~')))))
    : (c <= 160 || (c < 8287
      ? (c < 8192
        ? c == 5760
        : (c <= 8203 || c == 8239))
      : (c <= 8288 || (c < 65279
        ? c == 12288
        : c <= 65279)))));
}

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(16);
      if (lookahead == '(') ADVANCE(17);
      if (lookahead == ')') ADVANCE(19);
      if (lookahead == ',') ADVANCE(18);
      if (lookahead == '.') ADVANCE(8);
      if (lookahead == '0') ADVANCE(35);
      if (lookahead == '\\') ADVANCE(1);
      if (lookahead == 'f') ADVANCE(20);
      if (lookahead == 'n') ADVANCE(29);
      if (lookahead == 't') ADVANCE(26);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (('1' <= lookahead && lookahead <= '9')) ADVANCE(36);
      if (!sym_identifier_character_set_1(lookahead)) ADVANCE(30);
      END_STATE();
    case 1:
      if (lookahead == 'u') ADVANCE(2);
      END_STATE();
    case 2:
      if (lookahead == '{') ADVANCE(13);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'F') ||
          ('a' <= lookahead && lookahead <= 'f')) ADVANCE(15);
      END_STATE();
    case 3:
      if (lookahead == '}') ADVANCE(30);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'F') ||
          ('a' <= lookahead && lookahead <= 'f')) ADVANCE(3);
      END_STATE();
    case 4:
      if (lookahead == '+' ||
          lookahead == '-') ADVANCE(10);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(41);
      END_STATE();
    case 5:
      if (lookahead == '0' ||
          lookahead == '1') ADVANCE(37);
      END_STATE();
    case 6:
      if (('0' <= lookahead && lookahead <= '7')) ADVANCE(38);
      END_STATE();
    case 7:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(36);
      END_STATE();
    case 8:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(42);
      END_STATE();
    case 9:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(40);
      END_STATE();
    case 10:
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(41);
      END_STATE();
    case 11:
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'F') ||
          ('a' <= lookahead && lookahead <= 'f')) ADVANCE(30);
      END_STATE();
    case 12:
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'F') ||
          ('a' <= lookahead && lookahead <= 'f')) ADVANCE(39);
      END_STATE();
    case 13:
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'F') ||
          ('a' <= lookahead && lookahead <= 'f')) ADVANCE(3);
      END_STATE();
    case 14:
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'F') ||
          ('a' <= lookahead && lookahead <= 'f')) ADVANCE(11);
      END_STATE();
    case 15:
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'F') ||
          ('a' <= lookahead && lookahead <= 'f')) ADVANCE(14);
      END_STATE();
    case 16:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 17:
      ACCEPT_TOKEN(anon_sym_LPAREN);
      END_STATE();
    case 18:
      ACCEPT_TOKEN(anon_sym_COMMA);
      END_STATE();
    case 19:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 20:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '\\') ADVANCE(1);
      if (lookahead == 'a') ADVANCE(23);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 21:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '\\') ADVANCE(1);
      if (lookahead == 'e') ADVANCE(31);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 22:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '\\') ADVANCE(1);
      if (lookahead == 'e') ADVANCE(32);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 23:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '\\') ADVANCE(1);
      if (lookahead == 'l') ADVANCE(27);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 24:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '\\') ADVANCE(1);
      if (lookahead == 'l') ADVANCE(33);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 25:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '\\') ADVANCE(1);
      if (lookahead == 'l') ADVANCE(24);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 26:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '\\') ADVANCE(1);
      if (lookahead == 'r') ADVANCE(28);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 27:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '\\') ADVANCE(1);
      if (lookahead == 's') ADVANCE(22);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 28:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '\\') ADVANCE(1);
      if (lookahead == 'u') ADVANCE(21);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 29:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '\\') ADVANCE(1);
      if (lookahead == 'u') ADVANCE(25);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 30:
      ACCEPT_TOKEN(sym_identifier);
      if (lookahead == '\\') ADVANCE(1);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 31:
      ACCEPT_TOKEN(sym_true);
      if (lookahead == '\\') ADVANCE(1);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 32:
      ACCEPT_TOKEN(sym_false);
      if (lookahead == '\\') ADVANCE(1);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 33:
      ACCEPT_TOKEN(sym_null);
      if (lookahead == '\\') ADVANCE(1);
      if (!sym_identifier_character_set_2(lookahead)) ADVANCE(30);
      END_STATE();
    case 34:
      ACCEPT_TOKEN(sym_number);
      END_STATE();
    case 35:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '.') ADVANCE(43);
      if (lookahead == '0') ADVANCE(40);
      if (lookahead == 'B' ||
          lookahead == 'b') ADVANCE(5);
      if (lookahead == 'E' ||
          lookahead == 'e') ADVANCE(4);
      if (lookahead == 'O' ||
          lookahead == 'o') ADVANCE(6);
      if (lookahead == 'X' ||
          lookahead == 'x') ADVANCE(12);
      if (lookahead == '_') ADVANCE(9);
      if (lookahead == 'n') ADVANCE(34);
      if (('1' <= lookahead && lookahead <= '9')) ADVANCE(36);
      END_STATE();
    case 36:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '.') ADVANCE(43);
      if (lookahead == 'E' ||
          lookahead == 'e') ADVANCE(4);
      if (lookahead == '_') ADVANCE(7);
      if (lookahead == 'n') ADVANCE(34);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(36);
      END_STATE();
    case 37:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '_') ADVANCE(5);
      if (lookahead == 'n') ADVANCE(34);
      if (lookahead == '0' ||
          lookahead == '1') ADVANCE(37);
      END_STATE();
    case 38:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '_') ADVANCE(6);
      if (lookahead == 'n') ADVANCE(34);
      if (('0' <= lookahead && lookahead <= '7')) ADVANCE(38);
      END_STATE();
    case 39:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '_') ADVANCE(12);
      if (lookahead == 'n') ADVANCE(34);
      if (('0' <= lookahead && lookahead <= '9') ||
          ('A' <= lookahead && lookahead <= 'F') ||
          ('a' <= lookahead && lookahead <= 'f')) ADVANCE(39);
      END_STATE();
    case 40:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '_') ADVANCE(9);
      if (lookahead == 'n') ADVANCE(34);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(40);
      END_STATE();
    case 41:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == '_') ADVANCE(10);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(41);
      END_STATE();
    case 42:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == 'E' ||
          lookahead == 'e') ADVANCE(4);
      if (lookahead == '_') ADVANCE(8);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(42);
      END_STATE();
    case 43:
      ACCEPT_TOKEN(sym_number);
      if (lookahead == 'E' ||
          lookahead == 'e') ADVANCE(4);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(42);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 0},
  [2] = {.lex_state = 0},
  [3] = {.lex_state = 0},
  [4] = {.lex_state = 0},
  [5] = {.lex_state = 0},
  [6] = {.lex_state = 0},
  [7] = {.lex_state = 0},
  [8] = {.lex_state = 0},
  [9] = {.lex_state = 0},
  [10] = {.lex_state = 0},
  [11] = {.lex_state = 0},
  [12] = {.lex_state = 0},
  [13] = {.lex_state = 0},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [anon_sym_LPAREN] = ACTIONS(1),
    [anon_sym_COMMA] = ACTIONS(1),
    [anon_sym_RPAREN] = ACTIONS(1),
    [sym_identifier] = ACTIONS(1),
    [sym_true] = ACTIONS(1),
    [sym_false] = ACTIONS(1),
    [sym_null] = ACTIONS(1),
    [sym_number] = ACTIONS(1),
  },
  [1] = {
    [sym_program] = STATE(13),
    [sym_tuple] = STATE(5),
    [sym__value] = STATE(5),
    [sym__literal] = STATE(5),
    [sym_boolean] = STATE(5),
    [aux_sym_program_repeat1] = STATE(5),
    [ts_builtin_sym_end] = ACTIONS(3),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_identifier] = ACTIONS(7),
    [sym_true] = ACTIONS(9),
    [sym_false] = ACTIONS(9),
    [sym_null] = ACTIONS(7),
    [sym_number] = ACTIONS(11),
  },
  [2] = {
    [sym_tuple] = STATE(3),
    [sym__value] = STATE(3),
    [sym__literal] = STATE(3),
    [sym_boolean] = STATE(3),
    [aux_sym_tuple_repeat1] = STATE(3),
    [anon_sym_LPAREN] = ACTIONS(5),
    [anon_sym_COMMA] = ACTIONS(13),
    [anon_sym_RPAREN] = ACTIONS(15),
    [sym_identifier] = ACTIONS(17),
    [sym_true] = ACTIONS(9),
    [sym_false] = ACTIONS(9),
    [sym_null] = ACTIONS(17),
    [sym_number] = ACTIONS(19),
  },
  [3] = {
    [sym_tuple] = STATE(4),
    [sym__value] = STATE(4),
    [sym__literal] = STATE(4),
    [sym_boolean] = STATE(4),
    [aux_sym_tuple_repeat1] = STATE(4),
    [anon_sym_LPAREN] = ACTIONS(5),
    [anon_sym_COMMA] = ACTIONS(13),
    [anon_sym_RPAREN] = ACTIONS(21),
    [sym_identifier] = ACTIONS(23),
    [sym_true] = ACTIONS(9),
    [sym_false] = ACTIONS(9),
    [sym_null] = ACTIONS(23),
    [sym_number] = ACTIONS(25),
  },
  [4] = {
    [sym_tuple] = STATE(4),
    [sym__value] = STATE(4),
    [sym__literal] = STATE(4),
    [sym_boolean] = STATE(4),
    [aux_sym_tuple_repeat1] = STATE(4),
    [anon_sym_LPAREN] = ACTIONS(27),
    [anon_sym_COMMA] = ACTIONS(30),
    [anon_sym_RPAREN] = ACTIONS(33),
    [sym_identifier] = ACTIONS(35),
    [sym_true] = ACTIONS(38),
    [sym_false] = ACTIONS(38),
    [sym_null] = ACTIONS(35),
    [sym_number] = ACTIONS(41),
  },
  [5] = {
    [sym_tuple] = STATE(6),
    [sym__value] = STATE(6),
    [sym__literal] = STATE(6),
    [sym_boolean] = STATE(6),
    [aux_sym_program_repeat1] = STATE(6),
    [ts_builtin_sym_end] = ACTIONS(44),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_identifier] = ACTIONS(46),
    [sym_true] = ACTIONS(9),
    [sym_false] = ACTIONS(9),
    [sym_null] = ACTIONS(46),
    [sym_number] = ACTIONS(48),
  },
  [6] = {
    [sym_tuple] = STATE(6),
    [sym__value] = STATE(6),
    [sym__literal] = STATE(6),
    [sym_boolean] = STATE(6),
    [aux_sym_program_repeat1] = STATE(6),
    [ts_builtin_sym_end] = ACTIONS(50),
    [anon_sym_LPAREN] = ACTIONS(52),
    [sym_identifier] = ACTIONS(55),
    [sym_true] = ACTIONS(58),
    [sym_false] = ACTIONS(58),
    [sym_null] = ACTIONS(55),
    [sym_number] = ACTIONS(61),
  },
  [7] = {
    [sym_tuple] = STATE(2),
    [sym__value] = STATE(2),
    [sym__literal] = STATE(2),
    [sym_boolean] = STATE(2),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_identifier] = ACTIONS(64),
    [sym_true] = ACTIONS(9),
    [sym_false] = ACTIONS(9),
    [sym_null] = ACTIONS(64),
    [sym_number] = ACTIONS(66),
  },
  [8] = {
    [sym_tuple] = STATE(12),
    [sym__value] = STATE(12),
    [sym__literal] = STATE(12),
    [sym_boolean] = STATE(12),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_identifier] = ACTIONS(68),
    [sym_true] = ACTIONS(9),
    [sym_false] = ACTIONS(9),
    [sym_null] = ACTIONS(68),
    [sym_number] = ACTIONS(70),
  },
  [9] = {
    [ts_builtin_sym_end] = ACTIONS(72),
    [anon_sym_LPAREN] = ACTIONS(72),
    [anon_sym_COMMA] = ACTIONS(72),
    [anon_sym_RPAREN] = ACTIONS(72),
    [sym_identifier] = ACTIONS(74),
    [sym_true] = ACTIONS(74),
    [sym_false] = ACTIONS(74),
    [sym_null] = ACTIONS(74),
    [sym_number] = ACTIONS(72),
  },
  [10] = {
    [ts_builtin_sym_end] = ACTIONS(76),
    [anon_sym_LPAREN] = ACTIONS(76),
    [anon_sym_COMMA] = ACTIONS(76),
    [anon_sym_RPAREN] = ACTIONS(76),
    [sym_identifier] = ACTIONS(78),
    [sym_true] = ACTIONS(78),
    [sym_false] = ACTIONS(78),
    [sym_null] = ACTIONS(78),
    [sym_number] = ACTIONS(76),
  },
  [11] = {
    [ts_builtin_sym_end] = ACTIONS(80),
    [anon_sym_LPAREN] = ACTIONS(80),
    [anon_sym_COMMA] = ACTIONS(80),
    [anon_sym_RPAREN] = ACTIONS(80),
    [sym_identifier] = ACTIONS(82),
    [sym_true] = ACTIONS(82),
    [sym_false] = ACTIONS(82),
    [sym_null] = ACTIONS(82),
    [sym_number] = ACTIONS(80),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 2,
    ACTIONS(33), 4,
      anon_sym_LPAREN,
      anon_sym_COMMA,
      anon_sym_RPAREN,
      sym_number,
    ACTIONS(84), 4,
      sym_identifier,
      sym_true,
      sym_false,
      sym_null,
  [13] = 1,
    ACTIONS(86), 1,
      ts_builtin_sym_end,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(12)] = 0,
  [SMALL_STATE(13)] = 13,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_program, 0),
  [5] = {.entry = {.count = 1, .reusable = true}}, SHIFT(7),
  [7] = {.entry = {.count = 1, .reusable = false}}, SHIFT(5),
  [9] = {.entry = {.count = 1, .reusable = false}}, SHIFT(9),
  [11] = {.entry = {.count = 1, .reusable = true}}, SHIFT(5),
  [13] = {.entry = {.count = 1, .reusable = true}}, SHIFT(8),
  [15] = {.entry = {.count = 1, .reusable = true}}, SHIFT(10),
  [17] = {.entry = {.count = 1, .reusable = false}}, SHIFT(3),
  [19] = {.entry = {.count = 1, .reusable = true}}, SHIFT(3),
  [21] = {.entry = {.count = 1, .reusable = true}}, SHIFT(11),
  [23] = {.entry = {.count = 1, .reusable = false}}, SHIFT(4),
  [25] = {.entry = {.count = 1, .reusable = true}}, SHIFT(4),
  [27] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_tuple_repeat1, 2), SHIFT_REPEAT(7),
  [30] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_tuple_repeat1, 2), SHIFT_REPEAT(8),
  [33] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_tuple_repeat1, 2),
  [35] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_tuple_repeat1, 2), SHIFT_REPEAT(4),
  [38] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_tuple_repeat1, 2), SHIFT_REPEAT(9),
  [41] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_tuple_repeat1, 2), SHIFT_REPEAT(4),
  [44] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_program, 1),
  [46] = {.entry = {.count = 1, .reusable = false}}, SHIFT(6),
  [48] = {.entry = {.count = 1, .reusable = true}}, SHIFT(6),
  [50] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_program_repeat1, 2),
  [52] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_program_repeat1, 2), SHIFT_REPEAT(7),
  [55] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_program_repeat1, 2), SHIFT_REPEAT(6),
  [58] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_program_repeat1, 2), SHIFT_REPEAT(9),
  [61] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_program_repeat1, 2), SHIFT_REPEAT(6),
  [64] = {.entry = {.count = 1, .reusable = false}}, SHIFT(2),
  [66] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [68] = {.entry = {.count = 1, .reusable = false}}, SHIFT(12),
  [70] = {.entry = {.count = 1, .reusable = true}}, SHIFT(12),
  [72] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_boolean, 1),
  [74] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_boolean, 1),
  [76] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_tuple, 3),
  [78] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_tuple, 3),
  [80] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_tuple, 4),
  [82] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_tuple, 4),
  [84] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_tuple_repeat1, 2),
  [86] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
};

#ifdef __cplusplus
extern "C" {
#endif
#ifdef _WIN32
#define extern __declspec(dllexport)
#endif

extern const TSLanguage *tree_sitter_wtf(void) {
  static const TSLanguage language = {
    .version = LANGUAGE_VERSION,
    .symbol_count = SYMBOL_COUNT,
    .alias_count = ALIAS_COUNT,
    .token_count = TOKEN_COUNT,
    .external_token_count = EXTERNAL_TOKEN_COUNT,
    .state_count = STATE_COUNT,
    .large_state_count = LARGE_STATE_COUNT,
    .production_id_count = PRODUCTION_ID_COUNT,
    .field_count = FIELD_COUNT,
    .max_alias_sequence_length = MAX_ALIAS_SEQUENCE_LENGTH,
    .parse_table = &ts_parse_table[0][0],
    .small_parse_table = ts_small_parse_table,
    .small_parse_table_map = ts_small_parse_table_map,
    .parse_actions = ts_parse_actions,
    .symbol_names = ts_symbol_names,
    .symbol_metadata = ts_symbol_metadata,
    .public_symbol_map = ts_symbol_map,
    .alias_map = ts_non_terminal_alias_map,
    .alias_sequences = &ts_alias_sequences[0][0],
    .lex_modes = ts_lex_modes,
    .lex_fn = ts_lex,
    .primary_state_ids = ts_primary_state_ids,
  };
  return &language;
}
#ifdef __cplusplus
}
#endif
