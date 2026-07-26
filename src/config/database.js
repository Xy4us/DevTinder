const mongoose = require("mongoose");
const dns = require("dns");

// Set public DNS fallback (Google/Cloudflare) to resolve MongoDB SRV records on systems where ISP/router DNS fails
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if setting custom DNS servers fails in restricted environment
}

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;

