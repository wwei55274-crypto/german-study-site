module.exports = {
  apps: [
    {
      name: "grok-bridge",
      script: "./start-ai-bridge.sh",
      interpreter: "bash",
      cwd: __dirname,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
