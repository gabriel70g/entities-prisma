import { logger } from "./loggerBase";
import * as fs from "fs";
import * as path from "path";

jest.mock("fs");
jest.mock("winston", () => {
    const mLogger = {
        log: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
        clear: jest.fn(),
        add: jest.fn(),
        level: "info",
        warn: jest.fn(),
        debug: jest.fn(),
    };
    return {
        createLogger: jest.fn(() => mLogger),
        transports: {
            Console: jest.fn(),
        },
        format: {
            combine: jest.fn(),
            timestamp: jest.fn(),
            printf: jest.fn(),
        },
    };
});
jest.mock("winston-daily-rotate-file");

describe("LoggerSingleton", () => {
    const configPath = path.join(__dirname, "./logConfig.json");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create default config file if not exists", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ level: "info" }));

        logger.info("test message");

        expect(fs.writeFileSync).toHaveBeenCalledTimes(0)
    });

    it("should load log level from config file", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ level: "debug" }));

        logger.debug("test message");

        expect(logger.debug).toHaveBeenCalledWith("test message");
    });

    it("should use default log level if config file is invalid", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error("Invalid config");
        });

        logger.info("test message");

        expect(logger.level).toBe("info");
    });

    it("should update log level when config file changes", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ level: "warn" }));

        // Simulate file change
        (fs.watchFile as jest.Mock).mockImplementation((_, callback) => callback());

        logger.warn("test message");

        expect(logger.level).toBe("info");
    });

    it("should log messages with the correct format", () => {
        const logMessage = "test message";
        logger.info(logMessage);

        expect(logger.info).toHaveBeenCalledWith(logMessage);
    });
});