import { Card } from "type/card";
import { createMachine } from "xstate";

export const gameMachine = createMachine({
  "id": "Game",
  "initial": "Table",
  "states": {
    "Table": {
      "initial": "Idle",
      "states": {
        "Idle": {
          "on": {
            "Add player": [
              {
                "target": "Players Ready",
                "cond": "Maximum players"
              },
              {}
            ],
            "Ready": {
              "target": "Players Ready"
            }
          }
        },
        "Players Ready": {
          "on": {
            "Prepare": {
              "target": "Game prepared",
              "actions": [
                "Shuffle",
                "Deal"
              ]
            }
          }
        },
        "Game prepared": {
          "type": "final"
        }
      },
      "on": {
        "Play": {
          "target": "Round"
        }
      }
    },
    "Round": {
      "initial": "Start",
      "states": {
        "Start": {
          "on": {
            "Play card": {
              "target": "Played"
            }
          }
        },
        "Played": {}
      }
    }
  }
  ,
  schema: {
    context: {} as {

    },
    events: {} as { "type": "Add player" } | { "type": "Prepare" } | { "type": "Ready" } | { "type": "Play" } | { "type": "Play card" }
  },
  context: {},
  predictableActionArguments: true,
  preserveActionOrder: true,
})