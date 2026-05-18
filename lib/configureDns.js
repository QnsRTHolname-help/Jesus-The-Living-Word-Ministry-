import dns from "dns";

let configured = false;

export function configureDns() {
  if (configured) return;
  configured = true;

  if (process.env.MONGODB_DNS_SERVERS) {
    dns.setServers(process.env.MONGODB_DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean));
    return;
  }

  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}
