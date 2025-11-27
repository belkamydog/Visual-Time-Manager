
jest.mock('@zos/utils', () => ({
  log: {
    getLogger: () => ({
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    })
  }
}), { virtual: true });

jest.mock('../../utils/Constants', () => ({
  HOUR_MS: 3600000
}), { virtual: true });


import { EventsManager } from "../utils/EventsManager";


test("Event in range [15 ; 17] now 14", () => {
    const ev = new EventsManager()
    const event = { start: '2025-11-25T15:00:00',
                    end: '2025-11-25T17:00:00',
                    description: 'Time of coffee',
                    color: '0xFFD700'}
    const result = EventsManager.calculateAngles(event, new Date('2025-11-25T14:00:00'))
    expect(result.startAngle).toEqual(90)
    expect(result.endAngle).toEqual(150)
});

test("Event in range [21 ; 3] now 20", () => {
    const ev = new EventsManager()
    const event = { start: '2025-11-25T21:00:00',
                    end: '2025-11-26T03:00:00',
                    description: 'Time of coffee',
                    color: '0xFFD700'}
    const result = EventsManager.calculateAngles(event, new Date('2025-11-25T20:00:00'))
    expect(result.startAngle).toEqual(-90)
    expect(result.endAngle).toEqual(90)
});

test("Event in range [21 ; 3] now 12 end to Delete Arrow", () => {
    const event = { start: '2025-11-25T21:00:00',
                    end: '2025-11-26T03:00:00',
                    description: 'Time of coffee',
                    color: '0xFFD700'}
    const result = EventsManager.calculateAngles(event, new Date('2025-11-26T00:00:00'))
    expect(result.startAngle).toEqual(-60)
    expect(result.endAngle).toEqual(90)
});

test("Event in range [23 ; 01] now 14 end to Delete Arrow", () => {
    const event = { start: '2025-11-26T23:00:00',
                    end: '2025-11-26T01:00:00',
                    description: 'Time of coffee',
                    color: '0xFFD700'}
    const result = EventsManager.calculateAngles(event, new Date('2025-11-25T14:00:00'))
    expect(result.startAngle).toEqual(-30)
    expect(result.endAngle).toEqual(30)
});