import dns from "dns";
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // এটি দিয়ে পৃথিবীর যেকোনো HTTPS ডোমেইনের ইমেজ লোড হবে
      },
      {
        protocol: 'http',
        hostname: '**', // এটি দিয়ে যেকোনো HTTP ডোমেইনের ইমেজও লোড হবে
      },
    ],
  },
};

export default nextConfig;