export function logEvent(sessionId, eventName, data = {}) {
const event = { timestamp: Date.now(), session: sessionId, event: eventName, data };
console.log('Event:', event);
}