// src/library/logging.ts
import {
  blue,
  blueBright,
  yellow,
  yellowBright,
  red,
  redBright,
  green,
  greenBright,
} from "chalk";

export default class Logging {
  public static info = (args: any): void => {
    console.log(
      blue(`
  [${new Date().toLocaleString()}]
  [Log]:`),
      typeof args === "string" ? blueBright(args) : args
    );
  };

  public static warn = (args: any): void => {
    console.log(
      yellow(`
  [${new Date().toLocaleString()}]
  [Info]:`),
      typeof args === "string" ? yellowBright(args) : args
    );
  };

  public static error = (args: any): void => {
    console.log(
      red(`
  [${new Date().toLocaleString()}]
  [Warn]:`),
      typeof args === "string" ? redBright(args) : args
    );
  };

  public static log = (args: any): void => {
    console.log(
      green(`
  [${new Date().toLocaleString()}]
  [Error]:`),
      typeof args === "string" ? greenBright(args) : args
    );
  };
}
