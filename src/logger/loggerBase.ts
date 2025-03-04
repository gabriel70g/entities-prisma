import * as winston from "winston";
import * as fs from "fs";
import * as path from "path";
import * as DailyRotateFile from "winston-daily-rotate-file";

const configPath = path.join(__dirname, "./logConfig.json");
console.log(`📁 Config file path: ${configPath}`);

class LoggerSingleton {
  private static instance: winston.Logger;
  private static logLevel: string = "info";

  private constructor() {}

  // 📌 Load log level from file
  private static loadLogLevel(): string {
    try {
      if (!fs.existsSync(configPath)) {
        console.log("⚠️ Config file not found, creating default config...");
        fs.writeFileSync(configPath, JSON.stringify({ level: "info" }, null, 2));
      }
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return config.level || "info";
    } catch (error) {
      console.error("❌ Error loading log level, using default: info");
      return "info";
    }
  }

  // 📌 Create the logger with Winston
  private static createLogger(): winston.Logger {
    this.logLevel = this.loadLogLevel();

    return winston.createLogger({
      level: this.logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const levelUpperCase = level.toUpperCase()
          return `${timestamp} [${levelUpperCase}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: "logs/application-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxSize: "20m",
          maxFiles: "14d"
        })
      ]
    });
  }

  // 📌 Get the unique instance of the logger
  public static getLogger(): winston.Logger {
    if (!this.instance) {
      this.instance = this.createLogger();
      this.watchConfigFile();
    }
    return this.instance;
  }

  // 📌 Watcher to detect changes in logConfig.json and update Winston
  private static watchConfigFile() {
    fs.watchFile(configPath, () => {
      console.log("♻️ Reloading log level from config...");
      this.logLevel = this.loadLogLevel();
      this.instance.level = this.logLevel;
  
      // 🔄 Reiniciar los transportes para asegurar la persistencia
      this.instance.clear();
      this.instance.add(new winston.transports.Console());
      this.instance.add(new DailyRotateFile({
        filename: "logs/application-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        maxFiles: "14d"
      }));
  
      console.log(`✅ Log level updated to: ${this.instance.level}`);
    });
  }
}

// 📌 Export the singleton
export const logger = LoggerSingleton.getLogger();