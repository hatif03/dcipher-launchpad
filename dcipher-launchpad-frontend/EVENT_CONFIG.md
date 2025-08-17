# Event Listening Configuration

## RPC Filter Error Resolution

If you're experiencing `InvalidRequestRpcError: filter not found` errors, you can configure the event listening behavior.

### Option 1: Disable Persistent Event Listening (Recommended for problematic RPC nodes)

Add this to your `.env.local` file:
```bash
NEXT_PUBLIC_USE_PERSISTENT_EVENTS=false
```

This will:
- Disable persistent `watchContractEvent` calls that create filters
- Use only polling-based updates every 10 seconds
- Eliminate RPC filter errors
- Still provide real-time updates through periodic polling

### Option 2: Keep Persistent Events (Default)

If you don't set the environment variable or set it to `true`:
```bash
NEXT_PUBLIC_USE_PERSISTENT_EVENTS=true
```

This will:
- Use persistent event listeners for real-time updates
- Fall back to polling if events fail
- Automatically retry failed event listeners after 5 seconds

### Why This Happens

The `InvalidRequestRpcError: filter not found` error occurs when:
1. RPC nodes expire filters after a certain time
2. Network interruptions cause filter loss
3. Some RPC providers have aggressive filter cleanup policies

### Recommended Settings

- **Development/Testing**: `NEXT_PUBLIC_USE_PERSISTENT_EVENTS=false` (more stable)
- **Production with reliable RPC**: `NEXT_PUBLIC_USE_PERSISTENT_EVENTS=true` (real-time updates)
- **Production with problematic RPC**: `NEXT_PUBLIC_USE_PERSISTENT_EVENTS=false` (stable operation)

### Current Implementation

The system now includes:
- Robust error handling for event listeners
- Automatic retry mechanism for failed listeners
- Fallback polling system (always active)
- Configurable event listening strategy
