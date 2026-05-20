"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "@/lib/swr";
import { useToast } from "@/components/ui/toast";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
}

export function NotificationToaster() {
  const { data } = useNotifications(false);
  const { toast } = useToast();
  const lastIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!data?.data) return;

    const currentIds = new Set((data.data as NotificationItem[]).map((n) => n.id));

    // On first load, just remember the IDs without toasting
    if (lastIdsRef.current.size === 0) {
      lastIdsRef.current = currentIds;
      return;
    }

    // Find new notifications
    const newNotifs = (data.data as NotificationItem[]).filter(
      (n) => !lastIdsRef.current.has(n.id) && !n.read
    );

    // Toast each new notification
    for (const notif of newNotifs) {
      toast(notif.message, notif.type === "alert" ? "warning" : "info");
    }

    lastIdsRef.current = currentIds;
  }, [data, toast]);

  return null;
}
