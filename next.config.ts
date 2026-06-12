import type { NextConfig } from "next";

function uploadImageRemotePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "https",
      hostname: "lh3.googleusercontent.com",
    },
    {
      protocol: "https",
      hostname: "firebasestorage.googleapis.com",
    },
    {
      protocol: "https",
      hostname: "**.amazonaws.com",
    },
  ];

  const cdnRoot = process.env.NEXT_PUBLIC_CDN_ROOT_URI ?? process.env.AWS_URL;
  if (cdnRoot) {
    try {
      const { hostname, protocol } = new URL(cdnRoot);
      if (hostname) {
        patterns.push({
          protocol: protocol.replace(":", "") as "http" | "https",
          hostname,
        });
      }
    } catch {
      // Ignore invalid CDN URL in env.
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: uploadImageRemotePatterns(),
  },
};

export default nextConfig;
