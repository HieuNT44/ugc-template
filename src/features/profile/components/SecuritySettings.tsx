"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Laptop, Monitor, Shield, Smartphone } from "lucide-react";

type SessionItem = {
  id: string;
  device: string;
  deviceIcon: "Monitor" | "Smartphone" | "Laptop";
  location: string;
  lastActive: string;
  current: boolean;
};

const MOCK_SESSIONS: SessionItem[] = [
  {
    id: "1",
    device: "Chrome on macOS",
    deviceIcon: "Laptop",
    location: "Hanoi, Vietnam",
    lastActive: "Now",
    current: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    deviceIcon: "Smartphone",
    location: "Hanoi, Vietnam",
    lastActive: "2 hours ago",
    current: false,
  },
];

function DeviceIcon({ type }: { type: SessionItem["deviceIcon"] }) {
  switch (type) {
    case "Smartphone":
      return <Smartphone className='size-4' />;
    case "Laptop":
      return <Laptop className='size-4' />;
    default:
      return <Monitor className='size-4' />;
  }
}

export function SecuritySettings() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [sessions, setSessions] = useState<SessionItem[]>(MOCK_SESSIONS);

  return (
    <div className='SecuritySettings space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='size-5' />
            Two-factor authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-wrap items-center gap-2'>
          <span className='text-muted-foreground text-sm'>Status:</span>
          <span className='bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium'>
            {twoFAEnabled ? "Enabled" : "Disabled"}
          </span>
          {!twoFAEnabled ? (
            <Button size='sm' onClick={() => setTwoFAEnabled(true)}>
              Enable 2FA
            </Button>
          ) : (
            <Button
              size='sm'
              variant='outline'
              onClick={() => setTwoFAEnabled(false)}
            >
              Disable 2FA
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Monitor className='size-5' />
            Active sessions
          </CardTitle>
          <CardDescription>
            Devices where you are currently signed in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className='space-y-3'>
            {sessions.map((session) => (
              <li
                key={session.id}
                className='flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3'
              >
                <div className='flex min-w-0 items-center gap-3'>
                  <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-md'>
                    <DeviceIcon type={session.deviceIcon} />
                  </div>
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium'>
                      {session.device}
                      {session.current && (
                        <span className='bg-muted text-muted-foreground ml-2 rounded px-1.5 py-0.5 text-xs'>
                          This device
                        </span>
                      )}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {session.location} · Last active: {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-destructive hover:text-destructive'
                    onClick={() =>
                      setSessions((prev) =>
                        prev.filter((item) => item.id !== session.id)
                      )
                    }
                  >
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification code</CardTitle>
          <CardDescription>Placeholder for 2FA setup flow.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input placeholder='6-digit code' className='max-w-xs' disabled />
        </CardContent>
      </Card>
    </div>
  );
}
