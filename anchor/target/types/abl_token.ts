/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/abl_token.json`.
 */
export type AblToken = {
  "address": "4TWJqDPLsLbUR25o8WvGG3ptMStNLC4gKYRZXXXUC9u3",
  "metadata": {
    "name": "ablToken",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "attachToMint",
      "discriminator": [
        203,
        132,
        125,
        16,
        50,
        249,
        174,
        252
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "extraMetasAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  116,
                  114,
                  97,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  109,
                  101,
                  116,
                  97,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "changeMode",
      "discriminator": [
        124,
        163,
        122,
        208,
        67,
        22,
        162,
        241
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "changeModeArgs"
            }
          }
        }
      ]
    },
    {
      "name": "initConfig",
      "discriminator": [
        23,
        235,
        115,
        232,
        168,
        96,
        1,
        231
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initMint",
      "discriminator": [
        126,
        176,
        233,
        16,
        66,
        117,
        209,
        125
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "extraMetasAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  116,
                  114,
                  97,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  109,
                  101,
                  116,
                  97,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initMintArgs"
            }
          }
        }
      ]
    },
    {
      "name": "initWallet",
      "discriminator": [
        141,
        132,
        233,
        130,
        168,
        183,
        10,
        119
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "wallet"
        },
        {
          "name": "abWallet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  98,
                  95,
                  119,
                  97,
                  108,
                  108,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "wallet"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initWalletArgs"
            }
          }
        }
      ]
    },
    {
      "name": "removeWallet",
      "discriminator": [
        26,
        151,
        38,
        109,
        151,
        162,
        104,
        28
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "abWallet",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "txHook",
      "discriminator": [
        105,
        37,
        101,
        197,
        75,
        251,
        102,
        26
      ],
      "accounts": [
        {
          "name": "sourceTokenAccount"
        },
        {
          "name": "mint"
        },
        {
          "name": "destinationTokenAccount"
        },
        {
          "name": "ownerDelegate"
        },
        {
          "name": "metaList"
        },
        {
          "name": "abWallet"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "abWallet",
      "discriminator": [
        111,
        162,
        31,
        45,
        79,
        239,
        198,
        72
      ]
    },
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidMetadata",
      "msg": "Invalid metadata"
    },
    {
      "code": 6001,
      "name": "walletNotAllowed",
      "msg": "Wallet not allowed"
    },
    {
      "code": 6002,
      "name": "amountNotAllowed",
      "msg": "Amount not allowed"
    },
    {
      "code": 6003,
      "name": "walletBlocked",
      "msg": "Wallet blocked"
    }
  ],
  "types": [
    {
      "name": "abWallet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "allowed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "changeModeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mode",
            "type": {
              "defined": {
                "name": "mode"
              }
            }
          },
          {
            "name": "threshold",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "initMintArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "mintAuthority",
            "type": "pubkey"
          },
          {
            "name": "freezeAuthority",
            "type": "pubkey"
          },
          {
            "name": "permanentDelegate",
            "type": "pubkey"
          },
          {
            "name": "transferHookAuthority",
            "type": "pubkey"
          },
          {
            "name": "mode",
            "type": {
              "defined": {
                "name": "mode"
              }
            }
          },
          {
            "name": "threshold",
            "type": "u64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "initWalletArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "mode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "allow"
          },
          {
            "name": "block"
          },
          {
            "name": "mixed"
          }
        ]
      }
    }
  ]
};
