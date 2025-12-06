import { useEffect, useCallback, useRef, useState } from 'react';
import { insforge } from '../lib/insforge';

export function useRealtime(
  channel: string | null,
  handlers: Record<string, (payload: any) => void>
) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!channel) return;
    
    // Avoid duplicate subscriptions to the same channel
    if (channelRef.current === channel) return;
    
    let mounted = true;

    async function setup() {
      try {
        // Connect to realtime server if not already connected
        if (!insforge.realtime.isConnected) {
          await insforge.realtime.connect();
        }
        
        if (!mounted) return;
        
        // Subscribe to channel
        const response = await insforge.realtime.subscribe(channel);
        
        if (!response.ok) {
          console.error(`[Realtime] Failed to subscribe to ${channel}:`, response.error);
          return;
        }

        if (!mounted) return;
        
        channelRef.current = channel;
        setIsConnected(true);
        console.log(`[Realtime] Subscribed to ${channel}`);

        // Create bound handlers
        const boundHandlers: Record<string, (msg: any) => void> = {};
        
        Object.entries(handlersRef.current).forEach(([event, handler]) => {
          boundHandlers[event] = (msg: any) => {
            // Only process messages for this channel
            const msgChannel = msg?.meta?.channel || msg?.channel;
            if (msgChannel && msgChannel !== channel) return;
            handler(msg);
          };
          insforge.realtime.on(event, boundHandlers[event]);
        });

        // Store cleanup function
        cleanupRef.current = () => {
          Object.entries(boundHandlers).forEach(([event, handler]) => {
            insforge.realtime.off(event, handler);
          });
          insforge.realtime.unsubscribe(channel);
          console.log(`[Realtime] Unsubscribed from ${channel}`);
        };

      } catch (error: any) {
        // Don't log error for anonymous users (expected - realtime requires auth)
        if (error?.message?.includes('Invalid token')) {
          console.log('[Realtime] Not authenticated - using polling fallback');
        } else {
          console.error('[Realtime] Setup error:', error);
        }
      }
    }

    setup();

    return () => {
      mounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      channelRef.current = null;
      setIsConnected(false);
    };
  }, [channel]);

  // Update handlers when they change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const publish = useCallback(
    async (event: string, payload: object) => {
      if (channel && insforge.realtime.isConnected) {
        try {
          await insforge.realtime.publish(channel, event, payload);
          return { ok: true };
        } catch (error) {
          console.error('[Realtime] Publish error:', error);
          return { ok: false, error };
        }
      }
      return { ok: false, error: 'Not connected' };
    },
    [channel]
  );

  return { publish, isConnected };
}
