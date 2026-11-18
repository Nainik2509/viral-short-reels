import { Config } from "@remotion/cli/config";

// Vertical stories: 1080x1920 @ 30fps is set per-composition in src/Root.tsx.
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);
Config.setPixelFormat("yuv420p");
Config.setCrf(18);
