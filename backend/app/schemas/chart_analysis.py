NULLABLE_NUMBER_SCHEMA = {
    "anyOf": [
        {"type": "number"},
        {"type": "null"},
    ]
}

PRICE_ZONE_SCHEMA = {
    "type": "object",
    "properties": {
        "low": NULLABLE_NUMBER_SCHEMA,
        "high": NULLABLE_NUMBER_SCHEMA,
        "notes": {"type": "string"},
    },
    "required": ["low", "high", "notes"],
    "additionalProperties": False,
}

TRADE_SCENARIO_SCHEMA = {
    "type": "object",
    "properties": {
        "entryZone": {
            "anyOf": [
                PRICE_ZONE_SCHEMA,
                {"type": "null"},
            ]
        },
        "stop": NULLABLE_NUMBER_SCHEMA,
        "targets": {
            "type": "array",
            "items": {"type": "number"},
        },
        "invalidation": {"type": "string"},
        "confirmationNeeded": {"type": "string"},
    },
    "required": [
        "entryZone",
        "stop",
        "targets",
        "invalidation",
        "confirmationNeeded",
    ],
    "additionalProperties": False,
}

CHART_ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "extractedContext": {
            "type": "object",
            "properties": {
                "orbHigh": NULLABLE_NUMBER_SCHEMA,
                "orbLow": NULLABLE_NUMBER_SCHEMA,
                "currentPrice": NULLABLE_NUMBER_SCHEMA,
                "higherTimeframeBias": {
                    "type": "string",
                    "enum": ["bullish", "bearish", "neutral", "unclear"],
                },
                "marketCondition": {
                    "type": "string",
                    "enum": ["trending", "choppy", "range-bound", "unclear"],
                },
                "keySupportZones": {
                    "type": "array",
                    "items": PRICE_ZONE_SCHEMA,
                },
                "keyResistanceZones": {
                    "type": "array",
                    "items": PRICE_ZONE_SCHEMA,
                },
            },
            "required": [
                "orbHigh",
                "orbLow",
                "currentPrice",
                "higherTimeframeBias",
                "marketCondition",
                "keySupportZones",
                "keyResistanceZones",
            ],
            "additionalProperties": False,
        },
        "currentSetup": {
            "type": "object",
            "properties": {
                "verdict": {
                    "type": "string",
                    "enum": ["valid", "no-trade", "wait"],
                },
                "direction": {
                    "type": "string",
                    "enum": ["long", "short", "none"],
                },
                "breakoutStatus": {"type": "string"},
                "retestStatus": {"type": "string"},
                "noTradeReasons": {
                    "type": "array",
                    "items": {"type": "string"},
                },
                "warnings": {
                    "type": "array",
                    "items": {"type": "string"},
                },
            },
            "required": [
                "verdict",
                "direction",
                "breakoutStatus",
                "retestStatus",
                "noTradeReasons",
                "warnings",
            ],
            "additionalProperties": False,
        },
        "idealTradeGuidance": {
            "type": "object",
            "properties": {
                "idealLongScenario": {
                    "anyOf": [
                        TRADE_SCENARIO_SCHEMA,
                        {"type": "null"},
                    ]
                },
                "idealShortScenario": {
                    "anyOf": [
                        TRADE_SCENARIO_SCHEMA,
                        {"type": "null"},
                    ]
                },
            },
            "required": ["idealLongScenario", "idealShortScenario"],
            "additionalProperties": False,
        },
    },
    "required": ["extractedContext", "currentSetup", "idealTradeGuidance"],
    "additionalProperties": False,
}
