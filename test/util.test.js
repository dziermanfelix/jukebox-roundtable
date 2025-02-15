import { comparePassword, hashPassword } from '../utils/passwordUtils';
import { convertMsToDisplayTime, currentTimeSeconds, delay } from '../utils/time';

describe('util', () => {
  it('hash password', async () => {
    const password = '12345abcdefghijkl!@#$%';
    const hashedPassword = await hashPassword(password);
    const compare = await comparePassword(password, hashedPassword);
    expect(compare).toBe(true);
  });

  it('delay', async () => {
    const before = currentTimeSeconds();
    await delay(1000);
    const after = currentTimeSeconds();
    expect(after).not.toBe(before);
  });

  it('display time', async () => {
    let ms = '0';
    let displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('0:00');

    ms = '5000';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('0:05');

    ms = '85863';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('1:25');

    ms = '100000';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('1:40');

    ms = '112493';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('1:52');

    ms = '171333';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('2:51');

    ms = '216001';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('3:36');

    ms = '343838';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('5:43');

    ms = '512345';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('8:32');

    ms = '1099999';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('18:19');

    ms = '3600000';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('1:00:00');

    ms = '5400000';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('1:30:00');

    ms = '34383668';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('9:33:03');

    ms = '67653246';
    displayTime = convertMsToDisplayTime(ms);
    expect(displayTime).toBe('18:47:33');
  });
});
