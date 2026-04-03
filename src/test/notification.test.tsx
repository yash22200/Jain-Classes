import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { NotificationProvider, useNotifications } from "@/context/NotificationContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NotificationProvider>{children}</NotificationProvider>
);

describe("NotificationContext", () => {
  it("initializes empty and allows sending notifications", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });
    expect(result.current.notifications).toEqual([]);

    act(() => {
      result.current.sendNotification("Test message");
    });

    expect(result.current.notifications.length).toBe(1);
    expect(result.current.notifications[0].message).toBe("Test message");
    expect(result.current.notifications[0].read).toBe(false);
  });

  it("marks notifications as read and all read", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });
    act(() => {
      result.current.sendNotification("One");
      result.current.sendNotification("Two");
    });

    const [first] = result.current.notifications;
    act(() => {
      result.current.markAsRead(first.id);
    });
    expect(result.current.notifications.find((n) => n.id === first.id)?.read).toBe(true);

    act(() => {
      result.current.markAllRead();
    });
    expect(result.current.notifications.every((n) => n.read)).toBe(true);
  });
});
