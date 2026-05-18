const nextConfig = {
  turbopack: {
    root: process.cwd()
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb"
    }
  }
};

export default nextConfig;
